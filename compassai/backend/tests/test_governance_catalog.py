from pathlib import Path

from compassai.backend.governance_catalog import (
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


def _artifact_payload(slug: str = "governance-incident-playbook") -> dict:
    return {
        "slug": slug,
        "filename": f"{slug.replace('-', '_')}.md",
        "title": "Governance Incident Playbook",
        "artifact_type": "playbook",
        "summary": "Incident escalation and governance handling guidance.",
        "tags": ["incident", "governance"],
        "policy_domain": "incident-management",
        "competencies": ["incident-response"],
        "linked_control_ids": ["MON-03"],
        "taxonomy": {
            "domain": "Operations / Runtime",
            "control_function": "Incident response",
            "artifact_class": "playbook",
            "subject_object": "governance escalation",
            "lifecycle_stage": "incident handling",
            "evidence_status": "approved",
            "formality": "operational",
            "file_format": ".md",
        },
        "content_markdown": "# Governance Incident Playbook\n\nEscalation steps.",
    }


def test_governance_artifact_empty_list_query_returns_empty(client, admin_headers):
    response = client.get("/api/governance/artifacts", headers=admin_headers)

    assert response.status_code == 200
    assert response.json() == []


def test_governance_artifact_crud_cycle(client, admin_headers):
    create_response = client.post(
        "/api/governance/artifacts",
        headers=admin_headers,
        json=_artifact_payload(),
    )
    assert create_response.status_code == 201
    created = create_response.json()
    artifact_id = created["id"]

    get_response = client.get(f"/api/governance/artifacts/{artifact_id}", headers=admin_headers)
    assert get_response.status_code == 200
    assert get_response.json()["slug"] == "governance-incident-playbook"

    list_response = client.get("/api/governance/artifacts", headers=admin_headers)
    assert list_response.status_code == 200
    assert [item["id"] for item in list_response.json()] == [artifact_id]

    update_response = client.put(
        f"/api/governance/artifacts/{artifact_id}",
        headers=admin_headers,
        json={
            "title": "Updated Governance Incident Playbook",
            "summary": "Updated escalation guidance.",
            "content_markdown": "# Updated Governance Incident Playbook\n\nUpdated escalation steps.",
        },
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["title"] == "Updated Governance Incident Playbook"
    assert updated["summary"] == "Updated escalation guidance."
    assert updated["content_hash"].startswith("sha256:")

    delete_response = client.delete(f"/api/governance/artifacts/{artifact_id}", headers=admin_headers)
    assert delete_response.status_code == 200
    assert delete_response.json() == {"status": "deleted", "id": artifact_id}

    missing_response = client.get(f"/api/governance/artifacts/{artifact_id}", headers=admin_headers)
    assert missing_response.status_code == 404


def test_governance_artifact_duplicate_key_rejected(client, admin_headers):
    response_one = client.post(
        "/api/governance/artifacts",
        headers=admin_headers,
        json=_artifact_payload(slug="duplicate-artifact"),
    )
    assert response_one.status_code == 201

    response_two = client.post(
        "/api/governance/artifacts",
        headers=admin_headers,
        json=_artifact_payload(slug="duplicate-artifact"),
    )
    assert response_two.status_code == 409
    assert response_two.json()["detail"] == "Governance artifact slug already exists"


def test_governance_artifact_missing_required_field_validation(client, admin_headers):
    response = client.post(
        "/api/governance/artifacts",
        headers=admin_headers,
        json={"filename": "missing_title.md", "artifact_type": "playbook"},
    )

    assert response.status_code == 422


def test_governance_artifact_auth_boundary_requires_authentication(client):
    get_response = client.get("/api/governance/artifacts")
    post_response = client.post("/api/governance/artifacts", json=_artifact_payload())

    assert get_response.status_code in {401, 403}
    assert post_response.status_code in {401, 403}
