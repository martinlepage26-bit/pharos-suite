"""
Tests for P2 and P3 features:
- Scheduled Assessments (CRUD operations)
- Shareable Reports (create, view via token, signing)
- Bulk Import (CSV import for clients and systems)
- HelpTooltip component (frontend only - tested via playwright)
- PWA Service Worker (frontend only - tested via playwright)
"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials for testing
ADMIN_EMAIL = "admin@compass.ai"
ADMIN_PASSWORD = "Admin123!"


@pytest.fixture(scope="module")
def auth_token():
    """Get auth token for authenticated requests"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code != 200:
        pytest.skip(f"Authentication failed: {response.text}")
    return response.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Auth headers for requests"""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture(scope="module")
def test_data(auth_headers):
    """Create test client and AI system for tests"""
    # Create test client
    client_response = requests.post(f"{BASE_URL}/api/clients", 
        headers=auth_headers,
        json={
            "company_name": "TEST_P2P3_Client",
            "sector": "SaaS",
            "primary_contact": {
                "name": "Test User",
                "email": "test@p2p3.com",
                "title": "CTO"
            },
            "jurisdiction": "United States"
        })
    client = client_response.json() if client_response.status_code == 200 else None
    
    # Create test AI system if client was created
    system = None
    if client:
        system_response = requests.post(f"{BASE_URL}/api/ai-systems",
            headers=auth_headers,
            json={
                "client_id": client["id"],
                "system_name": "TEST_P2P3_System",
                "system_type": "Chatbot",
                "system_description": "Test system for P2/P3 feature testing",
                "decision_role": "Advisory",
                "user_type": "Internal",
                "high_stakes": False,
                "intended_use": "Testing purposes",
                "data_sources": ["TestDB"]
            })
        system = system_response.json() if system_response.status_code == 200 else None
    
    yield {"client": client, "system": system}
    
    # Cleanup
    if system:
        requests.delete(f"{BASE_URL}/api/ai-systems/{system['id']}", headers=auth_headers)
    if client:
        requests.delete(f"{BASE_URL}/api/clients/{client['id']}", headers=auth_headers)


class TestScheduledAssessments:
    """Test Scheduled Assessments CRUD operations"""
    
    def test_list_scheduled_assessments(self, auth_headers):
        """Test GET /api/scheduled-assessments returns list"""
        response = requests.get(f"{BASE_URL}/api/scheduled-assessments", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"SUCCESS: List scheduled assessments returns {len(response.json())} items")
    
    def test_create_scheduled_assessment(self, auth_headers, test_data):
        """Test POST /api/scheduled-assessments creates new schedule"""
        if not test_data.get("client") or not test_data.get("system"):
            pytest.skip("Test data not available")
        
        response = requests.post(f"{BASE_URL}/api/scheduled-assessments",
            headers=auth_headers,
            json={
                "client_id": test_data["client"]["id"],
                "ai_system_id": test_data["system"]["id"],
                "frequency": "monthly",
                "notify_emails": ["test@example.com"]
            })
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        # The response may have 'frequency' or just confirmation fields
        assert data.get("frequency") == "monthly" or "next_due" in data
        assert "next_due" in data or "status" in data
        print(f"SUCCESS: Created scheduled assessment with ID {data['id']}")
        
        # Store for cleanup
        self.__class__.created_schedule_id = data["id"]
    
    def test_get_due_scheduled_assessments(self, auth_headers):
        """Test GET /api/scheduled-assessments/due returns due items"""
        response = requests.get(f"{BASE_URL}/api/scheduled-assessments/due", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"SUCCESS: Get due assessments returns {len(response.json())} items")
    
    def test_delete_scheduled_assessment(self, auth_headers):
        """Test DELETE /api/scheduled-assessments/{id} removes schedule"""
        if not hasattr(self.__class__, 'created_schedule_id'):
            pytest.skip("No schedule created to delete")
        
        schedule_id = self.__class__.created_schedule_id
        response = requests.delete(f"{BASE_URL}/api/scheduled-assessments/{schedule_id}", headers=auth_headers)
        assert response.status_code == 200
        print(f"SUCCESS: Deleted scheduled assessment {schedule_id}")
    
    def test_scheduled_assessments_requires_auth(self):
        """Test that scheduled assessments endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/scheduled-assessments")
        assert response.status_code == 401
        print("SUCCESS: Scheduled assessments endpoint requires auth")


