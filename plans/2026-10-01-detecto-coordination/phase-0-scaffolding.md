# Phase 0: Project Scaffolding & Dependency Setup

## 1. Goal & Requirements

Establish the complete repository structure, configuration files, and dependency manifests for both the FastAPI backend and the React/Vite frontend. The goal is to provide a fully bootable, testable skeleton with zero business logic so that both developers can immediately begin parallel implementation.

- **Gate Dependency**: Precedes Gate 0.
- **Passing Gate 0**: Server boots without error, placeholder unit tests pass, and frontend production build succeeds cleanly.
- **Assigned Owners**: Joint (Dev 1 & Dev 2).

---

## 2. Scaffolding Scope & File Manifest

### Backend Components
- `requirements.txt`: Python package specifications (`fastapi`, `uvicorn`, `ultralytics`, `opencv-python-headless`, `pydantic`, `python-multipart`, `pillow`, `pytest`, `httpx`).
- `backend/main.py`: FastAPI application entrypoint with CORS middleware and `/health` route.
- `backend/routes/detect.py`: Route stub returning HTTP 501.
- `backend/routes/history.py`: Route stub returning HTTP 501.
- `backend/models/record.py`: Pydantic / database model placeholder.
- `backend/utils/preprocessing.py`: Image preprocessing utility placeholder.
- `backend/tests/test_health.py`: Health check test asserting 200 OK.
- `backend/samples/.gitkeep`: Sample images directory placeholder.

### Frontend Components
- `frontend/package.json`: Frontend dependencies (React 18+, Vite, Lucide icons, Chart.js).
- `frontend/vite.config.js`: Vite server and `/api` proxy configuration.
- `frontend/index.html`: Web application HTML shell.
- `frontend/src/main.jsx`: React entrypoint.
- `frontend/src/index.css`: Baseline styling and layout resets.
- `frontend/src/App.jsx`: Top tab navigation switching between Detection View and History View.
- `frontend/src/pages/DetectionView.jsx`: Detection page placeholder.
- `frontend/src/pages/HistoryView.jsx`: History page placeholder.
- `frontend/src/components/BoundingBoxCanvas.jsx`: Canvas placeholder.
- `frontend/src/components/HistoryChart.jsx`: Chart placeholder.
- `frontend/public/samples/.gitkeep`: Public sample images directory placeholder.

---

## 3. Progress Tracking Checklist

- [x] Configure `.gitignore` with Python, Node, database, and cache exclusions.
- [x] Create root `plans/README.md` and multi-file coordination plans.
- [x] Codify commit-on-instruction and push-after-review standards in `AGENTS.md`.
- [x] Create `requirements.txt`.
- [x] Create backend directory skeleton (`main.py`, route stubs, model/util stubs, test stubs).
- [x] Create frontend directory skeleton (`package.json`, `vite.config.js`, `index.html`, `src/App.jsx`, page/component stubs).
- [x] Verify backend imports and health check tests pass.
- [x] Verify frontend installs and builds cleanly.
- [ ] Await review before committing or pushing.

---

## 4. Plan Evolution, Deviations & Bug Tracker

| Date | Type | Description | Status | Resolution / Action |
|---|---|---|---|---|
| 2026-10-01 | Architecture | Excluded business/inference logic from scaffolding phase to ensure clean baseline. | Resolved | Routes return 501 placeholders or minimal shell responses. |
