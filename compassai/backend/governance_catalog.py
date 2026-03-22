"""
Governance deliverables catalog helpers for CompassAI.

These helpers let CompassAI treat the markdown deliverables package as first-class
governance artifacts that can be loaded, attached, and recommended inside the
assessment workflow.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional
import hashlib
import re


DEFAULT_GOVERNANCE_ARTIFACTS: List[Dict[str, Any]] = [
    {
        "slug": "ai-governance-framework",
        "filename": "ai_governance_framework.md",
        "title": "AI Governance Framework",
        "artifact_type": "framework",
        "summary": "Overview of the governance framework, operating principles, and control surfaces.",
        "tags": ["framework", "governance-foundation", "controls"],
        "policy_domain": "governance-foundation",
        "competencies": [],
        "linked_control_ids": ["GOV-01", "GOV-02", "RISK-01"],
        "taxonomy": {
            "domain": "Governance",
            "control_function": "Policy setting",
            "artifact_class": "control framework",
            "subject_object": "enterprise AI governance program",
            "lifecycle_stage": "strategy",
            "evidence_status": "final",
            "formality": "binding",
            "file_format": ".md",
        },
    },
    {
        "slug": "executive-sponsor-briefing",
        "filename": "executive_sponsor_briefing.md",
        "title": "Executive Sponsor Briefing",
        "artifact_type": "briefing",
        "summary": "High-level executive framing for governance objectives, sponsorship, and program expectations.",
        "tags": ["executive", "briefing", "sponsorship"],
        "policy_domain": "executive-oversight",
        "competencies": [],
        "linked_control_ids": ["GOV-03", "MON-01"],
        "taxonomy": {
            "domain": "Governance",
            "control_function": "Reporting",
            "artifact_class": "governance memo",
            "subject_object": "executive sponsorship for AI governance",
            "lifecycle_stage": "strategy",
            "evidence_status": "final",
            "formality": "advisory",
            "file_format": ".md",
        },
    },
    {
        "slug": "governance-committee-charter",
        "filename": "governance_committee_charter.md",
        "title": "Governance Committee Charter",
        "artifact_type": "committee-charter",
        "summary": "Defines governance committee purpose, membership, cadence, and decision rules.",
        "tags": ["committee", "charter", "decision-rights"],
        "policy_domain": "committee-operations",
        "competencies": [],
        "linked_control_ids": ["GOV-04", "GOV-05"],
        "taxonomy": {
            "domain": "Audit",
            "control_function": "Approval / exception handling",
            "artifact_class": "charter",
            "subject_object": "central AI governance committee",
            "lifecycle_stage": "strategy",
            "evidence_status": "final",
            "formality": "binding",
            "file_format": ".md",
        },
    },
    {
        "slug": "ai-system-inventory",
        "filename": "ai_system_inventory.md",
        "title": "AI System Inventory",
        "artifact_type": "inventory-template",
        "summary": "Template for cataloging AI systems, deployment contexts, and key risk attributes.",
        "tags": ["inventory", "system-profile", "onboarding"],
        "policy_domain": "inventory-management",
        "competencies": [],
        "linked_control_ids": ["INV-01", "RISK-02"],
        "taxonomy": {
            "domain": "Operations / Runtime",
            "control_function": "Risk identification",
            "artifact_class": "inventory",
            "subject_object": "AI systems across the enterprise",
            "lifecycle_stage": "intake",
            "evidence_status": "working paper",
            "formality": "operational",
            "file_format": ".md",
        },
    },
    {
        "slug": "policy-library",
        "filename": "policy_library.md",
        "title": "Policy Library",
        "artifact_type": "policy-library",
        "summary": "Collection of AI governance policies, standards, and control guidance.",
        "tags": ["policies", "standards", "controls"],
        "policy_domain": "policy-library",
        "competencies": [],
        "linked_control_ids": ["POL-01", "POL-02", "POL-03"],
        "taxonomy": {
            "domain": "Compliance",
            "control_function": "Standard setting",
            "artifact_class": "policy",
            "subject_object": "enterprise AI controls and obligations",
            "lifecycle_stage": "design",
            "evidence_status": "approved",
            "formality": "binding",
            "file_format": ".md",
        },
    },
    {
        "slug": "incident-response-plan",
        "filename": "incident_response_plan.md",
        "title": "Incident Response Plan",
        "artifact_type": "incident-plan",
        "summary": "Procedures, escalation steps, and governance expectations for AI incidents.",
        "tags": ["incident-response", "escalation", "monitoring"],
        "policy_domain": "incident-management",
        "competencies": ["incident-response", "evidence-capture", "escalation"],
        "linked_control_ids": ["MON-03", "MON-04"],
        "taxonomy": {
            "domain": "Operations / Runtime",
            "control_function": "Incident response",
            "artifact_class": "procedure",
            "subject_object": "AI incidents and failures",
            "lifecycle_stage": "incident handling",
            "evidence_status": "approved",
            "formality": "operational",
            "file_format": ".md",
        },
    },
    {
        "slug": "third-party-ai-contract-template",
        "filename": "third_party_ai_contract_template.md",
        "title": "Third-Party AI Contract Template",
        "artifact_type": "contract-template",
        "summary": "Template clauses for third-party AI procurement, obligations, and governance safeguards.",
        "tags": ["third-party", "contracts", "procurement"],
        "policy_domain": "third-party-governance",
        "competencies": ["vendor-review", "contract-governance"],
        "linked_control_ids": ["TPRM-01", "TPRM-02"],
        "taxonomy": {
            "domain": "Procurement / Vendor",
            "control_function": "Vendor review",
            "artifact_class": "contract",
            "subject_object": "third-party AI providers",
            "lifecycle_stage": "procurement",
            "evidence_status": "final",
            "formality": "binding",
            "file_format": ".md",
        },
    },
    {
        "slug": "training-and-awareness-plan",
        "filename": "training_and_awareness_plan.md",
        "title": "Training and Awareness Plan",
        "artifact_type": "training-plan",
        "summary": "Role-based training and competency development plan for AI governance maturity.",
        "tags": ["training", "awareness", "skills"],
        "policy_domain": "training-and-awareness",
        "competencies": ["governance-basics", "policy-literacy", "incident-escalation"],
        "linked_control_ids": ["TRN-01", "TRN-02"],
        "taxonomy": {
            "domain": "Governance",
            "control_function": "Training / awareness",
            "artifact_class": "playbook",
            "subject_object": "AI governance competencies",
            "lifecycle_stage": "development",
            "evidence_status": "approved",
            "formality": "operational",
            "file_format": ".md",
        },
    },
]


def extract_title(markdown: str, fallback: str) -> str:
    for line in markdown.splitlines():
        if line.strip().startswith("#"):
            return line.lstrip("#").strip() or fallback
    return fallback


def build_artifact_record(entry: Dict[str, Any], content: str = "") -> Dict[str, Any]:
    body = content.strip()
    return {
        "slug": entry["slug"],
        "filename": entry["filename"],
        "title": extract_title(body, entry["title"]),
        "artifact_type": entry["artifact_type"],
        "summary": entry["summary"],
        "tags": entry.get("tags", []),
        "policy_domain": entry.get("policy_domain"),
        "competencies": entry.get("competencies", []),
        "linked_control_ids": entry.get("linked_control_ids", []),
        "taxonomy": entry.get("taxonomy"),
        "content_markdown": body,
        "content_hash": f"sha256:{hashlib.sha256(body.encode('utf-8')).hexdigest()}" if body else None,
    }


def load_governance_artifact_bundle(bundle_dir: Optional[Path]) -> List[Dict[str, Any]]:
    records: List[Dict[str, Any]] = []

    for entry in DEFAULT_GOVERNANCE_ARTIFACTS:
        content = ""
        if bundle_dir:
            path = bundle_dir / entry["filename"]
            if path.exists():
                content = path.read_text(encoding="utf-8")
        records.append(build_artifact_record(entry, content=content))

    return records


def build_training_recommendations(
    assessment_result: Dict[str, Any],
    training_modules: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    risk_tier = str(assessment_result.get("risk_tier", "")).upper()
    missing_elements = [str(item).lower() for item in assessment_result.get("missing_elements", [])]
    critical_flags = [str(item).lower() for item in assessment_result.get("critical_flags", [])]
    joined_findings = " ".join(missing_elements + critical_flags)

    recommendations: List[Dict[str, Any]] = []

    for module in training_modules:
        score = 0
        reasons: List[str] = []

        linked_risk_tiers = [str(item).upper() for item in module.get("linked_risk_tiers", [])]
        if linked_risk_tiers and risk_tier in linked_risk_tiers:
            score += 3
            reasons.append(f"Relevant to {risk_tier} risk tier handling")

        for competency in module.get("competencies", []):
          normalized = competency.replace("-", " ").lower()
          if normalized in joined_findings:
              score += 2
              reasons.append(f"Addresses {competency}")

        for control_id in module.get("linked_control_ids", []):
            if control_id.lower() in joined_findings:
                score += 2
                reasons.append(f"Supports control gap {control_id}")

        if score <= 0:
            continue

        recommendations.append(
            {
                "training_module_id": module["id"],
                "title": module["title"],
                "score": score,
                "reasons": reasons or ["Matches current assessment gaps"],
            }
        )

    return sorted(recommendations, key=lambda item: (-item["score"], item["title"]))


def infer_policy_links(markdown: str) -> List[str]:
    if not markdown:
        return []

    policies = []
    matches = re.findall(r"\b(policy|standard|control|committee|incident)\b", markdown, flags=re.IGNORECASE)
    for match in matches:
        normalized = match.lower()
        if normalized not in policies:
            policies.append(normalized)
    return policies
