# Phase 2: End-to-End System Integration

## 1. Goal & Requirements

Integrate the Detection & Inference subsystem (Dev 1) with the History & Analytics subsystem (Dev 2) into a cohesive, production-ready system. This includes automatically logging detections upon inference, verifying end-to-end user flows, stress-testing edge cases, and ensuring full API proxying between Vite and FastAPI.

- **Gate Dependencies**: Blocked by Gate 2 (Feature Unit Verification on both Dev 1 and Dev 2).
- **Unblocks**: Gate 3 (End-to-End Integration Gate) & Phase 3 (Benchmarking).
- **Assigned Owners**: Joint (Dev 1 & Dev 2).

---

## 2. Technical Scope & Integration Flow

### 2.1 Backend Pipeline Integration
- Hook `POST /detect` to invoke the `insert_record(...)` helper in `backend/models/record.py`:
  - Automatically records timestamp, people count, average confidence, and inference latency immediately after successful YOLOv8 inference.
  - Ensures atomic logging without degrading inference response time.

### 2.2 Frontend End-to-End User Flow
- User uploads an image or clicks a sample in **Detection View**:
  - Image is sent to `/api/detect`.
  - Bounding boxes, count, confidence, and latency appear instantly.
- User navigates to **History View**:
  - Newly performed detection is immediately visible in the trend graph and the data table.
  - Applying confidence threshold slider filters the live data accurately.
  - Clicking "Clear History" purges all records and reflects immediately in an empty table state.

### 2.3 Edge Case & Resilience Verification
- **Empty File Upload**: Verify API returns HTTP 422 with a descriptive error message; verify frontend shows an error toast/banner without crashing.
- **Corrupted / Unsupported File (e.g. text file or random bytes)**: Verify API returns HTTP 400 Bad Request; verify frontend alerts the user cleanly.
- **Zero Persons in Frame (e.g. empty room)**: Verify API returns `count: 0`, empty detection array, and records event cleanly.
- **High Crowd Frame**: Verify system handles 10+ bounding boxes smoothly on the canvas without visual stutter or layout breakage.

---

## 3. Progress Tracking Checklist

- [x] Connect `backend/routes/detect.py` to auto-insert records into SQLite history table.
- [x] Verify full roundtrip: Detection View -> Backend inference -> SQLite insert -> History View query.
- [x] Test edge cases (unsupported file formats, zero persons, corrupt bytes, missing fields).
- [-] Run complete backend test suite (`pytest tests -v` within `backend/`). (Need virtualenv setup and pytest run from `backend/`).
- [-] Run complete frontend build (`npm run build`). (Need `npm install` and validation).
- [x] Verify Gate 3 entry criteria (end-to-end user flow connected in PR #1).

---

## 4. Plan Evolution, Deviations & Bug Tracker

| Date | Type | Description | Status | Resolution / Action |
|---|---|---|---|---|
| 2026-10-01 | Integration | Need to ensure database lock concurrency is handled gracefully if multiple detections occur in rapid succession. | Open | Use WAL mode in SQLite or thread-safe connection patterns. |
| 2026-10-03 | Build/Test | `requirements.txt` located in `backend/requirements.txt`; commands should run with working directory `backend/`. | Resolved | Aligned with user decision to keep requirements in `backend/`. |
