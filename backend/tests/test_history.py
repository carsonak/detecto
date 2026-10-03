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
    payload = response.json()
    assert payload["status"] == "success"
    assert payload["cleared"] is True
    assert payload["count_deleted"] == 0


def test_history_empty(client):
    """Verify /history returns an empty record list on a fresh database."""
    response = client.get("/history")
    assert response.status_code == 200
    assert response.json() == []


def test_history_insert_and_query(client):
    """Verify inserted detection records are returned with image_name."""
    record.insert_record(
        timestamp="2026-10-01T12:00:00Z",
        people_count=3,
        avg_confidence=0.85,
        inference_time_ms=90.0,
        image_name="test_frame.jpg",
    )
    response = client.get("/history")
    assert response.status_code == 200
    rows = response.json()
    assert len(rows) == 1
    assert rows[0]["people_count"] == 3
    assert rows[0]["avg_confidence"] == 0.85
    assert rows[0]["image_name"] == "test_frame.jpg"

    # Test filtering by min_confidence
    filtered = client.get("/history?min_confidence=0.90").json()
    assert len(filtered) == 0

    filtered_hit = client.get("/history?min_confidence=0.80").json()
    assert len(filtered_hit) == 1