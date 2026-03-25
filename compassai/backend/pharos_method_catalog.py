"""
PHAROS Method catalog for CompassAI.

This module embeds a bounded operational representation of the PHAROS Method
Repository so CompassAI can expose and apply the method through API workflows.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List


PHAROS_METHOD_SOURCE_FILES = {
    "definitive_method": "/mnt/c/Users/softinfo/Documents/PHAROS METHOD REPOSITORY/90_CONSOLIDATED_FINAL_SYNTHESIS/90_CONSOLIDATED_DEFINITIVE_METHOD.md",
    "one_page_schema": "/mnt/c/Users/softinfo/Documents/PHAROS METHOD REPOSITORY/90_CONSOLIDATED_FINAL_SYNTHESIS/90_CONSOLIDATED_ONE_PAGE_SCHEMA.md",
    "compassai_surface_profile": "/mnt/c/Users/softinfo/Documents/PHAROS METHOD REPOSITORY/04_IMPLEMENTATION_SURFACES_AND_APP_METHOD_TESTS/04_IMPLEMENTATION_SURFACE_compassai_PROFILE.md",
    "quality_check": "/mnt/c/Users/softinfo/Documents/PHAROS METHOD REPOSITORY/DATA/CONTROLS/00_FINAL_QUALITY_CHECK.md",
    "phase_test_results": "/mnt/c/Users/softinfo/Documents/PHAROS METHOD REPOSITORY/DATA/CONTROLS/00_CONTROL_PHASE_TEST_RESULTS.md",
    "turing_ai_ethics_workbook": "/mnt/c/Users/softinfo/Documents/Turing AI Ethics and Governance.pdf",
}


DEFINITIVE_METHOD_STEPS = [
    "ingest full archive",
    "classify each file across chronology/function/method/revision/recursive role",
    "rank authority and resolve overlap clusters",
    "preserve strong prose and lineage",
    "improve weak artifacts without flattening stronger texts",
    "generate missing phase structure and controls",
    "produce bounded synthesis with explicit claim limits",
]


ONE_PAGE_SCHEMA_FLOW = [
    "Source Archive",
    "Classification Manifests",
    "Authority Ranking",
    "Phase Packets (01/02/03/04)",
    "Consolidated Synthesis (90)",
    "Submission Package (99)",
]


CONTROL_RAILS = [
    "evidence hierarchy",
    "overlap de-dup authority",
    "bounded claim boundary",
    "protocol closure before promotion",
    "governance-over-fabrication precedence",
]


COMPASSAI_SURFACE_PROFILE = {
    "surface": "CompassAI",
    "evidence_basis": [
        "After reboot checklist.txt",
        "Here’s a one-page markdown version.txt",
        "moving parts.txt",
    ],
    "confidence_level": "high",
    "relation_to_previous_phases": "downstream implementation/testing layer unless archive proves otherwise",
    "governance_risks": [
        "role drift",
        "promotion without closure",
        "evidence hierarchy collapse",
    ],
    "governance_controls": [
        "protocol gate",
        "authority ranking",
        "bounded claim boundary",
        "operator accountability",
    ],
    "output_types_supported": "Portal routing and preview operations support.",
    "lifecycle_status": "active_preview_linkage",
}


QUALITY_SUMMARY = {
    "inventory_count": 116,
    "classified_count": 116,
    "expected_source_file_count": 116,
    "overall_status": "ready_full",
    "critical_failures": 0,
    "major_failures": 0,
    "bounded_items": 0,
}


PHASE_TEST_SIGNALS = {
    "13_IMPLEMENTATION_SURFACE_TEST": {
        "status": "partially_supported_bounded",
        "terms_with_hits": "5/7",
        "compassai_signal": "impl_compassai present in evidence basis",
    },
    "11_HEPHAISTOS_TEST": {
        "status": "supported",
        "terms_with_hits": "2/2",
        "compassai_signal": "forge_wsl downstream coupling present",
    },
    "14_ARCHIVE_PHASE_DISTINCTION_TEST": {
        "status": "supported",
        "terms_with_hits": "3/3",
        "compassai_signal": "phase-distinction control retained across archive/method layers",
    },
}


TURING_WORKBOOK_OVERLAY = {
    "title": "AI Ethics and Governance in Practice: An Introduction",
    "publisher": "The Alan Turing Institute",
    "year": 2023,
    "frameworks": {
        "care_and_act": {
            "purpose": "Responsible Research and Innovation orientation across the AI lifecycle."
        },
        "sum_values": [
            {
                "value": "Respect",
                "focus": "Human agency, dignity, and individual flourishing.",
            },
            {
                "value": "Connect",
                "focus": "Solidarity, communication, and integrity of social interaction.",
            },
            {
                "value": "Care",
                "focus": "Individual, communal, and biospheric wellbeing.",
            },
            {
                "value": "Protect",
                "focus": "Social values, justice, and the public interest.",
            },
        ],
        "ssafe_d_principles": [
            {
                "principle": "Safety",
                "assurance_goal": "Technical accuracy, reliability, security, and robustness.",
            },
            {
                "principle": "Sustainability",
                "assurance_goal": "Continuous sensitivity to real-world impacts.",
            },
            {
                "principle": "Accountability",
                "assurance_goal": "End-to-end answerability and auditability.",
            },
            {
                "principle": "Fairness",
                "assurance_goal": "Bias mitigation and discriminatory non-harm threshold.",
            },
            {
                "principle": "Explainability",
                "assurance_goal": "Ability to explain and justify process and outcomes.",
            },
            {
                "principle": "Data Stewardship",
                "assurance_goal": "Data quality, integrity, protection, and privacy.",
            },
        ],
        "pbg_log_minimum_fields": [
            "established governance actions across lifecycle",
            "roles and accountable team members per action",
            "timeframes for follow-up and reassessment",
            "clear logging protocol for end-to-end audibility",
        ],
    },
}


TURING_TO_COMPASSAI_CONTROL_CROSSWALK = [
    {
        "turing_construct": "PBG Log",
        "compassai_surfaces": [
            "assessment.method_context",
            "assessment.workflow",
            "audit log events",
        ],
        "intended_effect": "Maintains lifecycle-level governance traceability and accountability.",
    },
    {
        "turing_construct": "BSA, BRM, FPS",
        "compassai_surfaces": [
            "governance artifacts",
            "assessment criteria metadata",
            "evidence references linked to controls",
        ],
        "intended_effect": "Improves fairness positioning and bias-risk documentation fidelity.",
    },
    {
        "turing_construct": "SSA & RM",
        "compassai_surfaces": [
            "risk tier fields in assessment outputs",
            "scheduled reassessment workflows",
            "method context enforcement flag",
        ],
        "intended_effect": "Prevents promotion claims before safety risks are bounded.",
    },
    {
        "turing_construct": "Data Factsheet",
        "compassai_surfaces": [
            "evidence artifact storage",
            "governance context attachments",
            "ledger deliverables and provenance paths",
        ],
        "intended_effect": "Preserves data lineage and stewardship auditability.",
    },
]


def build_method_pack() -> Dict[str, Any]:
    return {
        "method_name": "PHAROS Consolidated Definitive Method",
        "applied_surface": "CompassAI",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_provenance": PHAROS_METHOD_SOURCE_FILES,
        "definitive_method_steps": DEFINITIVE_METHOD_STEPS,
        "schema_flow": ONE_PAGE_SCHEMA_FLOW,
        "control_rails": CONTROL_RAILS,
        "surface_profile": COMPASSAI_SURFACE_PROFILE,
        "quality_summary": QUALITY_SUMMARY,
        "phase_test_signals": PHASE_TEST_SIGNALS,
        "external_framework_overlay": TURING_WORKBOOK_OVERLAY,
        "framework_control_crosswalk": TURING_TO_COMPASSAI_CONTROL_CROSSWALK,
    }


def build_compassai_control_register() -> List[Dict[str, Any]]:
    """
    Maps PHAROS control rails to practical CompassAI enforcement surfaces.
    """
    return [
        {
            "control": "evidence hierarchy",
            "description": "Prefer source-bearing evidence and keep governance context attached to assessments.",
            "aligned_turing_frameworks": ["Data Stewardship", "Accountability", "PBG Log"],
            "compassai_enforcement_surfaces": [
                "GET/PUT /api/assessments/{assessment_id}/governance-context",
                "GET /api/governance/artifacts",
                "POST /api/evidence/upload",
                "POST /api/ledger/assessments/run",
            ],
            "failure_mode": "assessment conclusions outrun evidence references",
        },
        {
            "control": "overlap de-dup authority",
            "description": "Resolve competing descriptions by explicit precedence and upsert governance artifacts intentionally.",
            "aligned_turing_frameworks": ["Explainability", "Accountability"],
            "compassai_enforcement_surfaces": [
                "POST /api/governance/artifacts/import (upsert)",
                "governance artifact slug uniqueness and update flow",
            ],
            "failure_mode": "parallel labels produce conflicting governance interpretation",
        },
        {
            "control": "bounded claim boundary",
            "description": "Expose uncertainty, risk tier, and workflow stage boundaries instead of over-claiming readiness.",
            "aligned_turing_frameworks": ["Safety", "Sustainability", "Fairness"],
            "compassai_enforcement_surfaces": [
                "assessment result risk_tier",
                "criteria/workflow fields in assessment governance context",
                "/api/ledger/reports/tax bounded period parameters",
            ],
            "failure_mode": "promissory output presented as completed governance",
        },
        {
            "control": "protocol closure before promotion",
            "description": "Prevent promotion claims before critical checks and closure artifacts are recorded.",
            "aligned_turing_frameworks": ["Accountability", "PBG Log", "SSA & RM"],
            "compassai_enforcement_surfaces": [
                "scheduled assessments + audit log",
                "governance committee decisions",
                "assessment method_context application record",
            ],
            "failure_mode": "production promotion with unresolved blocking controls",
        },
        {
            "control": "governance-over-fabrication precedence",
            "description": "Administrative and evidence controls outrank speculative or convenience narratives.",
            "aligned_turing_frameworks": ["CARE and Act", "SUM Values", "Explainability"],
            "compassai_enforcement_surfaces": [
                "audit logs",
                "governance context artifacts",
                "method pack and control register endpoints",
            ],
            "failure_mode": "fabricated confidence bypasses governance gates",
        },
    ]
