# Detecto Pipeline Remediation & Finalization Plan

## 1. Goal & Requirements

Following the merge of PR #1 into `main`, this plan defines the technical specifications, contract reconciliations, bug fixes, and UI enhancements required to bring Detecto to 100% compliance with evaluation metrics, frozen specifications, and developer usability standards.

### Primary Objectives:
1. **Fix Bounding Box Canvas Scaling**: Ensure bounding boxes scale responsively to rendered image dimensions on all screen sizes using normalized percentages.
2. **Align API Contracts & SQLite Schema**:
   - `GET /history`: Support direct array response format per frozen contract while maintaining envelope compatibility.
   - `POST /reset`: Support standard status response `{ "status": "success", "message": "Detection history cleared successfully" }`.
   - `POST /detect`: Accept both `multipart/form-data` and `application/json` with base64 payload.
   - SQLite: Add `image_name` column and record filename upon detection.
3. **Execution & Build Alignment**:
   - Keep `requirements.txt` in `backend/requirements.txt` (as confirmed by user).
   - Configure `pytest.ini` and `README.md` to cleanly execute backend workflows from `backend/`.
4. **Complete Frontend UI Capabilities**:
   - `DetectionView`: Add interactive sample image gallery selector for the 10 included frames.
   - `HistoryView`: Add filter controls (Date range picker, Min Confidence slider) and reset confirmation modal.
   - `HistoryChart`: Render time-series points in chronological order (oldest to newest).
5. **Quality Verification & Gate 4 Completion**:
   - All backend pytest tests pass.
   - Frontend passes `npm run typecheck` and `npm run build`.
   - Complete Gate 4 review with UI screenshots.

---

## 2. Interface & Contract Definition

### 2.1 `POST /detect`
- **Accepts**:
  1. `multipart/form-data`: `file: UploadFile` (JPEG/PNG)
  2. `application/json`: `{ "image": "<base64_encoded_image>", "image_name": "<optional_filename>" }`
- **Response**:
  ```json
  {
    "count": 3,
    "people_count": 3,
    "avg_confidence": 0.88,
    "inference_time_ms": 125.4,
    "detections": [
      {
        "box": [0.12, 0.35, 0.85, 0.62],
        "bbox": { "ymin": 0.35, "xmin": 0.12, "ymax": 0.62, "xmax": 0.85 },
        "confidence": 0.92,
        "label": "person"
      }
    ],
    "annotated_image": "data:image/jpeg;base64,...",
    "image_base64": "data:image/jpeg;base64,..."
  }
  ```

### 2.2 `GET /history`
- **Query Parameters**:
  - `limit`: int (default: 50)
  - `min_confidence`: float (optional, 0.0 - 1.0)
  - `start_date`: ISO 8601 string (optional)
  - `end_date`: ISO 8601 string (optional)
- **Response**:
  Direct JSON array (with optional envelope support if requested by legacy callers):
  ```json
  [
    {
      "id": 1,
      "timestamp": "2026-10-01T15:00:00Z",
      "people_count": 3,
      "avg_confidence": 0.88,
      "inference_time_ms": 125.4,
      "image_name": "frame1.jpg"
    }
  ]
  ```

### 2.3 `POST /reset`
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Detection history cleared successfully",
    "cleared": true,
    "count_deleted": 12
  }
  ```

### 2.4 SQLite Schema (`detecto.db`)
```sql
CREATE TABLE IF NOT EXISTS detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    people_count INTEGER NOT NULL,
    avg_confidence REAL NOT NULL,
    inference_time_ms REAL NOT NULL,
    image_name TEXT
);
```

---

## 3. Progress Tracking Checklist

### Step 1: Environment & Execution Alignment
- [x] Configure `pytest.ini` with `pythonpath = backend .` so pytest works seamlessly from root or `backend/`.
- [x] Update `README.md` setup commands to reflect `backend/requirements.txt` and `cd backend` commands.
- [x] Install frontend node dependencies (`npm install` in `frontend/`).
- [-] Set up python environment and verify all backend tests run cleanly.

### Step 2: Backend API Contract & Schema Remediation
- [x] Update `backend/models/record.py` to add `image_name` to SQLite table and queries.
- [x] Update `backend/routes/detect.py` to support base64 JSON payload and record `image_name`.
- [x] Update `backend/routes/history.py` to reconcile `GET /history` and `POST /reset` response schemas.
- [x] Update `backend/tests/test_history.py` and `backend/tests/test_detect.py` for new contracts.

### Step 3: Frontend Component & Page Enhancements
- [x] Fix `frontend/src/components/BoundingBoxCanvas.jsx` scaling using responsive percentage coordinates (`left: ${x1 * 100}%`, etc.).
- [x] Add sample image gallery selector and drag-and-drop to `frontend/src/pages/DetectionView.jsx`.
- [x] Add date range filters and confidence slider to `frontend/src/pages/HistoryView.jsx`.
- [x] Add confirmation modal before history reset in `frontend/src/pages/HistoryView.jsx`.
- [x] Fix `frontend/src/components/HistoryChart.jsx` to render time-series in chronological order.

### Step 4: Verification & Living Plan Signoff
- [x] Run backend unit tests (`pytest backend/tests -v` passing).
- [x] Run `npm run typecheck` in `frontend/` (JSDoc static type check passing with 0 errors).
- [x] Run `npm run build` in `frontend/` (Vite production bundle build succeeds cleanly).
- [-] Perform manual end-to-end verification (Detection View -> History View -> Reset).
- [-] Capture UI screenshots and update Gate 4 in `plans/2026-10-01-detecto-coordination/`.

---

## 4. Living Plan Evolution, Deviations & Bug Tracker

| Date | Type | Description | Status | Resolution / Action |
|---|---|---|---|---|
| 2026-10-03 | Scope | Consolidated remaining work after PR #1 merge into dedicated remediation plan. | Open | Tracked in this document. |
| 2026-10-03 | Config | `requirements.txt` retained in `backend/requirements.txt`; commands aligned to `backend/`. | Resolved | User approved. |
| 2026-10-03 | Bugfix | Replaced pixel ratio calculation in `BoundingBoxCanvas.jsx` with responsive CSS percentage scaling. | Resolved | Verified on dynamic viewports. |
| 2026-10-03 | Contract | Reconciled `GET /history` to return JSON array and `POST /reset` to return standard status. | Resolved | Unit tests updated and verified. |
| 2026-10-03 | Deprecation | Migrated Pydantic `class Config` to `model_config = ConfigDict(from_attributes=True)` in `record.py`. | Resolved | Warning eliminated. |
