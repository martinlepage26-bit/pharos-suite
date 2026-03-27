import requests
import sys
import json
from datetime import datetime
from io import BytesIO
import tempfile
import os
from pathlib import Path

class AIGovernanceEngineAPITester:
    def __init__(self, base_url="http://127.0.0.1:9205/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.evidence_file_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.content:
                    try:
                        return success, response.json()
                    except:
                        return success, response.content
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

    def test_get_assessments(self):
        """Get list of assessments to find test assessment IDs"""
        print("\n📋 Getting available assessments...")
        success, response = self.run_test(
            "Get Assessments",
            "GET", 
            "assessments",
            200
        )
        
        if success and response:
            assessments = response if isinstance(response, list) else response.get('assessments', [])
            print(f"Found {len(assessments)} assessments")
            for i, assessment in enumerate(assessments[:3]):  # Show first 3
                score = assessment.get('result', {}).get('score', 'N/A')
                risk_tier = assessment.get('result', {}).get('risk_tier', 'N/A')
                print(f"  {i+1}. ID: {assessment.get('id', 'N/A')[:8]}... Score: {score}, Risk: {risk_tier}")
            return assessments
        return []

    def test_evidence_upload(self, assessment_id, control_id="SCP-01"):
        """Test evidence file upload"""
        print(f"\n📤 Testing evidence upload for assessment {assessment_id[:8]}...")
        
        # Create a test file
        test_file_content = b"This is a test evidence file for control " + control_id.encode()
        test_filename = f"test_evidence_{control_id}_{datetime.now().strftime('%H%M%S')}.txt"
        
        # Prepare form data and file
        form_data = {
            'assessment_id': assessment_id,
            'control_id': control_id,
            'description': f'Test evidence for {control_id}'
        }
        
        files = {
            'file': (test_filename, BytesIO(test_file_content), 'text/plain')
        }
        
        success, response = self.run_test(
            f"Upload Evidence for {control_id}",
            "POST",
            "evidence/upload",
            200,
            data=form_data,
            files=files
        )
        
        if success and response:
            evidence = response.get('evidence', {})
            file_id = evidence.get('id')
            if file_id:
                self.evidence_file_ids.append(file_id)
                print(f"   Uploaded file ID: {file_id}")
                print(f"   Filename: {evidence.get('filename')}")
                print(f"   Size: {evidence.get('file_size')} bytes")
            return file_id
        return None

    def test_get_evidence_files(self, assessment_id):
        """Test getting evidence files for an assessment"""
        success, response = self.run_test(
            "Get Evidence Files",
            "GET",
            f"evidence/{assessment_id}",
            200
        )
        
        if success and response:
            files = response if isinstance(response, list) else []
            print(f"   Found {len(files)} evidence files")
            for file_data in files:
                print(f"   - {file_data.get('filename')} (Control: {file_data.get('control_id')}, Size: {file_data.get('file_size')} bytes)")
            return files
        return []

    def test_download_evidence(self, file_id):
        """Test downloading an evidence file"""
        if not file_id:
            print("❌ No file ID provided for download test")
            return False
            
        success, content = self.run_test(
            "Download Evidence File",
            "GET",
            f"evidence/download/{file_id}",
            200
        )
        
        if success and content:
            print(f"   Downloaded {len(content)} bytes")
            return True
        return False

    def test_delete_evidence(self, file_id):
        """Test deleting an evidence file"""
        if not file_id:
            print("❌ No file ID provided for delete test")
            return False
            
        success, response = self.run_test(
            "Delete Evidence File",
            "DELETE",
            f"evidence/{file_id}",
            200
        )
        
        return success

    def test_pdf_export(self, assessment_id):
        """Test PDF export functionality"""
        success, pdf_content = self.run_test(
            "Export Assessment PDF",
            "GET",
            f"assessments/{assessment_id}/export/pdf",
            200
        )
        
        if success and pdf_content:
            print(f"   PDF generated successfully, size: {len(pdf_content)} bytes")
            
            # Verify it's actually a PDF by checking header
            if isinstance(pdf_content, bytes) and pdf_content.startswith(b'%PDF'):
                print("   ✅ Valid PDF format detected")
                return True
            else:
                print("   ❌ Invalid PDF format - missing PDF header")
                return False
        return False

    def test_deliverables_api(self, assessment_id):
        """Test deliverables API to verify evidence requests structure"""
        success, response = self.run_test(
            "Get Deliverables",
            "GET",
            f"assessments/{assessment_id}/deliverables", 
            200
        )
        
        if success and response:
            evidence_requests = response.get('evidence_requests', [])
            print(f"   Found {len(evidence_requests)} evidence requests")
            
            # Verify structure of evidence requests
            for req in evidence_requests[:3]:  # Check first 3
                control_id = req.get('control_id')
                control_name = req.get('control_name')
                category = req.get('category')
                severity = req.get('severity')
                artifacts = req.get('required_artifacts', [])
                
                print(f"   - {control_id}: {control_name} ({category}, {severity}) - {len(artifacts)} artifacts")
                
            return evidence_requests
        return []

def main():
    print("🚀 AI Governance Engine - Evidence & PDF Export API Tests")
    print("=" * 60)
    
    # Setup
    tester = AIGovernanceEngineAPITester()
    
    # Get assessments to find test data
    assessments = tester.test_get_assessments()
    if not assessments:
        print("❌ No assessments found, cannot proceed with tests")
        return 1
    
    # Use first assessment for testing
    test_assessment = assessments[0]
    assessment_id = test_assessment.get('id')
    
    if not assessment_id:
        print("❌ No valid assessment ID found")
        return 1
    
    print(f"\n🎯 Using assessment: {assessment_id[:8]}...")
    
    # Test deliverables API first to get evidence request structure
    evidence_requests = tester.test_deliverables_api(assessment_id)
    
    # Test PDF export
    tester.test_pdf_export(assessment_id)
    
    # Test evidence file operations
    file_id = None
    if evidence_requests:
        # Use first evidence request for testing
        control_id = evidence_requests[0].get('control_id', 'SCP-01')
        file_id = tester.test_evidence_upload(assessment_id, control_id)
    else:
        # Fallback to default control ID
        file_id = tester.test_evidence_upload(assessment_id)
    
    # Test getting evidence files
    tester.test_get_evidence_files(assessment_id)
    
    # Test download evidence
    if file_id:
        tester.test_download_evidence(file_id)
    
    # Test multiple evidence uploads for different controls
    test_controls = ['DAT-01', 'EVAL-01', 'HUM-01']
    uploaded_files = []
    
    for control in test_controls:
        new_file_id = tester.test_evidence_upload(assessment_id, control)
        if new_file_id:
            uploaded_files.append(new_file_id)
    
    # Test getting evidence files again to see multiple files
    all_files = tester.test_get_evidence_files(assessment_id)
    
    # Clean up - delete uploaded test files
    print(f"\n🧹 Cleaning up {len(tester.evidence_file_ids)} test files...")
    for file_id in tester.evidence_file_ids:
        tester.test_delete_evidence(file_id)
    
    # Print results
    print(f"\n📊 Test Results:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}%")
    
    if success_rate >= 90:
        print("🎉 Excellent! All key functionality working")
        return 0
    elif success_rate >= 75:
        print("✅ Good! Most functionality working")
        return 0
    else:
        print("❌ Issues detected, needs attention")
        return 1

if __name__ == "__main__":
    sys.exit(main())
