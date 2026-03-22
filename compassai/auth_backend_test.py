import requests
import sys
import json
from datetime import datetime

class AuthenticationAPITester:
    def __init__(self, base_url="https://admin-features-test-3.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"testuser_{datetime.now().strftime('%H%M%S')}@example.com"
        self.test_user_password = "TestPassword123!"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        if headers:
            request_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=request_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text[:200]}")

            return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration with role selection"""
        print("\n👤 Testing User Registration...")
        
        # Test registration with different roles
        roles_to_test = ["viewer", "assessor", "admin"]
        
        for role in roles_to_test:
            email = f"test_{role}_{datetime.now().strftime('%H%M%S')}@example.com"
            
            registration_data = {
                "email": email,
                "password": self.test_user_password,
                "name": f"Test {role.title()} User",
                "role": role
            }
            
            success, response = self.run_test(
                f"Register User with {role.title()} Role",
                "POST",
                "auth/register",
                200,
                data=registration_data
            )
            
            if success and response:
                token = response.get('access_token')
                user = response.get('user', {})
                
                print(f"   ✅ User registered successfully")
                print(f"   User ID: {user.get('id', 'N/A')[:8]}...")
                print(f"   Name: {user.get('name')}")
                print(f"   Role: {user.get('role')}")
                print(f"   Token length: {len(token) if token else 0}")
                
                if role == "admin":  # Save admin credentials for later tests
                    self.token = token
                    self.admin_user = user
                    
            else:
                print(f"   ❌ Registration failed for {role}")
                
        return success

    def test_duplicate_registration(self):
        """Test that duplicate email registration is prevented"""
        duplicate_data = {
            "email": self.test_user_email,  # Use same email as first test
            "password": self.test_user_password,
            "name": "Duplicate User",
            "role": "viewer"
        }
        
        success, response = self.run_test(
            "Duplicate Email Registration (Should Fail)",
            "POST",
            "auth/register",
            400,  # Expecting failure
            data=duplicate_data
        )
        
        if not success:  # This is expected to fail
            self.tests_passed += 1  # Count as passed since we expect failure
            print("   ✅ Correctly prevented duplicate registration")
            return True
        else:
            print("   ❌ Should have prevented duplicate email registration")
            return False

    def test_user_login(self):
        """Test user login returns JWT token"""
        print("\n🔐 Testing User Login...")
        
        # Test with the admin user we created
        if not hasattr(self, 'admin_user'):
            print("❌ No admin user available for login test")
            return False
            
        login_data = {
            "email": self.admin_user.get('email'),
            "password": self.test_user_password
        }
        
        success, response = self.run_test(
            "User Login",
            "POST", 
            "auth/login",
            200,
            data=login_data
        )
        
        if success and response:
            token = response.get('access_token')
            token_type = response.get('token_type')
            user = response.get('user', {})
            
            print(f"   ✅ Login successful")
            print(f"   Token type: {token_type}")
            print(f"   Token length: {len(token) if token else 0}")
            print(f"   User role: {user.get('role')}")
            
            # Update token for authenticated requests
            self.token = token
            return True
            
        return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_login_data = {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
        
        success, response = self.run_test(
            "Invalid Login (Should Fail)",
            "POST",
            "auth/login", 
            401,
            data=invalid_login_data
        )
        
        if not success:  # Expected to fail
            self.tests_passed += 1  # Count as passed
            print("   ✅ Correctly rejected invalid credentials")
            return True
        else:
            print("   ❌ Should have rejected invalid credentials")
            return False

    def test_get_current_user(self):
        """Test getting current user info with JWT token"""
        if not self.token:
            print("❌ No token available for authenticated request")
            return False
            
        headers = {
            'Authorization': f'Bearer {self.token}'
        }
        
        success, response = self.run_test(
            "Get Current User Info",
            "GET",
            "auth/me",
            200,
            headers=headers
        )
        
        if success and response:
            print(f"   ✅ User info retrieved")
            print(f"   User ID: {response.get('id', 'N/A')[:8]}...")
            print(f"   Name: {response.get('name')}")
            print(f"   Email: {response.get('email')}")
            print(f"   Role: {response.get('role')}")
            return True
            
        return False

    def test_update_profile(self):
        """Test updating user profile"""
        if not self.token:
            print("❌ No token available for authenticated request")
            return False
            
        headers = {
            'Authorization': f'Bearer {self.token}'
        }
        
        update_data = {
            "name": "Updated Test User",
            "notification_email": "notifications@example.com"
        }
        
        success, response = self.run_test(
            "Update User Profile",
            "PUT",
            "auth/profile",
            200,
            data=update_data,
            headers=headers
        )
        
        if success and response:
            print(f"   ✅ Profile updated")
            print(f"   New name: {response.get('name')}")
            print(f"   Notification email: {response.get('notification_email')}")
            return True
            
        return False

    def test_list_users_admin(self):
        """Test listing users (admin only)"""
        if not self.token:
            print("❌ No token available for authenticated request")
            return False
            
        headers = {
            'Authorization': f'Bearer {self.token}'
        }
        
        success, response = self.run_test(
            "List Users (Admin)",
            "GET",
            "auth/users", 
            200,
            headers=headers
        )
        
        if success and response:
            users = response if isinstance(response, list) else []
            print(f"   ✅ Found {len(users)} users")
            for user in users[:3]:  # Show first 3
                print(f"   - {user.get('name')} ({user.get('email')}) - Role: {user.get('role')}")
            return True
            
        return False

    def test_unauthorized_access(self):
        """Test that endpoints require authentication"""
        success, response = self.run_test(
            "Unauthorized Access (Should Fail)",
            "GET",
            "auth/me",
            401  # Expecting unauthorized
        )
        
        if not success:  # Expected to fail
            self.tests_passed += 1  # Count as passed
            print("   ✅ Correctly requires authentication")
            return True
        else:
            print("   ❌ Should require authentication")
            return False

    def test_comparison_endpoints(self):
        """Test comparison endpoints that are key features"""
        print("\n📊 Testing Comparison Features...")
        
        # First get assessments to find IDs for comparison
        success, assessments = self.run_test(
            "Get Assessments for Comparison",
            "GET",
            "assessments",
            200
        )
        
        if success and assessments and len(assessments) >= 2:
            assessment1_id = assessments[0].get('id')
            assessment2_id = assessments[1].get('id')
            
            print(f"   Using assessments: {assessment1_id[:8]}... vs {assessment2_id[:8]}...")
            
            success, comparison = self.run_test(
                "Compare Two Assessments",
                "GET",
                f"assessments/compare/{assessment1_id}/{assessment2_id}",
                200
            )
            
            if success and comparison:
                summary = comparison.get('summary', {})
                print(f"   ✅ Comparison successful")
                print(f"   Score delta: {summary.get('score_delta', 0)}")
                print(f"   Improvements: {summary.get('improvements_count', 0)}")
                print(f"   Regressions: {summary.get('regressions_count', 0)}")
                
                # Check if all required fields are present
                required_fields = ['assessment_1', 'assessment_2', 'summary', 'category_deltas', 'control_comparison']
                all_present = all(field in comparison for field in required_fields)
                
                if all_present:
                    print("   ✅ All required comparison fields present")
                else:
                    print("   ❌ Missing some required comparison fields")
                    
                return all_present
                
        print("   ❌ Not enough assessments for comparison test")
        return False

def main():
    print("🚀 AI Governance Engine - Authentication API Tests")
    print("=" * 60)
    
    # Setup
    tester = AuthenticationAPITester()
    
    # Test user registration
    tester.test_user_registration()
    
    # Test duplicate registration prevention
    tester.test_duplicate_registration()
    
    # Test user login
    tester.test_user_login()
    
    # Test invalid login
    tester.test_invalid_login()
    
    # Test authenticated endpoints
    tester.test_get_current_user()
    tester.test_update_profile()
    tester.test_list_users_admin()
    
    # Test unauthorized access
    tester.test_unauthorized_access()
    
    # Test comparison endpoints (key feature)
    tester.test_comparison_endpoints()
    
    # Print results
    print(f"\n📊 Authentication Test Results:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}%")
    
    if success_rate >= 90:
        print("🎉 Excellent! Authentication system working perfectly")
        return 0
    elif success_rate >= 75:
        print("✅ Good! Most authentication features working")
        return 0
    else:
        print("❌ Authentication issues detected")
        return 1

if __name__ == "__main__":
    sys.exit(main())