"""Planning stubs for the CompassAI D1/R2 migration.

These helpers keep runtime behavior untouched.

They generate endpoint-shaped D1/R2 write plans so we can validate:

- use-case lineage
- evidence ingest behavior
- recursive governance cycles
- audit trail shape

before moving persistence off Mongo.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _new_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex}"


@dataclass
class D1InsertPlan:
    table: str
    values: Dict[str, Any]


@dataclass
class D1UpdatePlan:
    table: str
    key: Dict[str, Any]
    values: Dict[str, Any]


@dataclass
class D1ReadPlan:
    table: str
    filters: Dict[str, Any]
    purpose: str


@dataclass
class R2FetchPlan:
    bucket: str
    object_key: str
    purpose: str


@dataclass
class MigrationWritePlan:
    endpoint: str
    d1_reads: List[D1ReadPlan] = field(default_factory=list)
    d1_inserts: List[D1InsertPlan] = field(default_factory=list)
    d1_updates: List[D1UpdatePlan] = field(default_factory=list)
    r2_fetches: List[R2FetchPlan] = field(default_factory=list)
    notes: List[str] = field(default_factory=list)


class CompassAIMigrationPlanner:
    """Generate D1/R2 write plans for CompassAI endpoint migration."""

    evidence_bucket = "govern-evidence"

    def plan_create_use_case(
        self,
        *,
        use_case_id: str,
        name: str,
        purpose: str,
        business_owner: str,
        systems_involved_json: List[Dict[str, Any]],
        data_categories_json: List[str],
        automation_level: str,
        regulated_domain: bool,
        known_unknowns_json: List[str],
        client_id: Optional[str] = None,
    ) -> MigrationWritePlan:
        """Stub for `POST /api/v1/use-cases`."""
        now = iso_now()
        cycle_id = _new_id("cycle")

        plan = MigrationWritePlan(endpoint="POST /api/v1/use-cases")
        plan.d1_inserts.extend(
            [
                D1InsertPlan(
                    table="use_cases",
                    values={
                        "id": use_case_id,
                        "client_id": client_id,
                        "name": name,
                        "purpose": purpose,
                        "business_owner": business_owner,
                        "systems_involved_json": systems_involved_json,
                        "data_categories_json": data_categories_json,
                        "automation_level": automation_level,
                        "regulated_domain": 1 if regulated_domain else 0,
                        "known_unknowns_json": known_unknowns_json,
                        "status": "intake_complete",
                        "current_gate": "intake_complete",
                        "created_at": now,
                        "updated_at": now,
                    },
                ),
                D1InsertPlan(
                    table="governance_cycles",
                    values={
                        "id": cycle_id,
                        "use_case_id": use_case_id,
                        "parent_cycle_id": None,
                        "cycle_index": 1,
                        "open_reason": "intake_complete",
                        "status": "open",
                        "opened_at": now,
                        "closed_at": None,
                    },
                ),
                D1InsertPlan(
                    table="audit_events",
                    values={
                        "id": _new_id("audit"),
                        "aggregate_type": "use_case",
                        "aggregate_id": use_case_id,
                        "event_type": "use_case_created",
                        "actor_type": "user",
                        "cycle_id": cycle_id,
                        "event_payload_json": {"name": name, "regulated_domain": regulated_domain},
                        "created_at": now,
                    },
                ),
            ]
        )
        plan.notes.append("Intake complete is an opening governance state, not approval.")
        return plan

    def plan_ingest_evidence(
        self,
        *,
        use_case_id: str,
        package_id: str,
        package_hash: str,
        payload_object_key: str,
        version: int,
        producer: str,
        artifact_type: str,
        hash_verified: bool,
    ) -> MigrationWritePlan:
        """Stub for `POST /api/v1/evidence`."""
        now = iso_now()
        plan = MigrationWritePlan(endpoint="POST /api/v1/evidence")
        plan.r2_fetches.append(
            R2FetchPlan(
                bucket=self.evidence_bucket,
                object_key=payload_object_key,
                purpose="validate evidence package payload before governance ingest",
            )
        )
        plan.d1_reads.append(D1ReadPlan(table="use_cases", filters={"id": use_case_id}, purpose="load active use case"))

        if not hash_verified:
            plan.notes.append("Hash verification failed. Evidence should not be promoted into the governance record.")
            return plan

        plan.d1_inserts.extend(
            [
                D1InsertPlan(
                    table="use_case_evidence_links",
                    values={
                        "id": _new_id("link"),
                        "use_case_id": use_case_id,
                        "evidence_package_id": package_id,
                        "relation_type": "primary",
                        "linked_at": now,
                    },
                ),
                D1InsertPlan(
                    table="audit_events",
                    values={
                        "id": _new_id("audit"),
                        "aggregate_type": "use_case",
                        "aggregate_id": use_case_id,
                        "event_type": "evidence_ingested",
                        "actor_type": "service",
                        "related_package_id": package_id,
                        "event_payload_json": {
                            "version": version,
                            "producer": producer,
                            "artifact_type": artifact_type,
                            "package_hash": package_hash,
                        },
                        "created_at": now,
                    },
                ),
            ]
        )
        plan.d1_updates.append(
            D1UpdatePlan(
                table="use_cases",
                key={"id": use_case_id},
                values={"evidence_count": {"op": "increment", "value": 1}, "updated_at": now},
            )
        )
        return plan

    def plan_assess_use_case(
        self,
        *,
        use_case_id: str,
        current_cycle_id: Optional[str],
        prior_assessment_id: Optional[str],
        prior_risk_tier: Optional[str],
        risk_tier: str,
        dimension_scores: Dict[str, Any],
        dimension_rationale: Dict[str, Any],
        uncertainty_fields: List[str],
        required_controls: List[Dict[str, Any]],
        required_deliverables: List[str],
        evidence_count: int,
        trigger_type: str,
    ) -> MigrationWritePlan:
        """Stub for `POST /api/v1/use-cases/{usecase_id}/assess`."""
        now = iso_now()
        cycle_id = current_cycle_id or _new_id("cycle")
        assessment_id = _new_id("assessment")
        needs_new_cycle = bool(prior_assessment_id or not current_cycle_id)

        plan = MigrationWritePlan(endpoint="POST /api/v1/use-cases/{usecase_id}/assess")
        plan.d1_reads.extend(
            [
                D1ReadPlan(table="use_cases", filters={"id": use_case_id}, purpose="load use case state"),
                D1ReadPlan(table="use_case_evidence_links", filters={"use_case_id": use_case_id}, purpose="load linked evidence metadata"),
            ]
        )

        if needs_new_cycle:
            next_cycle_id = _new_id("cycle")
            plan.d1_inserts.append(
                D1InsertPlan(
                    table="governance_cycles",
                    values={
                        "id": next_cycle_id,
                        "use_case_id": use_case_id,
                        "parent_cycle_id": current_cycle_id,
                        "cycle_index": 2 if current_cycle_id else 1,
                        "open_reason": "reassessment_after_new_evidence" if prior_assessment_id else "initial_assessment",
                        "status": "open",
                        "opened_at": now,
                        "closed_at": None,
                    },
                )
            )
            cycle_id = next_cycle_id

        gate_status = {
            "risk_assessed": "complete",
            "controls_satisfied": "pending" if evidence_count else "blocked",
            "approved_for_deploy": "blocked",
        }
        plan.d1_inserts.append(
            D1InsertPlan(
                table="assessments",
                values={
                    "id": assessment_id,
                    "use_case_id": use_case_id,
                    "cycle_id": cycle_id,
                    "parent_assessment_id": prior_assessment_id,
                    "trigger_type": trigger_type,
                    "risk_tier": risk_tier,
                    "dimension_scores_json": dimension_scores,
                    "dimension_rationale_json": dimension_rationale,
                    "uncertainty_fields_json": uncertainty_fields,
                    "required_controls_json": required_controls,
                    "required_deliverables_json": required_deliverables,
                    "evidence_count": evidence_count,
                    "gate_status_json": gate_status,
                    "created_at": now,
                },
            )
        )
        for control in required_controls:
            plan.d1_inserts.append(
                D1InsertPlan(
                    table="assessment_controls",
                    values={
                        "id": _new_id("assessment_control"),
                        "assessment_id": assessment_id,
                        "control_id": control["control_id"],
                        "control_name": control["control_name"],
                        "category": control["category"],
                        "doc_status": control.get("doc_status", "pending"),
                        "impl_status": control.get("impl_status", "pending"),
                        "maturity": control.get("maturity", 0),
                        "finding": control.get("finding"),
                        "evidence_refs_json": control.get("evidence_refs_json", []),
                        "evidence_status": control.get("evidence_status"),
                        "control_library_ref": control.get("control_library_ref"),
                    },
                )
            )
        plan.d1_updates.append(
            D1UpdatePlan(
                table="use_cases",
                key={"id": use_case_id},
                values={
                    "latest_risk_tier": risk_tier,
                    "latest_assessment_id": assessment_id,
                    "current_gate": "risk_assessed",
                    "status": "risk_assessed",
                    "updated_at": now,
                },
            )
        )
        plan.d1_inserts.append(
            D1InsertPlan(
                table="audit_events",
                values={
                    "id": _new_id("audit"),
                    "aggregate_type": "use_case",
                    "aggregate_id": use_case_id,
                    "event_type": "risk_reassessed" if prior_risk_tier and prior_risk_tier != risk_tier else "risk_assessed",
                    "actor_type": "system",
                    "cycle_id": cycle_id,
                    "related_assessment_id": assessment_id,
                    "event_payload_json": {
                        "prior_tier": prior_risk_tier,
                        "new_tier": risk_tier,
                        "uncertainty_fields": uncertainty_fields,
                    },
                    "created_at": now,
                },
            )
        )
        plan.notes.append("Assessment output remains traceable to a cycle, an evidence set, and explicit uncertainty fields.")
        return plan

    def plan_audit_trail_query(self, *, use_case_id: str) -> MigrationWritePlan:
        """Stub for `GET /api/v1/use-cases/{usecase_id}/audit-trail`."""
        plan = MigrationWritePlan(endpoint="GET /api/v1/use-cases/{usecase_id}/audit-trail")
        plan.d1_reads.append(
            D1ReadPlan(
                table="audit_events",
                filters={"aggregate_type": "use_case", "aggregate_id": use_case_id},
                purpose="return append-only governance trail ordered by created_at",
            )
        )
        plan.notes.append("Audit trail reads append-only events rather than reconstructed summary state.")
        return plan
