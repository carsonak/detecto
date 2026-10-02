"""Basic health and route registry tests for backend scaffold."""

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_health_check():
    """Verify /health endpoint returns 200 OK and expected status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "detecto-backend"}


def test_detect_stub_returns_501():
    """Verify /detect stub endpoint returns 501 Not Implemented."""
    response = client.post("/detect")
    assert response.status_code == 501


def test_history_stub_returns_501():
    """Verify /history stub endpoint returns 501 Not Implemented."""
    response = client.get("/history")
    assert response.status_code == 501


def test_reset_stub_returns_501():
    """Verify /reset stub endpoint returns 501 Not Implemented."""
    response = client.post("/reset")
    assert response.status_code == 501
