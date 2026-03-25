"""
PHAROS Method integration routes for CompassAI.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from config import db
from models import AuditAction
from pharos_method_catalog import build_compassai_control_register, build_method_pack
from utils import log_audit, require_assessor_or_admin, require_auth

router = APIRouter(tags=["PHAROS Method"])


class MethodApplyRequest(BaseModel):
    note: Optional[str] = None
    enforce_controls: bool = True
    applied_by_role: Optional[str] = None
    scope: str = Field(default="assessment", pattern="^(assessment|system|engagement)$")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("/governance/method/pack")
async def get_pharos_method_pack(user: Dict = Depends(require_auth)):
    _ = user
    return build_method_pack()


@router.get("/governance/method/control-register")
async def get_pharos_control_register(user: Dict = Depends(require_auth)):
    _ = user
    return {
        "method": "PHAROS Consolidated Definitive Method",
        "generated_at": _now_iso(),
        "controls": build_compassai_control_register(),
    }


@router.post("/governance/method/bootstrap")
async def bootstrap_pharos_method(user: Dict = Depends(require_assessor_or_admin())):
    method_pack = build_method_pack()
    method_record = {
        "id": "pharos_method_compassai_v1",
        "name": method_pack["method_name"],
        "applied_surface": method_pack["applied_surface"],
        "method_pack": method_pack,
        "control_register": build_compassai_control_register(),
        "updated_at": _now_iso(),
        "created_by": user.get("email"),
    }

    await db.governance_method_profiles.update_one(
        {"id": method_record["id"]},
        {"$set": method_record},
        upsert=True,
    )

    await log_audit(
        AuditAction.UPDATE,
        "governance_method_profile",
        resource_id=method_record["id"],
        resource_name=method_record["name"],
        user=user,
    )

    return {
        "status": "ok",
        "profile_id": method_record["id"],
        "updated_at": method_record["updated_at"],
    }


@router.get("/assessments/{assessment_id}/method-context")
async def get_assessment_method_context(
    assessment_id: str,
    user: Dict = Depends(require_auth),
):
    _ = user
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0, "id": 1, "method_context": 1})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    return {
        "assessment_id": assessment_id,
        "method_context": assessment.get("method_context"),
    }


@router.post("/assessments/{assessment_id}/method/apply")
async def apply_method_to_assessment(
    assessment_id: str,
    payload: MethodApplyRequest,
    user: Dict = Depends(require_assessor_or_admin()),
):
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    method_pack = build_method_pack()
    method_context = {
        "method_profile_id": "pharos_method_compassai_v1",
        "method_name": method_pack["method_name"],
        "applied_surface": method_pack["applied_surface"],
        "applied_at": _now_iso(),
        "applied_by": user.get("email"),
        "scope": payload.scope,
        "enforce_controls": payload.enforce_controls,
        "note": payload.note,
        "controls": build_compassai_control_register(),
        "quality_summary": method_pack.get("quality_summary", {}),
        "source_provenance": method_pack.get("source_provenance", {}),
    }

    await db.assessments.update_one(
        {"id": assessment_id},
        {
            "$set": {
                "method_context": method_context,
                "workflow.latest_decision_summary": (
                    "PHAROS Method context applied to assessment for bounded governance execution."
                ),
            }
        },
    )

    await log_audit(
        AuditAction.UPDATE,
        "assessment_method_context",
        resource_id=assessment_id,
        details={
            "method_profile_id": method_context["method_profile_id"],
            "scope": payload.scope,
            "enforce_controls": payload.enforce_controls,
        },
        user=user,
    )

    return {
        "assessment_id": assessment_id,
        "method_context": method_context,
        "status": "applied",
    }
