"""
Backend API tests for PHAROS boundary and bookings behavior.

Coverage in this file:
- Publications: explicit fail-closed boundary assertions
- Bookings: GET, POST, PUT (status), DELETE, booked-slots

INTEGRATION TESTS — require a live server at REACT_APP_BACKEND_URL.
Not run in CI by default. Run with: pytest -m integration
"""
import pytest
import requests
import os
import uuid

pytestmark = pytest.mark.integration

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestHealth:
    """Health endpoint tests - run first"""
    
    def test_health_endpoint(self, api_client):
        """Verify API is running"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        print(f"✓ Health check passed: {data}")


class TestPublicationsBoundary:
    """Publication endpoints stay outside the PHAROS backend surface."""

    def test_get_publications_returns_410(self, api_client):
        """GET /api/publications is explicitly fail-closed."""
        response = api_client.get(f"{BASE_URL}/api/publications")
        assert response.status_code == 410
        assert "publication" in response.json().get("detail", "").lower()
        print("✓ GET /api/publications returns 410 boundary response")

    def test_post_publications_returns_410(self, api_client):
        """POST /api/publications is explicitly fail-closed."""
        response = api_client.post(f"{BASE_URL}/api/publications", json={"title": "TEST_Boundary"})
        assert response.status_code == 410
        print("✓ POST /api/publications returns 410 boundary response")

    def test_put_publications_returns_410(self, api_client):
        """PUT /api/publications/{id} is explicitly fail-closed."""
        response = api_client.put(f"{BASE_URL}/api/publications/nonexistent-id-123", json={"title": "test"})
        assert response.status_code == 410
        print("✓ PUT /api/publications/{id} returns 410 boundary response")

    def test_delete_publications_returns_410(self, api_client):
        """DELETE /api/publications/{id} is explicitly fail-closed."""
        response = api_client.delete(f"{BASE_URL}/api/publications/nonexistent-id-456")
        assert response.status_code == 410
        print("✓ DELETE /api/publications/{id} returns 410 boundary response")


class TestBookingsGet:
    """Bookings GET endpoints tests"""
    
    def test_get_bookings_returns_list(self, api_client):
        """GET /api/bookings returns list"""
        response = api_client.get(f"{BASE_URL}/api/bookings")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/bookings returned {len(data)} bookings")
    
    def test_get_booked_slots_returns_list(self, api_client):
        """GET /api/bookings/booked-slots returns date/time pairs"""
        response = api_client.get(f"{BASE_URL}/api/bookings/booked-slots")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/bookings/booked-slots returned {len(data)} slots")


class TestBookingsCRUD:
    """Bookings Create, Update Status, Delete tests"""
    
    def test_create_booking_success(self, api_client):
        """POST /api/bookings creates a new booking"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_User_{unique_id}",
            "email": f"test_{unique_id}@example.com",
            "organization": "Test Org",
            "date": "2026-02-15",
            "time": "10:00 AM",
            "topic": "AI Governance Foundation",
            "current_state": "Exploring options"
        }
        
        response = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["date"] == payload["date"]
        assert data["time"] == payload["time"]
        assert data["status"] == "pending"  # Default status
        assert "id" in data
        
        print(f"✓ Created booking: {data['id']}")
        return data["id"]
    
    def test_create_booking_and_verify_persistence(self, api_client):
        """Create booking and verify it persists via GET"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_Persist_{unique_id}",
            "email": f"persist_{unique_id}@test.com",
            "date": "2026-02-20",
            "time": "2:00 PM"
        }
        
        # Create
        create_res = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert create_res.status_code == 200
        booking_id = create_res.json()["id"]
        
        # Verify via GET
        get_res = api_client.get(f"{BASE_URL}/api/bookings")
        assert get_res.status_code == 200
        all_bookings = get_res.json()
        
        found = next((b for b in all_bookings if b["id"] == booking_id), None)
        assert found is not None, f"Booking {booking_id} not found after creation"
        assert found["name"] == payload["name"]
        
        print(f"✓ Booking {booking_id} persisted and verified")
    
    def test_update_booking_status_to_confirmed(self, api_client):
        """PUT /api/bookings/{id}/status updates status to confirmed"""
        # First create
        unique_id = str(uuid.uuid4())[:8]
        create_res = api_client.post(f"{BASE_URL}/api/bookings", json={
            "name": f"TEST_Confirm_{unique_id}",
            "email": f"confirm_{unique_id}@test.com",
            "date": "2026-03-01",
            "time": "11:00 AM"
        })
        assert create_res.status_code == 200
        booking_id = create_res.json()["id"]
        
        # Update status
        update_res = api_client.put(f"{BASE_URL}/api/bookings/{booking_id}/status", json={"status": "confirmed"})
        assert update_res.status_code == 200
        
        updated = update_res.json()
        assert updated["status"] == "confirmed"
        
        print(f"✓ Booking {booking_id} confirmed")
    
    def test_update_booking_status_to_cancelled(self, api_client):
        """PUT /api/bookings/{id}/status updates status to cancelled"""
        # First create
        unique_id = str(uuid.uuid4())[:8]
        create_res = api_client.post(f"{BASE_URL}/api/bookings", json={
            "name": f"TEST_Cancel_{unique_id}",
            "email": f"cancel_{unique_id}@test.com",
            "date": "2026-03-05",
            "time": "3:00 PM"
        })
        assert create_res.status_code == 200
        booking_id = create_res.json()["id"]
        
        # Update status
        update_res = api_client.put(f"{BASE_URL}/api/bookings/{booking_id}/status", json={"status": "cancelled"})
        assert update_res.status_code == 200
        
        updated = update_res.json()
        assert updated["status"] == "cancelled"
        
        print(f"✓ Booking {booking_id} cancelled")
    
    def test_update_booking_invalid_status_returns_400(self, api_client):
        """PUT /api/bookings/{id}/status returns 400 for invalid status"""
        # First create
        unique_id = str(uuid.uuid4())[:8]
        create_res = api_client.post(f"{BASE_URL}/api/bookings", json={
            "name": f"TEST_Invalid_{unique_id}",
            "email": f"invalid_{unique_id}@test.com",
            "date": "2026-03-10",
            "time": "4:00 PM"
        })
        assert create_res.status_code == 200
        booking_id = create_res.json()["id"]
        
        # Try invalid status
        update_res = api_client.put(f"{BASE_URL}/api/bookings/{booking_id}/status", json={"status": "invalid_status"})
        assert update_res.status_code == 400
        
        print("✓ Invalid status returns 400")
    
    def test_update_nonexistent_booking_returns_404(self, api_client):
        """PUT /api/bookings/{id}/status returns 404 for invalid ID"""
        response = api_client.put(f"{BASE_URL}/api/bookings/nonexistent-booking-123/status", json={"status": "confirmed"})
        assert response.status_code == 404
        print("✓ Update nonexistent booking returns 404")
    
    def test_delete_booking_success(self, api_client):
        """DELETE /api/bookings/{id} removes a booking"""
        # First create
        unique_id = str(uuid.uuid4())[:8]
        create_res = api_client.post(f"{BASE_URL}/api/bookings", json={
            "name": f"TEST_Delete_{unique_id}",
            "email": f"delete_{unique_id}@test.com",
            "date": "2026-03-15",
            "time": "9:00 AM"
        })
        assert create_res.status_code == 200
        booking_id = create_res.json()["id"]
        
        # Delete
        delete_res = api_client.delete(f"{BASE_URL}/api/bookings/{booking_id}")
        assert delete_res.status_code == 200
        assert delete_res.json().get("status") == "deleted"
        
        # Verify deletion
        get_res = api_client.get(f"{BASE_URL}/api/bookings")
        all_bookings = get_res.json()
        found = next((b for b in all_bookings if b["id"] == booking_id), None)
        assert found is None, f"Booking {booking_id} still exists after deletion"
        
        print(f"✓ Deleted booking {booking_id} and verified removal")
    
    def test_delete_nonexistent_booking_returns_404(self, api_client):
        """DELETE /api/bookings/{id} returns 404 for invalid ID"""
        response = api_client.delete(f"{BASE_URL}/api/bookings/nonexistent-booking-456")
        assert response.status_code == 404
        print("✓ Delete nonexistent booking returns 404")


class TestBookedSlots:
    """Booked-slots endpoint specific tests"""
    
    def test_booked_slots_excludes_cancelled(self, api_client):
        """GET /api/bookings/booked-slots excludes cancelled bookings"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Create and cancel a booking
        create_res = api_client.post(f"{BASE_URL}/api/bookings", json={
            "name": f"TEST_Slots_{unique_id}",
            "email": f"slots_{unique_id}@test.com",
            "date": "2026-04-01",
            "time": "10:30 AM"
        })
        assert create_res.status_code == 200
        booking_id = create_res.json()["id"]
        
        # Cancel it
        api_client.put(f"{BASE_URL}/api/bookings/{booking_id}/status", json={"status": "cancelled"})
        
        # Check booked-slots
        slots_res = api_client.get(f"{BASE_URL}/api/bookings/booked-slots")
        assert slots_res.status_code == 200
        slots = slots_res.json()
        
        # Cancelled booking should NOT appear in booked-slots
        found = next((s for s in slots if s.get("date") == "2026-04-01" and s.get("time") == "10:30 AM"), None)
        assert found is None, "Cancelled booking should not appear in booked-slots"
        
        print("✓ Booked-slots correctly excludes cancelled bookings")


# Cleanup fixtures
@pytest.fixture(scope="module", autouse=True)
def cleanup_test_data(api_client):
    """Cleanup TEST_ prefixed bookings after all tests"""
    yield

    # Cleanup bookings
    try:
        bookings_res = api_client.get(f"{BASE_URL}/api/bookings")
        if bookings_res.status_code == 200:
            for booking in bookings_res.json():
                if booking.get("name", "").startswith("TEST_"):
                    api_client.delete(f"{BASE_URL}/api/bookings/{booking['id']}")
    except:
        pass
    
    print("\n✓ Cleanup completed")