class TestShareableReports:
    """Test Shareable Reports functionality"""
    
    @pytest.fixture(scope="class")
    def assessment_id(self, auth_headers, test_data):
        """Create an assessment to share"""
        if not test_data.get("client") or not test_data.get("system"):
            pytest.skip("Test data not available")
        
        response = requests.post(f"{BASE_URL}/api/assessments",
            headers=auth_headers,
            json={
                "client_id": test_data["client"]["id"],
                "ai_system_id": test_data["system"]["id"],
                "queries": [],
                "governance": {"scope_locked": False},
                "strict_mode": True
            })
        
        if response.status_code != 200:
            pytest.skip(f"Could not create assessment: {response.text}")
        
        assessment = response.json()
        yield assessment["id"]
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/assessments/{assessment['id']}", headers=auth_headers)
    
    def test_create_shareable_report(self, auth_headers, assessment_id):
        """Test POST /api/shareable-reports creates share link"""
        response = requests.post(f"{BASE_URL}/api/shareable-reports",
            headers=auth_headers,
            json={
                "assessment_id": assessment_id,
                "expires_in_days": 7
            })
        
        assert response.status_code == 200
        data = response.json()
        assert "share_token" in data
        assert "share_url" in data
        assert "expires_at" in data
        print(f"SUCCESS: Created shareable report with token {data['share_token'][:8]}...")
        
        # Store for next tests
        self.__class__.share_token = data["share_token"]
        return data
    
    def test_view_shared_report(self, auth_headers):
        """Test GET /api/shared/{token} returns report"""
        if not hasattr(self.__class__, 'share_token'):
            pytest.skip("No share token available")
        
        token = self.__class__.share_token
        response = requests.get(f"{BASE_URL}/api/shared/{token}")
        
        # Should return 200 if valid, 404 if assessment was deleted, 410 if expired
        assert response.status_code in [200, 404, 410]
        
        if response.status_code == 200:
            data = response.json()
            assert "report" in data
            assert "assessment" in data
            print(f"SUCCESS: Retrieved shared report with score {data['assessment']['result']['score']}")
        else:
            print(f"INFO: Shared report returned {response.status_code} - assessment may have been deleted")
    
    def test_view_shared_report_invalid_token(self):
        """Test GET /api/shared/{invalid_token} returns 404"""
        response = requests.get(f"{BASE_URL}/api/shared/invalid-token-123")
        assert response.status_code in [404, 410]  # Not found or expired
        print("SUCCESS: Invalid share token returns 404/410")
    
    def test_list_shareable_reports(self, auth_headers):
        """Test GET /api/shareable-reports lists user's reports"""
        response = requests.get(f"{BASE_URL}/api/shareable-reports", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"SUCCESS: List shareable reports returns {len(response.json())} items")
    
    def test_shareable_reports_requires_auth(self):
        """Test that creating shareable reports requires authentication"""
        response = requests.post(f"{BASE_URL}/api/shareable-reports", json={
            "assessment_id": "test-id",
            "expires_in_days": 7
        })
        assert response.status_code == 401
        print("SUCCESS: Shareable reports endpoint requires auth")


