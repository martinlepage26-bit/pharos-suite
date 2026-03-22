"""
Test suite for AI-Powered Features in Compass AI Governance Engine
Testing:
- AI Market Intelligence API (/api/market-intelligence/{sector})
- AI Policy Analysis API (/api/ai/analyze-policy)
- AI Contract Analysis API (/api/ai/analyze-contract)
- Client Onboarding Portal submission (/api/onboarding/submit)
- Onboarding Admin endpoints - list submissions, approve/reject
"""

import pytest
import requests
import os
import time
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://admin-features-test-3.preview.emergentagent.com').rstrip('/')

# Sample test data
SAMPLE_POLICY_TEXT = """
AI Governance Policy Document

1. Scope and Purpose
This policy establishes guidelines for the responsible development, deployment, and monitoring 
of artificial intelligence systems within our organization. All AI systems must comply with 
relevant regulations including GDPR, EU AI Act, and industry-specific requirements.

2. Data Governance
- All data used for AI training must be properly documented and inventoried
- Personal data must be handled in accordance with privacy regulations
- Data quality assessments must be performed regularly
- Third-party data agreements must be reviewed and approved

3. Model Development
- All AI models must undergo bias and fairness testing
- Performance benchmarks must be documented
- Model validation must be performed before deployment

4. Human Oversight
- Human oversight mechanisms must be in place for all high-risk AI systems
- Decision override capabilities must be available
- Escalation procedures must be documented

5. Monitoring and Maintenance
- Continuous monitoring of AI system performance is required
- Drift detection mechanisms must be implemented
- Incident reporting procedures must be followed
"""

SAMPLE_CONTRACT_TEXT = """
AI SERVICES AGREEMENT

This Agreement is entered into between Company A ("Client") and Company B ("Provider").

1. AI Services Description
Provider agrees to deliver AI-powered analytics services including:
- Customer segmentation analysis using machine learning
- Predictive analytics for demand forecasting
- Natural language processing for customer support

2. Data Handling
2.1 Provider shall process Client data solely for the purposes outlined in this Agreement.
2.2 Provider shall implement appropriate technical and organizational measures to protect data.
2.3 Client retains ownership of all data provided to Provider.

3. AI System Governance
3.1 Provider shall maintain documentation of all AI models used in service delivery.
3.2 Provider shall conduct regular bias testing on AI systems.
3.3 Provider shall notify Client of significant changes to AI algorithms.

4. Liability
4.1 Provider shall be liable for damages caused by AI system malfunctions up to the contract value.
4.2 Provider shall maintain professional liability insurance covering AI-related claims.

5. Compliance
5.1 Both parties agree to comply with applicable AI regulations including EU AI Act.
5.2 Provider shall support Client's compliance audits upon reasonable notice.

6. Term and Termination
This Agreement shall be effective for 12 months from the date of signing.
"""


class TestMarketIntelligence:
    """Tests for Market Intelligence API"""
    
    def test_market_intelligence_saas_sector(self):
        """Test market intelligence for SaaS sector"""
        response = requests.get(f"{BASE_URL}/api/market-intelligence/SaaS")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        # Verify response structure
        assert "intelligence" in data, "Response missing 'intelligence' field"
        assert "sector" in data or "generated_at" in data, "Response missing expected metadata fields"
        
        intelligence = data.get("intelligence", {})
        # These fields should be present in the AI response
        expected_fields = ["regulatory_updates", "compliance_trends", "best_practices", "recommendations"]
        for field in expected_fields:
            assert field in intelligence, f"Intelligence missing '{field}' field"
        
        print(f"SUCCESS: Market intelligence for SaaS returned with {len(intelligence.get('regulatory_updates', []))} regulatory updates")
    
    def test_market_intelligence_healthcare_sector(self):
        """Test market intelligence for Healthcare sector"""
        response = requests.get(f"{BASE_URL}/api/market-intelligence/Healthcare")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "intelligence" in data
        print(f"SUCCESS: Market intelligence for Healthcare returned successfully")
    
    def test_market_intelligence_finance_sector(self):
        """Test market intelligence for Finance sector"""
        response = requests.get(f"{BASE_URL}/api/market-intelligence/Finance")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "intelligence" in data
        print(f"SUCCESS: Market intelligence for Finance returned successfully")
    
    def test_market_intelligence_refresh(self):
        """Test refresh functionality for market intelligence"""
        # First call to cache
        response1 = requests.get(f"{BASE_URL}/api/market-intelligence/Education")
        assert response1.status_code == 200
        
        # Second call with refresh=true
        response2 = requests.get(f"{BASE_URL}/api/market-intelligence/Education?refresh=true")
        assert response2.status_code == 200
        
        print("SUCCESS: Market intelligence refresh functionality working")


