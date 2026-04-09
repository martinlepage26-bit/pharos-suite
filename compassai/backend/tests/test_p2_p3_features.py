# UNIT TESTS — mock-only. Uses InMemoryDatabase + FakeAIService. No live services required.
from __future__ import annotations

import io


def test_scheduled_assessment_crud(client, admin_headers, seeded_client_system_assessment):
    created = client.post(
        "/api/scheduled-assessments",
        headers=admin_headers,
        json={
            "client_id": seeded_client_system_assessment["client"]["id"],
            "ai_system_id": seeded_client_system_assessment["system"]["id"],
            "frequency": "monthly",
            "notify_emails": ["ops@example.com"],
        },
    )

    assert created.status_code == 200
    schedule_id = created.json()["id"]

    listed = client.get("/api/scheduled-assessments", headers=admin_headers)
    assert listed.status_code == 200
    assert any(item["id"] == schedule_id for item in listed.json())

    due = client.get("/api/scheduled-assessments/due", headers=admin_headers)
    assert due.status_code == 200

    deleted = client.delete(f"/api/scheduled-assessments/{schedule_id}", headers=admin_headers)
    assert deleted.status_code == 200


def test_shareable_report_flow(client, admin_headers, seeded_client_system_assessment):
    assessment_id = seeded_client_system_assessment["assessment"]["id"]

    created = client.post(
        "/api/shareable-reports",
        headers=admin_headers,
        json={"assessment_id": assessment_id, "expires_in_days": 7},
    )

    assert created.status_code == 200
    share_token = created.json()["share_token"]

    listed = client.get("/api/shareable-reports", headers=admin_headers)
    assert listed.status_code == 200
    assert any(item["share_token"] == share_token for item in listed.json())

    shared = client.get(f"/api/shared/{share_token}")
    assert shared.status_code == 200
    assert shared.json()["assessment"]["id"] == assessment_id


def test_bulk_import_clients_and_systems(client, admin_headers, seeded_client_system_assessment):
    client_csv = io.BytesIO(
        b"company_name,sector,contact_name,contact_email,contact_title,jurisdiction\nBulk Co,SaaS,Bulk User,bulk@example.com,CTO,Canada\n"
    )
    clients_response = client.post(
        "/api/bulk/import-clients",
        headers=admin_headers,
        files={"file": ("clients.csv", client_csv, "text/csv")},
    )

    assert clients_response.status_code == 200
    assert clients_response.json()["imported"] == 1

    system_csv = io.BytesIO(
        (
            "client_id,system_name,system_type,description,decision_role,user_type,high_stakes,intended_use,data_sources\n"
            f"{seeded_client_system_assessment['client']['id']},Bulk System,Chatbot,Imported system,Advisory,Internal,false,Testing,\"CRM,Docs\"\n"
        ).encode("utf-8")
    )
    systems_response = client.post(
        "/api/bulk/import-systems",
        headers=admin_headers,
        files={"file": ("systems.csv", system_csv, "text/csv")},
    )

    assert systems_response.status_code == 200
    assert systems_response.json()["imported"] == 1


def test_dashboard_stats_reflect_seeded_records(client, admin_headers, seeded_client_system_assessment):
    response = client.get("/api/stats/dashboard")

    assert response.status_code == 200
    payload = response.json()
    assert payload["clients_count"] >= 1
    assert payload["systems_count"] >= 1
    assert payload["assessments_count"] >= 1
    assert "risk_distribution" in payload
