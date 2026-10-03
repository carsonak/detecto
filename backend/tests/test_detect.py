"""Detection endpoint tests; inference tests skip when the model is unavailable."""

import importlib.util
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

try:
    from main import app
    from models import record

    BACKEND_IMPORT_ERROR = None
except ImportError as exc:  # ultralytics is a heavy optional dependency
    app = None
    record = None
    BACKEND_IMPORT_ERROR = str(exc)

requires_backend = pytest.mark.skipif(
    app is None, reason=f"backend dependencies unavailable: {BACKEND_IMPORT_ERROR}"
)

REPO_ROOT = Path(__file__).resolve().parents[2]
SAMPLE_FRAME = REPO_ROOT / "backend" / "samples" / "frame1.jpg"


@pytest.fixture
def client(tmp_path, monkeypatch):
    """Provide a TestClient backed by a fresh throwaway database."""
    monkeypatch.setattr(record, "DB_PATH", str(tmp_path / "detecto.db"))
    with TestClient(app) as test_client:
        yield test_client


@requires_backend
def test_detect_missing_file(client):
    """Verify /detect rejects a request with no uploaded file."""
    response = client.post("/detect")
    assert response.status_code == 422


@requires_backend
def test_detect_bad_type(client):
    """Verify /detect rejects a non-image upload with 400."""
    response = client.post(
        "/detect",
        files={"file": ("notes.txt", b"not an image", "text/plain")},
    )
    assert response.status_code == 400


@requires_backend
@pytest.mark.skipif(
    importlib.util.find_spec("ultralytics") is None,
    reason="ultralytics not installed",
)
@pytest.mark.skipif(not SAMPLE_FRAME.exists(), reason=f"missing sample image: {SAMPLE_FRAME}")
def test_detect_valid(client):
    """Verify /detect runs real inference and returns the documented payload."""
    with SAMPLE_FRAME.open("rb") as frame:
        response = client.post(
            "/detect",
            files={"file": (SAMPLE_FRAME.name, frame.read(), "image/jpeg")},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["people_count"] >= 0
    assert isinstance(payload["detections"], list)
    assert isinstance(payload["avg_confidence"], float)
    assert payload["inference_time_ms"] > 0