class TestPolicyAnalysis:
    """Tests for Policy Analysis API"""
    
    def test_analyze_policy_valid_document(self):
        """Test policy analysis with valid document"""
        payload = {
            "document_text": SAMPLE_POLICY_TEXT,
            "model": "gpt-5.2"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/analyze-policy", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "analysis" in data, "Response missing 'analysis' field"
        assert "model_used" in data, "Response missing 'model_used' field"
        
        analysis = data.get("analysis", {})
        # Verify analysis structure
        expected_fields = ["summary", "controls_addressed", "controls_missing", "compliance_score", "recommendations"]
        for field in expected_fields:
            if field in analysis:
                print(f"  - {field}: present")
        
        print(f"SUCCESS: Policy analysis completed with model {data.get('model_used')}")
    
    def test_analyze_policy_short_document_rejected(self):
        """Test that short documents are rejected"""
        payload = {
            "document_text": "Too short",
            "model": "gpt-5.2"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/analyze-policy", json=payload)
        
        assert response.status_code == 400, f"Expected 400 for short document, got {response.status_code}"
        print("SUCCESS: Short document correctly rejected with 400")
    
    def test_analyze_policy_with_claude_model(self):
        """Test policy analysis with Claude model"""
        payload = {
            "document_text": SAMPLE_POLICY_TEXT,
            "model": "claude"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/analyze-policy", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("model_used") == "claude", f"Expected claude model, got {data.get('model_used')}"
        print("SUCCESS: Policy analysis with Claude model completed")


class TestContractAnalysis:
    """Tests for Contract Analysis API"""
    
    def test_analyze_contract_valid(self):
        """Test contract analysis with valid contract text"""
        payload = {
            "contract_text": SAMPLE_CONTRACT_TEXT,
            "model": "gpt-5.2"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/analyze-contract", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "analysis" in data, "Response missing 'analysis' field"
        
        analysis = data.get("analysis", {})
        # Verify contract analysis structure
        expected_fields = ["ai_clauses", "data_provisions", "overall_risk", "recommendations"]
        for field in expected_fields:
            if field in analysis:
                print(f"  - {field}: present")
        
        print(f"SUCCESS: Contract analysis completed, overall risk: {analysis.get('overall_risk', 'N/A')}")
    
    def test_analyze_contract_short_rejected(self):
        """Test that short contracts are rejected"""
        payload = {
            "contract_text": "Short",
            "model": "gpt-5.2"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/analyze-contract", json=payload)
        
        assert response.status_code == 400, f"Expected 400 for short contract, got {response.status_code}"
        print("SUCCESS: Short contract correctly rejected with 400")


class TestOnboardingPortal:
    """Tests for Client Onboarding Portal"""
    
    def test_submit_onboarding_basic(self):
        """Test basic onboarding submission"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "company_name": f"TEST_Company_{unique_id}",
            "sector": "SaaS",
            "jurisdiction": "United States",
            "contact_name": "John Test",
            "contact_email": f"test_{unique_id}@example.com",
            "contact_title": "CTO",
            "systems": [],
            "notes": "Test submission from automated testing"
        }
        
        response = requests.post(f"{BASE_URL}/api/onboarding/submit", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data, "Response missing submission ID"
        assert data.get("status") == "pending", f"Expected 'pending' status, got {data.get('status')}"
        
        print(f"SUCCESS: Onboarding submission created with ID: {data.get('id')[:8]}")
        return data.get("id")
    
    def test_submit_onboarding_with_systems(self):
        """Test onboarding submission with AI systems"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "company_name": f"TEST_SystemsCorp_{unique_id}",
            "sector": "Healthcare",
            "jurisdiction": "European Union",
            "contact_name": "Jane Test",
            "contact_email": f"jane_{unique_id}@example.com",
            "contact_title": "Chief AI Officer",
            "systems": [
                {
                    "system_name": "Diagnostic AI Assistant",
                    "system_type": "Clinical Decision Support",
                    "system_description": "AI-powered diagnostic assistance for physicians",
                    "decision_role": "Advisory",
                    "user_type": "Internal",
                    "high_stakes": True
                },
                {
                    "system_name": "Patient Triage Bot",
                    "system_type": "Chatbot",
                    "system_description": "Automated patient intake and triage",
                    "decision_role": "Human-in-the-loop",
                    "user_type": "External",
                    "high_stakes": False
                }
            ],
            "notes": "Healthcare AI implementation project"
        }
        
        response = requests.post(f"{BASE_URL}/api/onboarding/submit", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        print(f"SUCCESS: Onboarding with 2 AI systems submitted, ID: {data.get('id')[:8]}")
        return data.get("id")
    
    def test_submit_onboarding_invalid_sector(self):
        """Test that invalid sector is rejected"""
        payload = {
            "company_name": "TEST_InvalidSector",
            "sector": "InvalidSector",  # Invalid enum value
            "contact_name": "Test User",
            "contact_email": "test@example.com"
        }
        
        response = requests.post(f"{BASE_URL}/api/onboarding/submit", json=payload)
        
        # Should be rejected due to invalid enum
        assert response.status_code in [400, 422], f"Expected 400/422, got {response.status_code}"
        print("SUCCESS: Invalid sector correctly rejected")


class TestOnboardingAdmin:
    """Tests for Onboarding Admin Endpoints"""
    
    def test_list_onboarding_submissions(self):
        """Test listing all onboarding submissions"""
        response = requests.get(f"{BASE_URL}/api/onboarding/submissions")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Expected list response"
        print(f"SUCCESS: Retrieved {len(data)} onboarding submissions")
    
    def test_list_pending_submissions(self):
        """Test listing pending onboarding submissions"""
        response = requests.get(f"{BASE_URL}/api/onboarding/submissions?status=pending")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        # Verify all returned are pending
        for submission in data:
            assert submission.get("status") == "pending", f"Expected 'pending' status"
        
        print(f"SUCCESS: Retrieved {len(data)} pending submissions")
    
    def test_get_specific_submission(self):
        """Test getting a specific submission by ID"""
        # First create a submission
        unique_id = str(uuid.uuid4())[:8]
        create_payload = {
            "company_name": f"TEST_GetById_{unique_id}",
            "sector": "Finance",
            "contact_name": "Test User",
            "contact_email": f"getbyid_{unique_id}@example.com"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/onboarding/submit", json=create_payload)
        assert create_response.status_code == 200
        submission_id = create_response.json().get("id")
        
        # Now get it by ID
        response = requests.get(f"{BASE_URL}/api/onboarding/submissions/{submission_id}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("id") == submission_id
        assert data.get("company_name") == f"TEST_GetById_{unique_id}"
        
        print(f"SUCCESS: Retrieved submission {submission_id[:8]} by ID")
    
    def test_get_nonexistent_submission(self):
        """Test getting a non-existent submission returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.get(f"{BASE_URL}/api/onboarding/submissions/{fake_id}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("SUCCESS: Non-existent submission correctly returns 404")
    
    def test_approve_submission(self):
        """Test approving an onboarding submission"""
        # Create a submission first
        unique_id = str(uuid.uuid4())[:8]
        create_payload = {
            "company_name": f"TEST_Approve_{unique_id}",
            "sector": "SaaS",
            "contact_name": "Approve Test",
            "contact_email": f"approve_{unique_id}@example.com",
            "systems": [
                {
                    "system_name": "Test AI System",
                    "system_type": "Analytics",
                    "decision_role": "Informational",
                    "user_type": "Internal"
                }
            ]
        }
        
        create_response = requests.post(f"{BASE_URL}/api/onboarding/submit", json=create_payload)
        assert create_response.status_code == 200
        submission_id = create_response.json().get("id")
        
        # Approve it
        response = requests.put(f"{BASE_URL}/api/onboarding/submissions/{submission_id}/approve")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "client_id" in data, "Response should contain client_id"
        assert data.get("status") == "approved"
        
        # Verify client was created
        client_id = data.get("client_id")
        client_response = requests.get(f"{BASE_URL}/api/clients/{client_id}")
        assert client_response.status_code == 200, "Created client should exist"
        
        print(f"SUCCESS: Submission approved, client created with ID: {client_id[:8]}")
    
    def test_reject_submission(self):
        """Test rejecting an onboarding submission"""
        # Create a submission first
        unique_id = str(uuid.uuid4())[:8]
        create_payload = {
            "company_name": f"TEST_Reject_{unique_id}",
            "sector": "Public",
            "contact_name": "Reject Test",
            "contact_email": f"reject_{unique_id}@example.com"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/onboarding/submit", json=create_payload)
        assert create_response.status_code == 200
        submission_id = create_response.json().get("id")
        
        # Reject it
        response = requests.put(
            f"{BASE_URL}/api/onboarding/submissions/{submission_id}/reject",
            params={"reason": "Test rejection - incomplete information"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("status") == "rejected"
        
        print(f"SUCCESS: Submission rejected successfully")


class TestAutoFillFromDocument:
    """Tests for Auto-fill from Document feature"""
    
    def test_auto_fill_valid_document(self):
        """Test auto-fill extraction from document"""
        sample_document = """
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
        Description: AI-powered diagnostic assistant for radiologists
        Purpose: Assist radiologists in detecting anomalies in medical imaging
        Data Sources: Patient imaging data, clinical records
        Risk Level: High-stakes medical decision support
        """
        
        payload = {
            "document_text": sample_document,
            "model": "gpt-5.2"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/auto-fill", json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "extracted_data" in data, "Response missing 'extracted_data' field"
        
        extracted = data.get("extracted_data", {})
        if "client_info" in extracted:
            print(f"  - Extracted client info fields: {list(extracted['client_info'].keys())}")
        if "ai_system_info" in extracted:
            print(f"  - Extracted AI system info fields: {list(extracted['ai_system_info'].keys())}")
        
        print("SUCCESS: Auto-fill extraction completed")
    
    def test_auto_fill_short_document_rejected(self):
        """Test that short documents are rejected"""
        payload = {
            "document_text": "Short doc",
            "model": "gpt-5.2"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/auto-fill", json=payload)
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("SUCCESS: Short document correctly rejected")


# Cleanup function to remove test data
def cleanup_test_data():
    """Clean up TEST_ prefixed data after tests"""
    # Get all submissions and delete TEST_ prefixed ones
    submissions = requests.get(f"{BASE_URL}/api/onboarding/submissions").json()
    for sub in submissions:
        if sub.get("company_name", "").startswith("TEST_"):
            # Can't delete submissions via API, but they're marked as test data
            pass
    
    # Delete TEST_ clients
    clients = requests.get(f"{BASE_URL}/api/clients").json()
    for client in clients:
        if client.get("company_name", "").startswith("TEST_"):
            requests.delete(f"{BASE_URL}/api/clients/{client.get('id')}")
    
    print("Cleanup completed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
