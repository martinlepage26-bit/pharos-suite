"""
Backend API tests for Compass AI Enterprise Features
- Authentication (login/register)
- Audit Logging (logs and summary)
- API Keys (create, list, revoke)
- Benchmarks (sector data, comparisons)
- CRUD operations creating audit entries
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://admin-features-test-3.preview.emergentagent.com')
BASE_URL = BASE_URL.rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@compass.ai"
ADMIN_PASSWORD = "Admin123!"
TEST_USER_EMAIL = f"test_{uuid.uuid4().hex[:8]}@compass.ai"
TEST_USER_PASSWORD = "Test123!"


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test successful admin login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"
        print(f"✓ Admin login successful: {data['user']['email']}")
    
    def test_login_invalid_credentials(self):
        """Test login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials rejected correctly")
    
    def test_register_new_user(self):
        """Test user registration"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "name": "Test User",
            "role": "viewer"
        })
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == TEST_USER_EMAIL
        print(f"✓ User registration successful: {TEST_USER_EMAIL}")
    
    def test_get_me_authenticated(self):
        """Test getting current user with token"""
        # Login first
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_resp.json()["access_token"]
        
        # Get current user
        response = requests.get(f"{BASE_URL}/api/auth/me", 
            headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        print("✓ Get current user successful")
    
    def test_get_me_unauthenticated(self):
        """Test getting current user without token"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ Unauthenticated access rejected correctly")


class TestAuditLogging:
    """Audit log endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_resp.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_audit_logs(self):
        """Test fetching audit logs"""
        response = requests.get(f"{BASE_URL}/api/audit-logs", headers=self.headers)
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} audit log entries")
    
    def test_audit_logs_contain_login_events(self):
        """Verify login events are captured"""
        response = requests.get(f"{BASE_URL}/api/audit-logs", headers=self.headers)
        data = response.json()
        login_events = [log for log in data if log["action"] == "login"]
        assert len(login_events) > 0, "No login events found in audit logs"
        print(f"✓ Found {len(login_events)} login events in audit logs")
    
    def test_audit_log_summary(self):
        """Test audit log summary endpoint"""
        response = requests.get(f"{BASE_URL}/api/audit-logs/summary", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "by_action" in data
        assert "by_resource" in data
        assert "last_24h" in data
        print(f"✓ Audit summary: {data['by_action']}")
    
    def test_audit_logs_require_auth(self):
        """Verify audit logs require authentication"""
        response = requests.get(f"{BASE_URL}/api/audit-logs")
        assert response.status_code == 401
        print("✓ Audit logs require authentication")


class TestAPIKeys:
    """API key management tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_resp.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_list_api_keys(self):
        """Test listing API keys"""
        response = requests.get(f"{BASE_URL}/api/api-keys", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} API keys")
    
    def test_create_api_key(self):
        """Test creating a new API key"""
        key_name = f"Test Key {uuid.uuid4().hex[:8]}"
        response = requests.post(f"{BASE_URL}/api/api-keys", 
            headers=self.headers,
            json={
                "name": key_name,
                "scopes": ["read", "write"],
                "expires_in_days": 30
            })
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert "key" in data
        assert "id" in data
        assert data["name"] == key_name
        print(f"✓ Created API key: {data['name']}")
        return data["id"]
    
    def test_create_and_delete_api_key(self):
        """Test full lifecycle: create and delete API key"""
        # Create key
        key_name = f"Temp Key {uuid.uuid4().hex[:8]}"
        create_resp = requests.post(f"{BASE_URL}/api/api-keys",
            headers=self.headers,
            json={"name": key_name, "scopes": ["read"], "expires_in_days": 1})
        assert create_resp.status_code == 200
        key_id = create_resp.json()["id"]
        
        # Delete key
        delete_resp = requests.delete(f"{BASE_URL}/api/api-keys/{key_id}", 
            headers=self.headers)
        assert delete_resp.status_code == 200
        print(f"✓ API key lifecycle (create/delete) successful")


