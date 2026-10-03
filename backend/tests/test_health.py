"""Health endpoint tests for the Detecto backend."""

import pytest
from fastapi.testclient import TestClient

from main import app
from models import record


@pytest.fixture
def client(tmp_path, monkeypatch):
    """Provide a TestClient bound to a throwaway database outside the repo."""
    monkeypatch.setattr(record, "DB_PATH", str(tmp_path / "detecto.db"))
    with TestClient(app) as test_client:
        yield test_client


def test_health_check(client):
    """Verify /health endpoint returns 200 OK and expected status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "detecto-backend"}