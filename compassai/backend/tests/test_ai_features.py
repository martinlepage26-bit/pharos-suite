# UNIT TESTS — mock-only. Uses InMemoryDatabase + FakeAIService. No live services required.
from __future__ import annotations

import uuid


SAMPLE_POLICY_TEXT = """
AI Governance Policy Document

This policy establishes guidelines for the responsible development, deployment, monitoring,
and review of artificial intelligence systems. The organization documents controls, tests
bias and fairness, and requires ongoing oversight and incident response readiness.
"""

SAMPLE_CONTRACT_TEXT = """
AI SERVICES AGREEMENT

Provider will deliver AI-powered analytics services, maintain documentation of models,
protect client data, notify the client of major algorithm changes, and support compliance audits.
"""

SAMPLE_PROFILE_TEXT = """
Company Profile Document

Organization: Acme Healthcare Solutions
Industry: Healthcare Technology
Location: San Francisco, CA, United States

Contact Information:
Name: Dr. Sarah Johnson
Title: Chief Medical Officer
Email: sjohnson@acmehealthcare.com

AI System Overview:
System Name: DiagnostiAI
Type: Clinical Decision Support System
"""


def test_policy_analysis_runs_in_process(client):
    response = client.post(
        "/api/ai/analyze-policy",
        json={"document_text": SAMPLE_POLICY_TEXT, "model": "gpt-5.2"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["model_used"] == "gpt-5.2"
    assert payload["analysis"]["compliance_score"] == 82
    assert payload["analysis"]["recommendations"]


def test_policy_analysis_rejects_short_document(client):
    response = client.post(
        "/api/ai/analyze-policy",
        json={"document_text": "Too short", "model": "gpt-5.2"},
    )

    assert response.status_code == 400


def test_contract_analysis_runs_in_process(client):
    response = client.post(
        "/api/ai/analyze-contract",
        json={"contract_text": SAMPLE_CONTRACT_TEXT, "model": "claude"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["model_used"] == "claude"
    assert payload["analysis"]["overall_risk"] == "medium"


def test_market_intelligence_endpoint_and_cache(client):
    first = client.get("/api/market-intelligence/SaaS")
    second = client.get("/api/market-intelligence/SaaS")

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["sector"] == "saas"
    assert first.json()["intelligence"]["regulatory_updates"]
    assert second.json()["sector"] == "saas"


def test_auto_fill_extracts_expected_shape(client):
    response = client.post(
        "/api/ai/auto-fill",
        json={"document_text": SAMPLE_PROFILE_TEXT, "model": "gpt-5.2"},
    )

    assert response.status_code == 200
    payload = response.json()["extracted_data"]
    assert payload["client_info"]["company_name"] == "Acme Healthcare Solutions"
    assert payload["ai_system_info"]["system_name"] == "DiagnostiAI"


def test_onboarding_submission_approve_and_reject_flow(client):
    unique = uuid.uuid4().hex[:8]
    submission_response = client.post(
        "/api/onboarding/submit",
        json={
            "company_name": f"TEST_Onboarding_{unique}",
            "sector": "Healthcare",
            "jurisdiction": "United States",
            "contact_name": "Casey Review",
            "contact_email": f"casey_{unique}@example.com",
            "contact_title": "Chief AI Officer",
            "systems": [
                {
                    "system_name": "Diagnostic Assistant",
                    "system_type": "Clinical Decision Support",
                    "system_description": "Analyzes scans",
                    "decision_role": "Advisory",
                    "user_type": "Internal",
                    "high_stakes": True,
                }
            ],
            "notes": "Test onboarding submission",
        },
    )

    assert submission_response.status_code == 200
    submission_id = submission_response.json()["id"]

    pending_list = client.get("/api/onboarding/submissions?status=pending")
    assert pending_list.status_code == 200
    assert any(item["id"] == submission_id for item in pending_list.json())

    detail = client.get(f"/api/onboarding/submissions/{submission_id}")
    assert detail.status_code == 200
    assert detail.json()["company_name"].startswith("TEST_Onboarding_")

    approved = client.put(f"/api/onboarding/submissions/{submission_id}/approve")
    assert approved.status_code == 200
    client_id = approved.json()["client_id"]
    assert approved.json()["status"] == "approved"

    client_detail = client.get(f"/api/clients/{client_id}")
    assert client_detail.status_code == 200

    reject_unique = uuid.uuid4().hex[:8]
    reject_submission = client.post(
        "/api/onboarding/submit",
        json={
            "company_name": f"TEST_Reject_{reject_unique}",
            "sector": "Public",
            "contact_name": "Reject Review",
            "contact_email": f"reject_{reject_unique}@example.com",
        },
    )
    reject_id = reject_submission.json()["id"]

    rejected = client.put(
        f"/api/onboarding/submissions/{reject_id}/reject",
        params={"reason": "Incomplete information"},
    )
    assert rejected.status_code == 200
    assert rejected.json()["status"] == "rejected"
