"""
Governance program routes for integrating the AI governance deliverables package.
"""
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, Field

from config import db
from governance_catalog import build_training_recommendations, infer_policy_links, load_governance_artifact_bundle
from models import (
    AssessmentCriteria,
    AssessmentWorkflow,
    Contact,
    GovernanceArtifactReference,
    GovernanceCommittee,
    GovernanceCommitteeDecision,
    GovernanceCommitteeMeeting,
    GovernancePolicy,
    TrainingModule,
    AuditAction,
)
from utils import log_audit, require_assessor_or_admin, require_auth

router = APIRouter(tags=["Governance Program"])


class GovernanceArtifactImportRequest(BaseModel):
    bundle_dir: Optional[str] = None
    upsert: bool = True


class GovernancePolicyCreate(BaseModel):
    slug: str
    title: str
    artifact_id: Optional[str] = None
    policy_domain: str
    summary: str = ""
    tags: List[str] = []
    linked_control_ids: List[str] = []
    linked_system_ids: List[str] = []


class TrainingModuleCreate(BaseModel):
    slug: str
    title: str
    artifact_id: Optional[str] = None
    summary: str = ""
    competencies: List[str] = []
    linked_control_ids: List[str] = []
    linked_risk_tiers: List[str] = []
    recommended_for_roles: List[str] = []
    duration_minutes: Optional[int] = None


class GovernanceCommitteeCreate(BaseModel):
    name: str
    charter_artifact_id: Optional[str] = None
    purpose: str = ""
    responsibilities: List[str] = []
    meeting_cadence: Optional[str] = None
    chair_name: Optional[str] = None
    members: List[Contact] = []
    decision_rules: List[str] = []


class GovernanceCommitteeMeetingCreate(BaseModel):
    title: str
    scheduled_for: datetime
    agenda_items: List[str] = []
    related_assessment_ids: List[str] = []


class GovernanceCommitteeDecisionCreate(BaseModel):
    meeting_id: str
    title: str
    decision: str
    rationale: str = ""
    owner: Optional[str] = None
    due_date: Optional[datetime] = None
    votes_for: int = 0
    votes_against: int = 0
    abstentions: int = 0


class GovernanceContextUpdate(BaseModel):
    criteria: Optional[AssessmentCriteria] = None
    workflow: Optional[AssessmentWorkflow] = None
    governance_artifacts: Optional[List[GovernanceArtifactReference]] = None
    training_recommendation_ids: Optional[List[str]] = None


def _iso(value: Optional[datetime]) -> Optional[str]:
    return value.isoformat() if value else None


def _deserialize_datetimes(items: List[Dict[str, Any]], fields: List[str]) -> List[Dict[str, Any]]:
    for item in items:
      for field in fields:
        if isinstance(item.get(field), str):
          try:
            item[field] = datetime.fromisoformat(item[field])
          except ValueError:
            pass
    return items


async def _artifact_lookup_by_ids(artifact_ids: List[str]) -> List[Dict[str, Any]]:
    if not artifact_ids:
        return []
    return await db.governance_artifacts.find({"id": {"$in": artifact_ids}}, {"_id": 0}).to_list(len(artifact_ids))