class TestBenchmarks:
    """Benchmark data endpoint tests"""
    
    def test_get_benchmark_saas(self):
        """Test getting SaaS sector benchmark"""
        response = requests.get(f"{BASE_URL}/api/benchmarks/SaaS")
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert "sector" in data
        assert "avg_score" in data
        assert "total_assessments" in data
        assert data["sector"] == "saas"
        print(f"✓ SaaS benchmark: avg_score={data['avg_score']}, total={data['total_assessments']}")
    
    def test_get_benchmark_healthcare(self):
        """Test getting Healthcare sector benchmark"""
        response = requests.get(f"{BASE_URL}/api/benchmarks/Healthcare")
        assert response.status_code == 200
        data = response.json()
        assert data["sector"] == "healthcare"
        print(f"✓ Healthcare benchmark: avg_score={data['avg_score']}")
    
    def test_get_all_benchmarks(self):
        """Test getting all sector benchmarks"""
        response = requests.get(f"{BASE_URL}/api/benchmarks")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        sectors = [b["sector"] for b in data]
        print(f"✓ All benchmarks retrieved: {sectors}")
    
    def test_benchmark_has_distribution_data(self):
        """Test benchmark includes distribution data"""
        response = requests.get(f"{BASE_URL}/api/benchmarks/SaaS")
        data = response.json()
        assert "percentile_25" in data
        assert "percentile_75" in data
        assert "percentile_90" in data
        assert "risk_distribution" in data
        assert "category_averages" in data
        print("✓ Benchmark includes all distribution data")


class TestCRUDAuditIntegration:
    """Test that CRUD operations create audit log entries"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_resp.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_client_create_generates_audit_log(self):
        """Verify creating a client generates an audit log entry"""
        # Get current audit log count
        logs_before = requests.get(f"{BASE_URL}/api/audit-logs", headers=self.headers).json()
        
        # Create a client
        client_name = f"TEST_Audit_Client_{uuid.uuid4().hex[:6]}"
        create_resp = requests.post(f"{BASE_URL}/api/clients",
            headers=self.headers,
            json={
                "company_name": client_name,
                "sector": "SaaS",
                "primary_contact": {
                    "name": "Test Contact",
                    "email": "test@example.com"
                }
            })
        assert create_resp.status_code == 200, f"Failed: {create_resp.text}"
        client_id = create_resp.json()["id"]
        
        # Check audit log
        logs_after = requests.get(f"{BASE_URL}/api/audit-logs", headers=self.headers).json()
        
        # Find create event for this client
        create_events = [log for log in logs_after 
                        if log["action"] == "create" 
                        and log["resource_type"] == "client"
                        and log["resource_name"] == client_name]
        
        assert len(create_events) > 0, "No audit log entry found for client creation"
        print(f"✓ Client creation generated audit log entry: {client_name}")
        
        # Cleanup - delete the client
        requests.delete(f"{BASE_URL}/api/clients/{client_id}", headers=self.headers)
    
    def test_client_update_generates_audit_log(self):
        """Verify updating a client generates an audit log entry"""
        # Create client
        client_name = f"TEST_Update_Client_{uuid.uuid4().hex[:6]}"
        create_resp = requests.post(f"{BASE_URL}/api/clients",
            headers=self.headers,
            json={
                "company_name": client_name,
                "sector": "Healthcare",
                "primary_contact": {"name": "Test", "email": "test@test.com"}
            })
        client_id = create_resp.json()["id"]
        
        # Update client
        updated_name = f"{client_name}_Updated"
        update_resp = requests.put(f"{BASE_URL}/api/clients/{client_id}",
            headers=self.headers,
            json={
                "company_name": updated_name,
                "sector": "Healthcare",
                "primary_contact": {"name": "Test", "email": "test@test.com"}
            })
        assert update_resp.status_code == 200
        
        # Check for update audit log
        logs = requests.get(f"{BASE_URL}/api/audit-logs", headers=self.headers).json()
        update_events = [log for log in logs 
                        if log["action"] == "update" 
                        and log["resource_type"] == "client"]
        
        assert len(update_events) > 0, "No audit log entry found for client update"
        print("✓ Client update generated audit log entry")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/clients/{client_id}", headers=self.headers)


class TestDashboardStats:
    """Test dashboard statistics endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_resp.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_dashboard_stats(self):
        """Test getting dashboard statistics"""
        response = requests.get(f"{BASE_URL}/api/stats/dashboard")
        assert response.status_code == 200
        data = response.json()
        assert "clients_count" in data
        assert "systems_count" in data or "ai_systems" in data
        assert "assessments_count" in data
        print(f"✓ Dashboard stats: {data.get('clients_count', data.get('clients'))} clients, {data.get('systems_count', data.get('ai_systems'))} systems, {data.get('assessments_count', data.get('assessments'))} assessments")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
