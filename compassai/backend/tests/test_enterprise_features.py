from __future__ import annotations


def test_admin_login_and_me(client, admin_headers):
    me = client.get("/api/auth/me", headers=admin_headers)

    assert me.status_code == 200
    assert me.json()["email"] == "admin@compass.ai"
    assert me.json()["role"] == "admin"


def test_register_new_user_and_login(client):
    register = client.post(
        "/api/auth/register",
        json={
            "email": "viewer@compass.ai",
            "password": "Viewer123!",
            "name": "Viewer User",
            "role": "viewer",
        },
    )

    assert register.status_code == 200
    assert register.json()["user"]["email"] == "viewer@compass.ai"

    login = client.post(
        "/api/auth/login",
        json={"email": "viewer@compass.ai", "password": "Viewer123!"},
    )
    assert login.status_code == 200


def test_audit_log_summary_populates_after_login(client, admin_headers):
    response = client.get("/api/audit-logs/summary", headers=admin_headers)

    assert response.status_code == 200
    payload = response.json()
    assert "by_action" in payload
    assert "login" in payload["by_action"]
    assert payload["last_24h"] >= 1


def test_api_key_lifecycle(client, admin_headers):
    create = client.post(
        "/api/api-keys",
        headers=admin_headers,
        json={"name": "Test Key", "scopes": ["read", "write"], "expires_in_days": 30},
    )

    assert create.status_code == 200
    key_id = create.json()["id"]
    assert create.json()["key"].startswith("cai_")

    listed = client.get("/api/api-keys", headers=admin_headers)
    assert listed.status_code == 200
    assert any(item["id"] == key_id for item in listed.json())

    revoked = client.delete(f"/api/api-keys/{key_id}", headers=admin_headers)
    assert revoked.status_code == 200

    listed_after = client.get("/api/api-keys", headers=admin_headers)
    assert all(item["id"] != key_id for item in listed_after.json())


def test_benchmark_seed_fetch_and_list(client, admin_headers, seeded_client_system_assessment):
    seeded = client.post("/api/benchmarks/seed", headers=admin_headers)
    assert seeded.status_code == 200

    sector = client.get("/api/benchmarks/SaaS")
    assert sector.status_code == 200
    assert sector.json()["sector"] == "saas"
    assert "avg_score" in sector.json()

    assessment_id = seeded_client_system_assessment["assessment"]["id"]
    comparison = client.get(f"/api/benchmarks/SaaS/compare/{assessment_id}")
    assert comparison.status_code == 200
    assert comparison.json()["assessment_id"] == assessment_id

    all_benchmarks = client.get("/api/benchmarks")
    assert all_benchmarks.status_code == 200
    assert any(item["sector"] == "saas" for item in all_benchmarks.json())
