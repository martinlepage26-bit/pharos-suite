from pathlib import Path

from governance_catalog import (
    DEFAULT_GOVERNANCE_ARTIFACTS,
    build_training_recommendations,
    infer_policy_links,
    load_governance_artifact_bundle,
)


def test_load_governance_artifact_bundle_defaults(tmp_path: Path):
    bundle_dir = tmp_path / "bundle"
    bundle_dir.mkdir()
    (bundle_dir / "ai_governance_framework.md").write_text("# Enterprise AI Governance\n\nFoundation content", encoding="utf-8")
    (bundle_dir / "training_and_awareness_plan.md").write_text("# Awareness Program\n\nTraining content", encoding="utf-8")

    records = load_governance_artifact_bundle(bundle_dir)

    assert len(records) == len(DEFAULT_GOVERNANCE_ARTIFACTS)
    framework = next(item for item in records if item["slug"] == "ai-governance-framework")
    training = next(item for item in records if item["slug"] == "training-and-awareness-plan")

    assert framework["title"] == "Enterprise AI Governance"
    assert framework["content_hash"].startswith("sha256:")
    assert framework["taxonomy"]["domain"] == "Governance"
    assert framework["taxonomy"]["artifact_class"] == "control framework"
    assert training["title"] == "Awareness Program"


def test_build_training_recommendations_scores_matches():
    assessment_result = {
        "risk_tier": "high",
        "missing_elements": ["incident response", "TPRM-01"],
        "critical_flags": ["policy literacy gap"],
    }
    modules = [
        {
            "id": "module-1",
            "title": "Incident Response Readiness",
            "competencies": ["incident-response"],
            "linked_control_ids": ["TPRM-01"],
            "linked_risk_tiers": ["HIGH"],
        },
        {
            "id": "module-2",
            "title": "General Awareness",
            "competencies": ["governance-basics"],
            "linked_control_ids": [],
            "linked_risk_tiers": [],
        },
    ]

    recommendations = build_training_recommendations(assessment_result, modules)

    assert len(recommendations) == 1
    assert recommendations[0]["training_module_id"] == "module-1"
    assert recommendations[0]["score"] >= 5


def test_infer_policy_links_deduplicates_keywords():
    markdown = """
    This policy standard explains control responsibilities, committee review,
    and incident escalation. The policy library cross-references the standard.
    """

    inferred = infer_policy_links(markdown)

    assert inferred == ["policy", "standard", "control", "committee", "incident"]
