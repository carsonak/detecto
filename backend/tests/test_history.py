"""History and reset endpoint tests using an isolated temporary database."""

import pytest
from fastapi.testclient import TestClient

from main import app
from models import record


@pytest.fixture
def client(tmp_path, monkeypatch):
    """Provide a TestClient backed by a fresh throwaway database."""
    monkeypatch.setattr(record, "DB_PATH", str(tmp_path / "detecto.db"))
    with TestClient(app) as test_client:
        yield test_client


def test_reset_empty(client):
    """Verify /reset succeeds and reports zero deletions on an empty database."""
    response = client.post("/reset")
    assert response.status_code == 200
    assert response.json() == {"cleared": True, "count_deleted": 0}


def test_history_empty(client):
    """Verify /history returns an empty record list on a fresh database."""
    response = client.get("/history")
    assert response.status_code == 200
    assert response.json() == {"records": []}