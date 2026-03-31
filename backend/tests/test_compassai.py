"""
Backend API tests for COMPASSai governance execution layer.

Coverage in this file:
- Dashboard stats: GET /api/stats/dashboard
- Clients: full CRUD lifecycle + 404 handling
- AI Systems: full CRUD lifecycle + referential integrity
- Assessments: create + list + deliverables generation
- Benchmarks: known sectors + 404 for unknown
- Scheduled assessments: create + list + due + deactivate
- Evidence upload: multipart file upload + size/ref validation
"""
import pytest
import requests
import os
import uuid
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSPHRASE = os.environ.get('ADMIN_PASSPHRASE', '')


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session."""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def admin_token(api_client):
    """Obtain an admin Bearer token for authenticated endpoints."""
    if not ADMIN_PASSPHRASE:
        pytest.skip("ADMIN_PASSPHRASE not configured — skipping authenticated tests")

    response = api_client.post(f"{BASE_URL}/api/admin/login", json={"passphrase": ADMIN_PASSPHRASE})
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    token = response.json()["token"]
    return token


def auth_headers(admin_token):
    """Build Authorization header dict."""
    return {"Authorization": f"Bearer {admin_token}"}


# ─── Dashboard ───

class TestDashboardStats:
    """GET /api/stats/dashboard — public aggregate."""

    def test_dashboard_returns_counts(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/stats/dashboard")
        assert response.status_code == 200
        data = response.json()
        assert "clients" in data
        assert "ai_systems" in data
        assert "assessments" in data
        assert "evidence_files" in data
        assert "active_schedules" in data
        assert "recent_assessments" in data
        print(f"✓ Dashboard stats: {data['clients']} clients, {data['ai_systems']} systems, {data['assessments']} assessments")


# ─── Clients ───

class TestClientsPublic:
    """Public read endpoints for clients."""

    def test_list_clients_returns_list(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/clients")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"✓ GET /api/clients returned {len(response.json())} clients")

    def test_get_nonexistent_client_returns_404(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/clients/nonexistent-id-000")
        assert response.status_code == 404
        print("✓ GET /api/clients/nonexistent returns 404")


class TestClientsCRUD:
    """Authenticated CRUD for clients."""

    def test_create_client(self, api_client, admin_token):
        uid = str(uuid.uuid4())[:8]
        payload = {
            "company_name": f"TEST_Client_{uid}",
            "sector": "SaaS",
            "primary_contact": {
                "name": f"Contact {uid}",
                "email": f"contact_{uid}@test.com",
                "title": "CTO"
            },
            "jurisdiction": "Quebec"
        }

        response = api_client.post(
            f"{BASE_URL}/api/clients",
            json=payload,
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 200, f"Create client failed: {response.text}"
        data = response.json()
        assert data["company_name"] == payload["company_name"]
        assert data["sector"] == "SaaS"
        assert data["primary_contact"]["name"] == payload["primary_contact"]["name"]
        assert "id" in data
        print(f"✓ Created client: {data['id']}")

    def test_create_and_update_client(self, api_client, admin_token):
        uid = str(uuid.uuid4())[:8]
        create_res = api_client.post(
            f"{BASE_URL}/api/clients",
            json={"company_name": f"TEST_Update_{uid}", "sector": "Healthcare"},
            headers=auth_headers(admin_token)
        )
        assert create_res.status_code == 200
        client_id = create_res.json()["id"]

        update_res = api_client.put(
            f"{BASE_URL}/api/clients/{client_id}",
            json={"sector": "Finance", "jurisdiction": "Ontario"},
            headers=auth_headers(admin_token)
        )
        assert update_res.status_code == 200
        updated = update_res.json()
        assert updated["sector"] == "Finance"
        assert updated["jurisdiction"] == "Ontario"
        print(f"✓ Updated client {client_id}")

    def test_create_and_delete_client(self, api_client, admin_token):
        uid = str(uuid.uuid4())[:8]
        create_res = api_client.post(
            f"{BASE_URL}/api/clients",
            json={"company_name": f"TEST_Delete_{uid}", "sector": "Education"},
            headers=auth_headers(admin_token)
        )
        assert create_res.status_code == 200
        client_id = create_res.json()["id"]

        delete_res = api_client.delete(
            f"{BASE_URL}/api/clients/{client_id}",
            headers=auth_headers(admin_token)
        )
        assert delete_res.status_code == 200
        assert delete_res.json()["status"] == "deleted"

        get_res = api_client.get(f"{BASE_URL}/api/clients/{client_id}")
        assert get_res.status_code == 404
        print(f"✓ Deleted client {client_id} and verified removal")

    def test_delete_nonexistent_client_returns_404(self, api_client, admin_token):
        response = api_client.delete(
            f"{BASE_URL}/api/clients/nonexistent-client-999",
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 404
        print("✓ Delete nonexistent client returns 404")

    def test_create_client_requires_auth(self, api_client):
        response = api_client.post(
            f"{BASE_URL}/api/clients",
            json={"company_name": "NoAuth", "sector": "SaaS"}
        )
        assert response.status_code == 401
        print("✓ Create client without auth returns 401")


# ─── AI Systems ───

class TestAISystemsPublic:
    """Public read endpoints for AI systems."""

    def test_list_ai_systems_returns_list(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/ai-systems")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"✓ GET /api/ai-systems returned {len(response.json())} systems")


class TestAISystemsCRUD:
    """Authenticated CRUD for AI systems with referential integrity."""

    @pytest.fixture(autouse=True)
    def _create_test_client(self, api_client, admin_token):
        """Create a client to own AI systems."""
        uid = str(uuid.uuid4())[:8]
        res = api_client.post(
            f"{BASE_URL}/api/clients",
            json={"company_name": f"TEST_SysOwner_{uid}", "sector": "SaaS"},
            headers=auth_headers(admin_token)
        )
        assert res.status_code == 200
        self.test_client_id = res.json()["id"]

    def test_create_ai_system(self, api_client, admin_token):
        uid = str(uuid.uuid4())[:8]
        payload = {
            "client_id": self.test_client_id,
            "system_name": f"TEST_System_{uid}",
            "system_type": "Classification",
            "system_description": "Automated ticket classifier",
            "decision_role": "Operational",
            "user_type": "Internal",
            "high_stakes": False,
            "intended_use": "Route support tickets",
            "human_override": True
        }

        response = api_client.post(
            f"{BASE_URL}/api/ai-systems",
            json=payload,
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 200, f"Create system failed: {response.text}"
        data = response.json()
        assert data["system_name"] == payload["system_name"]
        assert data["client_id"] == self.test_client_id
        assert data["human_override"] is True
        print(f"✓ Created AI system: {data['id']}")

    def test_create_system_bad_client_returns_400(self, api_client, admin_token):
        response = api_client.post(
            f"{BASE_URL}/api/ai-systems",
            json={
                "client_id": "nonexistent-client-000",
                "system_name": "Ghost System",
            },
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 400
        assert "client" in response.json()["detail"].lower()
        print("✓ Create system with bad client_id returns 400")

    def test_create_update_delete_system(self, api_client, admin_token):
        uid = str(uuid.uuid4())[:8]
        create_res = api_client.post(
            f"{BASE_URL}/api/ai-systems",
            json={
                "client_id": self.test_client_id,
                "system_name": f"TEST_CRUD_{uid}",
                "decision_role": "Informational",
                "high_stakes": False,
            },
            headers=auth_headers(admin_token)
        )
        assert create_res.status_code == 200
        system_id = create_res.json()["id"]

        update_res = api_client.put(
            f"{BASE_URL}/api/ai-systems/{system_id}",
            json={"decision_role": "Strategic", "high_stakes": True},
            headers=auth_headers(admin_token)
        )
        assert update_res.status_code == 200
        assert update_res.json()["decision_role"] == "Strategic"
        assert update_res.json()["high_stakes"] is True

        delete_res = api_client.delete(
            f"{BASE_URL}/api/ai-systems/{system_id}",
            headers=auth_headers(admin_token)
        )
        assert delete_res.status_code == 200
        print(f"✓ Full CRUD lifecycle for AI system {system_id}")


# ─── Assessments ───

class TestAssessmentsPublic:
    """Public read endpoints for assessments."""

    def test_list_assessments_returns_list(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/assessments")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"✓ GET /api/assessments returned {len(response.json())} assessments")


class TestAssessmentsCRUD:
    """Authenticated assessment creation and deliverables."""

    @pytest.fixture(autouse=True)
    def _create_test_client_and_system(self, api_client, admin_token):
        """Create a client + system for assessments."""
        uid = str(uuid.uuid4())[:8]
        client_res = api_client.post(
            f"{BASE_URL}/api/clients",
            json={"company_name": f"TEST_AssessOwner_{uid}", "sector": "Finance"},
            headers=auth_headers(admin_token)
        )
        assert client_res.status_code == 200
        self.test_client_id = client_res.json()["id"]

        system_res = api_client.post(
            f"{BASE_URL}/api/ai-systems",
            json={
                "client_id": self.test_client_id,
                "system_name": f"TEST_AssessSys_{uid}",
                "decision_role": "Strategic",
                "high_stakes": True,
            },
            headers=auth_headers(admin_token)
        )
        assert system_res.status_code == 200
        self.test_system_id = system_res.json()["id"]

    def test_create_assessment(self, api_client, admin_token):
        payload = {
            "client_id": self.test_client_id,
            "ai_system_id": self.test_system_id,
            "queries": [],
            "strict_mode": True,
            "governance": {
                "scope_locked": False,
                "allowed_uses_defined": False,
                "prohibited_uses_defined": False
            }
        }

        response = api_client.post(
            f"{BASE_URL}/api/assessments",
            json=payload,
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 200, f"Create assessment failed: {response.text}"
        data = response.json()
        assert data["client_id"] == self.test_client_id
        assert data["ai_system_id"] == self.test_system_id
        assert data["strict_mode"] is True
        assert "id" in data
        print(f"✓ Created assessment: {data['id']}")

    def test_create_assessment_bad_client_returns_400(self, api_client, admin_token):
        response = api_client.post(
            f"{BASE_URL}/api/assessments",
            json={
                "client_id": "nonexistent-000",
                "ai_system_id": self.test_system_id,
            },
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 400
        print("✓ Assessment with bad client returns 400")

    def test_create_assessment_bad_system_returns_400(self, api_client, admin_token):
        response = api_client.post(
            f"{BASE_URL}/api/assessments",
            json={
                "client_id": self.test_client_id,
                "ai_system_id": "nonexistent-000",
            },
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 400
        print("✓ Assessment with bad system returns 400")

    def test_assessment_deliverables(self, api_client, admin_token):
        create_res = api_client.post(
            f"{BASE_URL}/api/assessments",
            json={
                "client_id": self.test_client_id,
                "ai_system_id": self.test_system_id,
                "strict_mode": True,
                "governance": {"scope_locked": True, "allowed_uses_defined": True, "prohibited_uses_defined": False}
            },
            headers=auth_headers(admin_token)
        )
        assert create_res.status_code == 200
        assessment_id = create_res.json()["id"]

        deliv_res = api_client.get(f"{BASE_URL}/api/assessments/{assessment_id}/deliverables")
        assert deliv_res.status_code == 200
        data = deliv_res.json()
        assert data["assessment_id"] == assessment_id
        assert data["client"] is not None
        assert data["system"] is not None
        assert data["strict_mode"] is True
        assert len(data["deliverables"]) >= 2
        assert data["deliverables"][0]["type"] == "governance_summary"
        assert data["deliverables"][1]["type"] == "evidence_manifest"
        print(f"✓ Deliverables generated for assessment {assessment_id}")

    def test_deliverables_nonexistent_assessment_returns_404(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/assessments/nonexistent-000/deliverables")
        assert response.status_code == 404
        print("✓ Deliverables for nonexistent assessment returns 404")


# ─── Benchmarks ───

class TestBenchmarks:
    """Sector benchmark endpoint tests."""

    @pytest.mark.parametrize("sector", ["SaaS", "Healthcare", "Finance", "Education", "Public", "Construction", "Other"])
    def test_known_sector_returns_benchmark(self, api_client, sector):
        response = api_client.get(f"{BASE_URL}/api/benchmarks/{sector}")
        assert response.status_code == 200
        data = response.json()
        assert data["sector"] == sector
        assert "avg_systems_per_client" in data
        assert "governance_adoption_pct" in data
        assert "common_risk_tier" in data
        assert "top_controls" in data
        assert "regulatory_focus" in data
        print(f"✓ Benchmark for {sector}: {data['governance_adoption_pct']}% adoption")

    def test_unknown_sector_returns_404(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/benchmarks/UnknownSector")
        assert response.status_code == 404
        print("✓ Unknown sector returns 404")


# ─── Scheduled Assessments ───

class TestScheduledAssessments:
    """Authenticated scheduled assessment endpoints."""

    @pytest.fixture(autouse=True)
    def _create_test_client_and_system(self, api_client, admin_token):
        uid = str(uuid.uuid4())[:8]
        client_res = api_client.post(
            f"{BASE_URL}/api/clients",
            json={"company_name": f"TEST_SchedOwner_{uid}", "sector": "Public"},
            headers=auth_headers(admin_token)
        )
        assert client_res.status_code == 200
        self.test_client_id = client_res.json()["id"]

        system_res = api_client.post(
            f"{BASE_URL}/api/ai-systems",
            json={
                "client_id": self.test_client_id,
                "system_name": f"TEST_SchedSys_{uid}",
            },
            headers=auth_headers(admin_token)
        )
        assert system_res.status_code == 200
        self.test_system_id = system_res.json()["id"]

    def test_create_scheduled_assessment(self, api_client, admin_token):
        payload = {
            "client_id": self.test_client_id,
            "ai_system_id": self.test_system_id,
            "frequency": "quarterly",
            "notify_emails": ["ops@test.com", "governance@test.com"]
        }

        response = api_client.post(
            f"{BASE_URL}/api/scheduled-assessments",
            json=payload,
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 200, f"Create schedule failed: {response.text}"
        data = response.json()
        assert data["frequency"] == "quarterly"
        assert data["active"] is True
        assert data["next_due"] is not None
        assert len(data["notify_emails"]) == 2
        print(f"✓ Created scheduled assessment: {data['id']}, next due: {data['next_due']}")

    def test_list_scheduled_assessments(self, api_client, admin_token):
        response = api_client.get(
            f"{BASE_URL}/api/scheduled-assessments",
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"✓ Listed {len(response.json())} scheduled assessments")

    def test_list_due_assessments(self, api_client, admin_token):
        response = api_client.get(
            f"{BASE_URL}/api/scheduled-assessments/due",
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"✓ Listed {len(response.json())} due assessments")

    def test_deactivate_scheduled_assessment(self, api_client, admin_token):
        create_res = api_client.post(
            f"{BASE_URL}/api/scheduled-assessments",
            json={
                "client_id": self.test_client_id,
                "ai_system_id": self.test_system_id,
                "frequency": "monthly",
                "notify_emails": []
            },
            headers=auth_headers(admin_token)
        )
        assert create_res.status_code == 200
        schedule_id = create_res.json()["id"]

        delete_res = api_client.delete(
            f"{BASE_URL}/api/scheduled-assessments/{schedule_id}",
            headers=auth_headers(admin_token)
        )
        assert delete_res.status_code == 200
        assert delete_res.json()["status"] == "deactivated"
        print(f"✓ Deactivated scheduled assessment {schedule_id}")

    def test_scheduled_requires_auth(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/scheduled-assessments")
        assert response.status_code == 401
        print("✓ Scheduled assessments without auth returns 401")

    def test_create_schedule_bad_client_returns_400(self, api_client, admin_token):
        response = api_client.post(
            f"{BASE_URL}/api/scheduled-assessments",
            json={
                "client_id": "nonexistent-000",
                "ai_system_id": self.test_system_id,
                "frequency": "monthly",
            },
            headers=auth_headers(admin_token)
        )
        assert response.status_code == 400
        print("✓ Schedule with bad client returns 400")


# ─── Evidence Upload ───

class TestEvidenceUpload:
    """Authenticated evidence file upload."""

    @pytest.fixture(autouse=True)
    def _create_assessment(self, api_client, admin_token):
        uid = str(uuid.uuid4())[:8]
        client_res = api_client.post(
            f"{BASE_URL}/api/clients",
            json={"company_name": f"TEST_EvidOwner_{uid}", "sector": "Healthcare"},
            headers=auth_headers(admin_token)
        )
        self.test_client_id = client_res.json()["id"]

        system_res = api_client.post(
            f"{BASE_URL}/api/ai-systems",
            json={"client_id": self.test_client_id, "system_name": f"TEST_EvidSys_{uid}"},
            headers=auth_headers(admin_token)
        )
        self.test_system_id = system_res.json()["id"]

        assess_res = api_client.post(
            f"{BASE_URL}/api/assessments",
            json={"client_id": self.test_client_id, "ai_system_id": self.test_system_id},
            headers=auth_headers(admin_token)
        )
        self.test_assessment_id = assess_res.json()["id"]

    def test_upload_evidence_file(self, admin_token):
        """Upload a small text file as evidence."""
        file_content = b"Sample evidence document content for governance review."
        files = {"file": ("test_evidence.txt", io.BytesIO(file_content), "text/plain")}
        data = {
            "assessment_id": self.test_assessment_id,
            "control_id": "CTRL-001",
            "description": "Test bias audit log"
        }

        response = requests.post(
            f"{BASE_URL}/api/evidence/upload",
            files=files,
            data=data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Upload failed: {response.text}"
        result = response.json()
        assert result["assessment_id"] == self.test_assessment_id
        assert result["control_id"] == "CTRL-001"
        assert result["filename"] == "test_evidence.txt"
        assert result["size_bytes"] == len(file_content)
        print(f"✓ Uploaded evidence: {result['id']} ({result['size_bytes']} bytes)")

    def test_upload_evidence_bad_assessment_returns_400(self, admin_token):
        files = {"file": ("bad.txt", io.BytesIO(b"test"), "text/plain")}
        data = {"assessment_id": "nonexistent-000", "control_id": "", "description": ""}

        response = requests.post(
            f"{BASE_URL}/api/evidence/upload",
            files=files,
            data=data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 400
        print("✓ Evidence upload with bad assessment returns 400")

    def test_upload_evidence_requires_auth(self):
        files = {"file": ("noauth.txt", io.BytesIO(b"test"), "text/plain")}
        data = {"assessment_id": "any", "control_id": "", "description": ""}

        response = requests.post(
            f"{BASE_URL}/api/evidence/upload",
            files=files,
            data=data,
        )
        assert response.status_code == 401
        print("✓ Evidence upload without auth returns 401")


# ─── Cleanup ───

@pytest.fixture(scope="module", autouse=True)
def cleanup_test_data(api_client, admin_token):
    """Remove TEST_ prefixed records after all tests."""
    yield

    headers = auth_headers(admin_token)

    # Clean up scheduled assessments
    try:
        sched_res = api_client.get(f"{BASE_URL}/api/scheduled-assessments", headers=headers)
        if sched_res.status_code == 200:
            for sched in sched_res.json():
                api_client.delete(f"{BASE_URL}/api/scheduled-assessments/{sched['id']}", headers=headers)
    except Exception:
        pass

    # Clean up AI systems
    try:
        systems_res = api_client.get(f"{BASE_URL}/api/ai-systems")
        if systems_res.status_code == 200:
            for system in systems_res.json():
                if system.get("system_name", "").startswith("TEST_"):
                    api_client.delete(f"{BASE_URL}/api/ai-systems/{system['id']}", headers=headers)
    except Exception:
        pass

    # Clean up clients
    try:
        clients_res = api_client.get(f"{BASE_URL}/api/clients")
        if clients_res.status_code == 200:
            for client in clients_res.json():
                if client.get("company_name", "").startswith("TEST_"):
                    api_client.delete(f"{BASE_URL}/api/clients/{client['id']}", headers=headers)
    except Exception:
        pass

    print("\n✓ COMPASSai test cleanup completed")
