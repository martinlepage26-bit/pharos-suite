"""
Import the AI governance deliverables package into CompassAI.

This script loads the markdown governance bundle into CompassAI's Mongo-backed
collections and can optionally bootstrap the initial policy library, training
catalog, and default governance committee records.
"""
from __future__ import annotations

import argparse
import asyncio
from datetime import datetime, timezone
from pathlib import Path
import sys
import uuid


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from config import client, db  # noqa: E402
from governance_catalog import load_governance_artifact_bundle, infer_policy_links  # noqa: E402
from models import GovernanceCommittee, GovernancePolicy, TrainingModule  # noqa: E402


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def upsert_artifacts(bundle_dir: Path | None) -> list[dict]:
    imported: list[dict] = []

    for record in load_governance_artifact_bundle(bundle_dir):
        existing = await db.governance_artifacts.find_one({"slug": record["slug"]}, {"_id": 0, "id": 1, "created_at": 1})
        artifact_id = existing["id"] if existing else str(uuid.uuid4())
        payload = {
            "id": artifact_id,
            **record,
            "created_at": existing.get("created_at", _iso_now()) if existing else _iso_now(),
            "updated_at": _iso_now(),
        }
        await db.governance_artifacts.update_one({"slug": record["slug"]}, {"$set": payload}, upsert=True)
        imported.append({"id": artifact_id, "slug": record["slug"], "title": record["title"]})

    return imported


async def bootstrap_policies() -> list[dict]:
    created: list[dict] = []
    artifacts = await db.governance_artifacts.find({}, {"_id": 0}).to_list(100)

    for artifact in artifacts:
        if artifact.get("artifact_type") not in {"framework", "policy-library", "incident-plan", "contract-template", "committee-charter"}:
            continue

        if await db.governance_policies.find_one({"slug": artifact["slug"]}, {"_id": 0, "id": 1}):
            continue

        policy = GovernancePolicy(
            slug=artifact["slug"],
            title=artifact["title"],
            artifact_id=artifact["id"],
            policy_domain=artifact.get("policy_domain") or artifact.get("artifact_type"),
            summary=artifact.get("summary", ""),
            tags=artifact.get("tags", []),
            linked_control_ids=artifact.get("linked_control_ids", []),
            linked_system_ids=infer_policy_links(artifact.get("content_markdown", "")),
        )
        document = policy.model_dump()
        document["created_at"] = policy.created_at.isoformat()
        await db.governance_policies.insert_one(document)
        created.append({"id": policy.id, "slug": policy.slug, "title": policy.title})

    return created


async def bootstrap_training() -> list[dict]:
    created: list[dict] = []
    artifacts = await db.governance_artifacts.find({"artifact_type": "training-plan"}, {"_id": 0}).to_list(20)

    for artifact in artifacts:
        if await db.training_modules.find_one({"slug": artifact["slug"]}, {"_id": 0, "id": 1}):
            continue

        module = TrainingModule(
            slug=artifact["slug"],
            title=artifact["title"],
            artifact_id=artifact["id"],
            summary=artifact.get("summary", ""),
            competencies=artifact.get("competencies", []),
            linked_control_ids=artifact.get("linked_control_ids", []),
            linked_risk_tiers=["ELEVATED", "HIGH"],
            recommended_for_roles=["assessor", "system-owner", "committee-member"],
            duration_minutes=90,
        )
        document = module.model_dump()
        document["created_at"] = module.created_at.isoformat()
        await db.training_modules.insert_one(document)
        created.append({"id": module.id, "slug": module.slug, "title": module.title})

    return created


async def bootstrap_committee(committee_name: str) -> dict | None:
    existing = await db.governance_committees.find_one({"name": committee_name}, {"_id": 0})
    if existing:
        return {"id": existing["id"], "name": existing["name"], "status": "existing"}

    charter = await db.governance_artifacts.find_one({"artifact_type": "committee-charter"}, {"_id": 0, "id": 1, "title": 1})
    committee = GovernanceCommittee(
        name=committee_name,
        charter_artifact_id=charter.get("id") if charter else None,
        purpose="Provide cross-functional decision rights and escalation coverage for enterprise AI governance.",
        responsibilities=[
            "Review high-risk assessments and evidence gaps",
            "Approve material control exceptions and mitigation plans",
            "Track incidents, third-party dependencies, and remediation progress",
        ],
        meeting_cadence="monthly",
        chair_name="Executive Sponsor",
        decision_rules=[
            "Escalate high-risk or blocked assessments",
            "Require recorded rationale for approvals, rejections, and accepted risk",
            "Document follow-up owners and due dates for all committee decisions",
        ],
    )
    document = committee.model_dump()
    document["created_at"] = committee.created_at.isoformat()
    await db.governance_committees.insert_one(document)
    return {"id": committee.id, "name": committee.name, "status": "created"}


async def main() -> None:
    parser = argparse.ArgumentParser(description="Import CompassAI governance deliverables.")
    parser.add_argument("--bundle-dir", type=Path, default=None, help="Directory containing the markdown deliverables package")
    parser.add_argument("--skip-policies", action="store_true", help="Skip bootstrapping governance policies")
    parser.add_argument("--skip-training", action="store_true", help="Skip bootstrapping training modules")
    parser.add_argument("--skip-committee", action="store_true", help="Skip bootstrapping the default governance committee")
    parser.add_argument("--committee-name", default="Enterprise AI Governance Committee", help="Name for the default governance committee")
    args = parser.parse_args()

    bundle_dir = args.bundle_dir.expanduser() if args.bundle_dir else None
    if bundle_dir and not bundle_dir.exists():
        raise SystemExit(f"Bundle directory not found: {bundle_dir}")

    artifacts = await upsert_artifacts(bundle_dir)
    policies = [] if args.skip_policies else await bootstrap_policies()
    training = [] if args.skip_training else await bootstrap_training()
    committee = None if args.skip_committee else await bootstrap_committee(args.committee_name)

    print(
        {
            "artifacts_imported": len(artifacts),
            "policies_created": len(policies),
            "training_modules_created": len(training),
            "committee": committee,
        }
    )

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