@router.post("/governance/artifacts/import")
async def import_governance_artifacts(
    request: GovernanceArtifactImportRequest,
    user: Dict = Depends(require_assessor_or_admin()),
):
    bundle_dir = Path(request.bundle_dir).expanduser() if request.bundle_dir else None
    if bundle_dir and not bundle_dir.exists():
        raise HTTPException(status_code=404, detail="Bundle directory not found")

    records = load_governance_artifact_bundle(bundle_dir)
    imported = []

    for record in records:
        artifact_id = str(uuid.uuid4())
        document = {
            "id": artifact_id,
            **record,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        if request.upsert:
            await db.governance_artifacts.update_one(
                {"slug": record["slug"]},
                {"$set": document},
                upsert=True,
            )
        else:
            await db.governance_artifacts.insert_one(document)

        imported.append({"id": artifact_id, "slug": record["slug"], "title": record["title"]})

    await log_audit(
        AuditAction.CREATE,
        "governance_artifact_import",
        details={"count": len(imported), "bundle_dir": str(bundle_dir) if bundle_dir else None},
        user=user,
    )

    return {"imported": imported, "count": len(imported)}


@router.get("/governance/artifacts")
async def list_governance_artifacts(user: Dict = Depends(require_auth)):
    _ = user
    artifacts = await db.governance_artifacts.find({}, {"_id": 0}).sort("title", 1).to_list(100)
    return _deserialize_datetimes(artifacts, ["created_at", "updated_at"])


@router.get("/governance/artifacts/{artifact_id}/download")
async def download_governance_artifact(
    artifact_id: str,
    user: Dict = Depends(require_auth),
):
    _ = user
    artifact = await db.governance_artifacts.find_one({"id": artifact_id}, {"_id": 0})
    if not artifact:
        raise HTTPException(status_code=404, detail="Governance artifact not found")

    filename = artifact.get("filename") or f"{artifact.get('slug', artifact_id)}.md"
    return Response(
        content=artifact.get("content_markdown", ""),
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/governance/policies")
async def list_governance_policies(user: Dict = Depends(require_auth)):
    _ = user
    policies = await db.governance_policies.find({}, {"_id": 0}).sort("title", 1).to_list(100)
    return _deserialize_datetimes(policies, ["created_at"])


@router.post("/governance/policies", response_model=GovernancePolicy)
async def create_governance_policy(
    payload: GovernancePolicyCreate,
    user: Dict = Depends(require_assessor_or_admin()),
):
    policy = GovernancePolicy(**payload.model_dump())
    doc = policy.model_dump()
    doc["created_at"] = policy.created_at.isoformat()
    await db.governance_policies.insert_one(doc)
    await log_audit(AuditAction.CREATE, "governance_policy", policy.id, policy.title, user=user)
    return policy


@router.get("/governance/training")
async def list_training_modules(user: Dict = Depends(require_auth)):
    _ = user
    modules = await db.training_modules.find({}, {"_id": 0}).sort("title", 1).to_list(100)
    return _deserialize_datetimes(modules, ["created_at"])


@router.post("/governance/training", response_model=TrainingModule)
async def create_training_module(
    payload: TrainingModuleCreate,
    user: Dict = Depends(require_assessor_or_admin()),
):
    module = TrainingModule(**payload.model_dump())
    doc = module.model_dump()
    doc["created_at"] = module.created_at.isoformat()
    await db.training_modules.insert_one(doc)
    await log_audit(AuditAction.CREATE, "training_module", module.id, module.title, user=user)
    return module


@router.post("/governance/training/recommendations/{assessment_id}")
async def generate_training_recommendations(
    assessment_id: str,
    user: Dict = Depends(require_auth),
):
    _ = user
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    modules = await db.training_modules.find({}, {"_id": 0}).to_list(200)
    recommendations = build_training_recommendations(assessment.get("result", {}), modules)
    recommendation_ids = [item["training_module_id"] for item in recommendations]

    await db.assessments.update_one(
        {"id": assessment_id},
        {"$set": {"training_recommendation_ids": recommendation_ids}},
    )

    return {"assessment_id": assessment_id, "recommendations": recommendations}


@router.get("/assessments/{assessment_id}/governance-context")
async def get_assessment_governance_context(
    assessment_id: str,
    user: Dict = Depends(require_auth),
):
    _ = user
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    artifact_ids = [item.get("artifact_id") for item in assessment.get("governance_artifacts", []) if item.get("artifact_id")]
    attachments = await _artifact_lookup_by_ids(artifact_ids)

    return {
        "assessment_id": assessment_id,
        "criteria": assessment.get("criteria", {}),
        "workflow": assessment.get("workflow", {}),
        "governance_artifacts": assessment.get("governance_artifacts", []),
        "training_recommendation_ids": assessment.get("training_recommendation_ids", []),
        "artifact_attachments": attachments,
    }


@router.put("/assessments/{assessment_id}/governance-context")
async def update_assessment_governance_context(
    assessment_id: str,
    payload: GovernanceContextUpdate,
    user: Dict = Depends(require_assessor_or_admin()),
):
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    update_data = {}
    if payload.criteria is not None:
        update_data["criteria"] = payload.criteria.model_dump()
    if payload.workflow is not None:
        update_data["workflow"] = payload.workflow.model_dump()
    if payload.governance_artifacts is not None:
        update_data["governance_artifacts"] = [item.model_dump() for item in payload.governance_artifacts]
    if payload.training_recommendation_ids is not None:
        update_data["training_recommendation_ids"] = payload.training_recommendation_ids

    if not update_data:
        raise HTTPException(status_code=400, detail="No governance fields provided")

    await db.assessments.update_one({"id": assessment_id}, {"$set": update_data})
    await log_audit(AuditAction.UPDATE, "assessment_governance_context", assessment_id, user=user)

    updated = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    return {
        "assessment_id": assessment_id,
        "criteria": updated.get("criteria", {}),
        "workflow": updated.get("workflow", {}),
        "governance_artifacts": updated.get("governance_artifacts", []),
        "training_recommendation_ids": updated.get("training_recommendation_ids", []),
    }


@router.get("/assessments/{assessment_id}/artifact-attachments")
async def list_assessment_artifact_attachments(
    assessment_id: str,
    user: Dict = Depends(require_auth),
):
    _ = user
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    artifact_ids = [item.get("artifact_id") for item in assessment.get("governance_artifacts", []) if item.get("artifact_id")]
    attachments = await _artifact_lookup_by_ids(artifact_ids)
    return {"assessment_id": assessment_id, "artifacts": attachments}


@router.get("/governance/committees")
async def list_governance_committees(user: Dict = Depends(require_auth)):
    _ = user
    committees = await db.governance_committees.find({}, {"_id": 0}).sort("name", 1).to_list(100)
    return _deserialize_datetimes(committees, ["created_at"])


@router.post("/governance/committees", response_model=GovernanceCommittee)
async def create_governance_committee(
    payload: GovernanceCommitteeCreate,
    user: Dict = Depends(require_assessor_or_admin()),
):
    committee = GovernanceCommittee(**payload.model_dump())
    doc = committee.model_dump()
    doc["created_at"] = committee.created_at.isoformat()
    await db.governance_committees.insert_one(doc)
    await log_audit(AuditAction.CREATE, "governance_committee", committee.id, committee.name, user=user)
    return committee


@router.get("/governance/committees/{committee_id}/meetings")
async def list_governance_committee_meetings(
    committee_id: str,
    user: Dict = Depends(require_auth),
):
    _ = user
    meetings = await db.governance_committee_meetings.find({"committee_id": committee_id}, {"_id": 0}).sort("scheduled_for", -1).to_list(100)
    return _deserialize_datetimes(meetings, ["created_at", "scheduled_for"])


@router.post("/governance/committees/{committee_id}/meetings", response_model=GovernanceCommitteeMeeting)
async def create_governance_committee_meeting(
    committee_id: str,
    payload: GovernanceCommitteeMeetingCreate,
    user: Dict = Depends(require_assessor_or_admin()),
):
    committee = await db.governance_committees.find_one({"id": committee_id}, {"_id": 0})
    if not committee:
        raise HTTPException(status_code=404, detail="Committee not found")

    meeting = GovernanceCommitteeMeeting(committee_id=committee_id, **payload.model_dump())
    doc = meeting.model_dump()
    doc["scheduled_for"] = _iso(meeting.scheduled_for)
    doc["created_at"] = _iso(meeting.created_at)
    await db.governance_committee_meetings.insert_one(doc)
    await log_audit(AuditAction.CREATE, "governance_committee_meeting", meeting.id, meeting.title, user=user)
    return meeting


@router.post("/governance/committees/{committee_id}/decisions", response_model=GovernanceCommitteeDecision)
async def create_governance_committee_decision(
    committee_id: str,
    payload: GovernanceCommitteeDecisionCreate,
    user: Dict = Depends(require_assessor_or_admin()),
):
    meeting = await db.governance_committee_meetings.find_one({"id": payload.meeting_id, "committee_id": committee_id}, {"_id": 0})
    if not meeting:
        raise HTTPException(status_code=404, detail="Committee meeting not found")

    decision = GovernanceCommitteeDecision(**payload.model_dump())
    doc = decision.model_dump()
    doc["created_at"] = _iso(decision.created_at)
    doc["due_date"] = _iso(decision.due_date)
    await db.governance_committee_decisions.insert_one(doc)
    await log_audit(AuditAction.CREATE, "governance_committee_decision", decision.id, decision.title, user=user)
    return decision


@router.get("/governance/committees/{committee_id}/report")
async def get_governance_committee_report(
    committee_id: str,
    user: Dict = Depends(require_auth),
):
    _ = user
    committee = await db.governance_committees.find_one({"id": committee_id}, {"_id": 0})
    if not committee:
        raise HTTPException(status_code=404, detail="Committee not found")

    meetings = await db.governance_committee_meetings.find({"committee_id": committee_id}, {"_id": 0}).to_list(200)
    meeting_ids = [meeting["id"] for meeting in meetings]
    decisions = await db.governance_committee_decisions.find({"meeting_id": {"$in": meeting_ids}}, {"_id": 0}).to_list(500) if meeting_ids else []

    related_assessment_ids = sorted(
        {
            assessment_id
            for meeting in meetings
            for assessment_id in meeting.get("related_assessment_ids", [])
            if assessment_id
        }
    )
    assessments = (
        await db.assessments.find({"id": {"$in": related_assessment_ids}}, {"_id": 0, "id": 1, "result": 1, "workflow": 1}).to_list(500)
        if related_assessment_ids
        else []
    )

    risk_distribution: Dict[str, int] = {}
    readiness_distribution: Dict[str, int] = {}
    for assessment in assessments:
        result = assessment.get("result", {}) or {}
        risk_tier = result.get("risk_tier", "UNKNOWN")
        readiness = result.get("readiness", "UNKNOWN")
        risk_distribution[risk_tier] = risk_distribution.get(risk_tier, 0) + 1
        readiness_distribution[readiness] = readiness_distribution.get(readiness, 0) + 1

    return {
        "committee": committee,
        "summary": {
            "meetings": len(meetings),
            "decisions": len(decisions),
            "related_assessments": len(assessments),
        },
        "risk_distribution": risk_distribution,
        "readiness_distribution": readiness_distribution,
        "decisions": _deserialize_datetimes(decisions, ["created_at", "due_date"]),
        "meetings": _deserialize_datetimes(meetings, ["created_at", "scheduled_for"]),
    }


@router.get("/governance/executive-dashboard")
async def get_governance_executive_dashboard(user: Dict = Depends(require_auth)):
    _ = user
    assessments = await db.assessments.find({}, {"_id": 0, "result": 1, "training_recommendation_ids": 1}).to_list(1000)
    committees = await db.governance_committees.count_documents({})
    policies = await db.governance_policies.count_documents({})
    training_modules = await db.training_modules.count_documents({})

    risk_distribution: Dict[str, int] = {}
    readiness_distribution: Dict[str, int] = {}
    evidence_confidence_values: List[int] = []
    total_training_links = 0

    for assessment in assessments:
        result = assessment.get("result", {}) or {}
        risk_tier = result.get("risk_tier", "UNKNOWN")
        readiness = result.get("readiness", "UNKNOWN")
        risk_distribution[risk_tier] = risk_distribution.get(risk_tier, 0) + 1
        readiness_distribution[readiness] = readiness_distribution.get(readiness, 0) + 1
        if isinstance(result.get("evidence_confidence"), int):
            evidence_confidence_values.append(result["evidence_confidence"])
        total_training_links += len(assessment.get("training_recommendation_ids", []))

    average_evidence_confidence = round(sum(evidence_confidence_values) / len(evidence_confidence_values), 1) if evidence_confidence_values else 0.0

    return {
        "summary": {
            "total_assessments": len(assessments),
            "governance_committees": committees,
            "policies": policies,
            "training_modules": training_modules,
            "average_evidence_confidence": average_evidence_confidence,
            "training_links_generated": total_training_links,
        },
        "risk_distribution": risk_distribution,
        "readiness_distribution": readiness_distribution,
    }


@router.post("/governance/policies/bootstrap")
async def bootstrap_policies_from_artifacts(user: Dict = Depends(require_assessor_or_admin())):
    artifacts = await db.governance_artifacts.find({}, {"_id": 0}).to_list(100)
    created = []

    for artifact in artifacts:
        if artifact.get("artifact_type") not in {"framework", "policy-library", "incident-plan", "contract-template", "committee-charter"}:
            continue

        slug = artifact["slug"]
        if await db.governance_policies.find_one({"slug": slug}, {"_id": 0, "id": 1}):
            continue

        policy = GovernancePolicy(
            slug=slug,
            title=artifact["title"],
            artifact_id=artifact["id"],
            policy_domain=artifact.get("policy_domain") or artifact.get("artifact_type"),
            summary=artifact.get("summary", ""),
            tags=artifact.get("tags", []),
            linked_control_ids=artifact.get("linked_control_ids", []),
            linked_system_ids=infer_policy_links(artifact.get("content_markdown", "")),
        )
        doc = policy.model_dump()
        doc["created_at"] = _iso(policy.created_at)
        await db.governance_policies.insert_one(doc)
        created.append({"id": policy.id, "title": policy.title})

    await log_audit(AuditAction.CREATE, "governance_policy_bootstrap", details={"count": len(created)}, user=user)
    return {"created": created, "count": len(created)}


@router.post("/governance/training/bootstrap")
async def bootstrap_training_from_artifacts(user: Dict = Depends(require_assessor_or_admin())):
    artifacts = await db.governance_artifacts.find({}, {"_id": 0}).to_list(100)
    created = []

    for artifact in artifacts:
        if artifact.get("artifact_type") != "training-plan":
            continue

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
        doc = module.model_dump()
        doc["created_at"] = _iso(module.created_at)
        await db.training_modules.insert_one(doc)
        created.append({"id": module.id, "title": module.title})

    await log_audit(AuditAction.CREATE, "training_bootstrap", details={"count": len(created)}, user=user)
    return {"created": created, "count": len(created)}