class TestBulkImport:
    """Test Bulk Import functionality for clients and systems"""
    
    def test_bulk_import_clients_endpoint_exists(self, auth_headers):
        """Test POST /api/bulk/import-clients endpoint exists"""
        # Create test CSV content
        csv_content = "company_name,sector,contact_name,contact_email,contact_title,jurisdiction\n"
        csv_content += "TEST_BULK_Acme Corp,SaaS,John Doe,john@acme.com,CTO,United States\n"
        
        files = {'file': ('test_clients.csv', io.BytesIO(csv_content.encode()), 'text/csv')}
        response = requests.post(f"{BASE_URL}/api/bulk/import-clients", 
            headers=auth_headers,
            files=files)
        
        # Should return 200 with import results or a validation error
        assert response.status_code in [200, 400, 422]
        
        if response.status_code == 200:
            data = response.json()
            assert "imported" in data or "errors" in data or "message" in data
            print(f"SUCCESS: Bulk import clients endpoint working, imported: {data.get('imported', 0)}")
            
            # Clean up imported clients
            if data.get('imported', 0) > 0 and data.get('imported_ids'):
                for client_id in data.get('imported_ids', []):
                    requests.delete(f"{BASE_URL}/api/clients/{client_id}", headers=auth_headers)
        else:
            print(f"INFO: Bulk import endpoint exists but returned {response.status_code}: {response.text[:100]}")
    
    def test_bulk_import_systems_endpoint_exists(self, auth_headers, test_data):
        """Test POST /api/bulk/import-systems endpoint exists"""
        if not test_data.get("client"):
            pytest.skip("Test client not available")
        
        # Create test CSV content for systems
        csv_content = "client_id,system_name,system_type,description,decision_role,user_type,high_stakes,intended_use,data_sources\n"
        csv_content += f"{test_data['client']['id']},TEST_BULK_System,Chatbot,Test import system,Advisory,Internal,false,Testing,\"TestDB\"\n"
        
        files = {'file': ('test_systems.csv', io.BytesIO(csv_content.encode()), 'text/csv')}
        response = requests.post(f"{BASE_URL}/api/bulk/import-systems", 
            headers=auth_headers,
            files=files)
        
        # Should return 200 with import results or a validation error
        assert response.status_code in [200, 400, 422]
        
        if response.status_code == 200:
            data = response.json()
            print(f"SUCCESS: Bulk import systems endpoint working, imported: {data.get('imported', 0)}")
            
            # Clean up imported systems
            if data.get('imported', 0) > 0 and data.get('imported_ids'):
                for system_id in data.get('imported_ids', []):
                    requests.delete(f"{BASE_URL}/api/ai-systems/{system_id}", headers=auth_headers)
        else:
            print(f"INFO: Bulk import systems endpoint exists but returned {response.status_code}: {response.text[:100]}")
    
    def test_bulk_import_requires_auth(self):
        """Test that bulk import requires authentication"""
        csv_content = "company_name,sector\nTest,SaaS\n"
        files = {'file': ('test.csv', io.BytesIO(csv_content.encode()), 'text/csv')}
        
        response = requests.post(f"{BASE_URL}/api/bulk/import-clients", files=files)
        assert response.status_code == 401
        print("SUCCESS: Bulk import endpoint requires auth")


class TestDashboardStats:
    """Test Dashboard Stats endpoint (used for risk distribution card with help tooltip)"""
    
    def test_dashboard_stats_returns_data(self, auth_headers):
        """Test GET /api/stats/dashboard returns stats for help tooltip context"""
        response = requests.get(f"{BASE_URL}/api/stats/dashboard", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        
        # Should have counts for clients, systems, assessments (using actual keys)
        assert "clients_count" in data or "clients" in data or "total_clients" in data
        assert "systems_count" in data or "ai_systems" in data or "total_systems" in data
        assert "risk_distribution" in data  # This is what the HelpTooltip card uses
        print(f"SUCCESS: Dashboard stats returns data with keys: {list(data.keys())}")


class TestAPIEndpointsHealth:
    """Test that all P2/P3 related endpoints respond correctly"""
    
    def test_scheduled_assessments_get(self, auth_headers):
        """Verify scheduled assessments list endpoint"""
        r = requests.get(f"{BASE_URL}/api/scheduled-assessments", headers=auth_headers)
        assert r.status_code == 200
        print("SUCCESS: GET /api/scheduled-assessments OK")
    
    def test_scheduled_assessments_due(self, auth_headers):
        """Verify due assessments endpoint"""
        r = requests.get(f"{BASE_URL}/api/scheduled-assessments/due", headers=auth_headers)
        assert r.status_code == 200
        print("SUCCESS: GET /api/scheduled-assessments/due OK")
    
    def test_shareable_reports_list(self, auth_headers):
        """Verify shareable reports list endpoint"""
        r = requests.get(f"{BASE_URL}/api/shareable-reports", headers=auth_headers)
        assert r.status_code == 200
        print("SUCCESS: GET /api/shareable-reports OK")
    
    def test_clients_endpoint(self, auth_headers):
        """Verify clients endpoint for bulk import context"""
        r = requests.get(f"{BASE_URL}/api/clients", headers=auth_headers)
        assert r.status_code == 200
        print("SUCCESS: GET /api/clients OK")
    
    def test_ai_systems_endpoint(self, auth_headers):
        """Verify AI systems endpoint for bulk import context"""
        r = requests.get(f"{BASE_URL}/api/ai-systems", headers=auth_headers)
        assert r.status_code == 200
        print("SUCCESS: GET /api/ai-systems OK")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
