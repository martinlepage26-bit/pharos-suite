"""
Attach governance package context to clients, AI systems, and assessments.

This script links the imported governance artifacts and training modules to the
records CompassAI already manages so assessments can surface the right policies,
committee paths, and training actions in context.
"""
from __future__ import annotations

import argparse
import asyncio
from pathlib import Path
import sys


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from compassai.backend.config import client, db  # noqa: E402
from compassai.backend.governance_catalog import build_training_recommendations  # noqa: E402


def _artifact_ref(artifact: dict, required: bool = False) -> dict:
    return {
        "artifact_id": artifact["id"],
        "artifact_type": artifact.get("artifact_type", "governance-artifact"),
        "title": artifact["title"],
        "summary": artifact.get("summary", ""),
        "tags": artifact.get("tags", []),
        "required": required,
        "linked_control_ids": artifact.get("linked_control_ids", []),
        "taxonomy": artifact.get("taxonomy"),
    }


async def _lookup_artifacts() -> dict:
    artifacts = await db.governance_artifacts.find({}, {"_id": 0}).to_list(100)
    return {artifact["slug"]: artifact for artifact in artifacts}


async def _lookup_training_modules() -> list[dict]:
    return await db.training_modules.find({}, {"_id": 0}).to_list(200)


async def link_clients(force: bool = False) -> int:
    committee_ids = [row["id"] for row in await db.governance_committees.find({}, {"_id": 0, "id": 1}).to_list(20)]
    updated = 0

    async for client_record in db.clients.find({}, {"_id": 0}):
        governance_profile = client_record.get("governance_profile", {}) or {}
        desired = {
            "governance_committee_ids": committee_ids,
            "policy_library_status": "loaded",
            "training_program_status": "available",
            "incident_response_owner": governance_profile.get("incident_response_owner") or client_record.get("primary_contact", {}).get("email"),
        }

        if not force and governance_profile.get("policy_library_status") and governance_profile.get("governance_committee_ids"):
            continue

        governance_profile.update(desired)
        await db.clients.update_one({"id": client_record["id"]}, {"$set": {"governance_profile": governance_profile}})
        updated += 1

    return updated


async def link_systems(force: bool = False) -> int:
    artifacts = await _lookup_artifacts()
    policies = await db.governance_policies.find({}, {"_id": 0}).to_list(100)
    updated = 0

    base_policy_ids = [
        policy["id"]
        for policy in policies
        if policy["slug"] in {"ai-governance-framework", "policy-library"}
    ]
    incident_policy_ids = [
        policy["id"]
        for policy in policies
        if policy["slug"] == "incident-response-plan"
    ]
    vendor_policy_ids = [
        policy["id"]
        for policy in policies
        if policy["slug"] == "third-party-ai-contract-template"
    ]

    async for system_record in db.ai_systems.find({}, {"_id": 0}):
        inventory_profile = system_record.get("inventory_profile", {}) or {}
        applicable_policy_ids = list(system_record.get("applicable_policy_ids", []))
        linked_control_ids = list(system_record.get("linked_control_ids", []))

        desired_policy_ids = list(base_policy_ids)
        desired_control_ids = []

        if system_record.get("high_stakes"):
            desired_policy_ids.extend(incident_policy_ids)
            desired_control_ids.extend(["GOV-03", "MON-03", "MON-04"])

        if inventory_profile.get("vendor_name"):
            desired_policy_ids.extend(vendor_policy_ids)
            desired_control_ids.extend(["TPRM-01", "TPRM-02"])

        for artifact_slug in ("ai-system-inventory",):
            artifact = artifacts.get(artifact_slug)
            if artifact:
                desired_control_ids.extend(artifact.get("linked_control_ids", []))

        merged_policy_ids = sorted(set(applicable_policy_ids + desired_policy_ids))
        merged_control_ids = sorted(set(linked_control_ids + desired_control_ids))

        if not force and merged_policy_ids == applicable_policy_ids and merged_control_ids == linked_control_ids:
            continue

        await db.ai_systems.update_one(
            {"id": system_record["id"]},
            {
                "$set": {
                    "applicable_policy_ids": merged_policy_ids,
                    "linked_control_ids": merged_control_ids,
                }
            },
        )
        updated += 1

    return updated


async def link_assessments(force: bool = False) -> int:
    artifacts = await _lookup_artifacts()
    policies = {row["id"]: row for row in await db.governance_policies.find({}, {"_id": 0}).to_list(100)}
    training_modules = await _lookup_training_modules()
    updated = 0

    async for assessment in db.assessments.find({}, {"_id": 0}):
        system = await db.ai_systems.find_one({"id": assessment["ai_system_id"]}, {"_id": 0})
        if not system:
            continue

        policy_ids = list(system.get("applicable_policy_ids", []))
        criteria = assessment.get("criteria", {}) or {}
        workflow = assessment.get("workflow", {}) or {}
        governance_artifacts = assessment.get("governance_artifacts", []) or []

        if governance_artifacts and criteria.get("applicable_policy_ids") and not force:
            continue

        desired_artifacts: list[dict] = []
        for artifact_slug in ("ai-governance-framework", "policy-library", "ai-system-inventory"):
            artifact = artifacts.get(artifact_slug)
            if artifact:
                desired_artifacts.append(_artifact_ref(artifact, required=True))

        for policy_id in policy_ids:
            policy = policies.get(policy_id)
            if not policy or not policy.get("artifact_id"):
                continue
            artifact = next((row for row in artifacts.values() if row["id"] == policy["artifact_id"]), None)
            if artifact:
                desired_artifacts.append(_artifact_ref(artifact, required=artifact["slug"] != "executive-sponsor-briefing"))

        if system.get("high_stakes") or system.get("decision_role") == "Automated":
            briefing = artifacts.get("executive-sponsor-briefing")
            charter = artifacts.get("governance-committee-charter")
            if briefing:
                desired_artifacts.append(_artifact_ref(briefing, required=True))
            if charter:
                desired_artifacts.append(_artifact_ref(charter, required=True))
            workflow["committee_required"] = True
            criteria["executive_visibility_required"] = True

        merged_artifacts = {
            item["artifact_id"]: item for item in governance_artifacts + desired_artifacts if item.get("artifact_id")
        }
        criteria["applicable_policy_ids"] = sorted(set(policy_ids))
        criteria["linked_control_ids"] = sorted(set(criteria.get("linked_control_ids", []) + system.get("linked_control_ids", [])))
        workflow.setdefault("current_stage", "intake")
        workflow.setdefault("allowed_next_stages", ["evidence_collection", "review", "approval", "monitoring"])

        recommendations = build_training_recommendations(assessment.get("result", {}) or {}, training_modules)
        recommendation_ids = [item["training_module_id"] for item in recommendations]

        await db.assessments.update_one(
            {"id": assessment["id"]},
            {
                "$set": {
                    "criteria": criteria,
                    "workflow": workflow,
                    "governance_artifacts": list(merged_artifacts.values()),
                    "training_recommendation_ids": recommendation_ids,
                }
            },
        )
        updated += 1

    return updated


async def main() -> None:
    parser = argparse.ArgumentParser(description="Link CompassAI governance package records to platform entities.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing governance context instead of only filling gaps")
    args = parser.parse_args()

    client_updates = await link_clients(force=args.force)
    system_updates = await link_systems(force=args.force)
    assessment_updates = await link_assessments(force=args.force)

    print(
        {
            "clients_updated": client_updates,
            "systems_updated": system_updates,
            "assessments_updated": assessment_updates,
        }
    )

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
