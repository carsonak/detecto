# Phase 1B: History, Analytics & Persistence (Developer 2)

## 1. Goal & Requirements

Developer 2 takes full-stack ownership of the **History, Analytics & Persistence** subsystem. This includes persisting detection events into a local SQLite database, supporting filtered query retrieval, providing a history purge mechanism, and displaying analytical time-series graphs and filterable data tables in the React frontend.

- **Gate Dependencies**: Blocked by Gate 0 (Scaffolding Complete) & Gate 1 (Contract Freeze).
- **Unblocks**: Gate 2 (Feature Unit Verification) & Phase 2 (Integration).
- **Assigned Owner**: Developer 2.

---

## 2. Technical Scope & Implementation Breakdown

### 2.1 Backend Implementation (`backend/`)
1. **SQLite Database Schema & Models (`backend/models/record.py`)**:
   - Table `detection_records`:
     - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
     - `timestamp`: TEXT NOT NULL (ISO 8601 string, e.g. `2026-10-01T15:30:00Z`)
     - `people_count`: INTEGER NOT NULL
     - `avg_confidence`: REAL NOT NULL
     - `inference_time_ms`: REAL NOT NULL
     - `image_name`: TEXT
   - Helper functions: `init_db()`, `insert_record(...)`, `query_records(...)`, `clear_records()`.
2. **History & Reset Endpoints (`backend/routes/history.py`)**:
   - `GET /history`:
     - Query parameters:
       - `limit`: int (default: 50, maximum: 500)
       - `min_confidence`: float (optional, e.g. `0.70`)
       - `start_date`: ISO 8601 string (optional)
       - `end_date`: ISO 8601 string (optional)
     - Returns ordered list of detection records (most recent first).
   - `POST /reset`:
     - Deletes all records from `detection_records`.
     - Returns `{ "status": "success", "message": "History cleared" }`.
3. **Automated Unit Tests (`backend/tests/test_history.py`)**:
   - Test inserting a record and retrieving it via `GET /history`.
   - Test query filtering by `min_confidence` and date boundaries.
   - Test `POST /reset` successfully purges records.

### 2.2 Frontend Implementation (`frontend/`)
1. **History View Interface (`frontend/src/pages/HistoryView.jsx`)**:
   - Clean, modern layout presenting analytics and detailed logs.
   - Filter bar:
     - Date/time range selector (`Start Date`, `End Date`).
     - Confidence threshold slider (`Min Confidence: 0% - 100%`).
     - "Apply Filters" and "Reset Filters" buttons.
   - "Clear History" button with confirmation modal to trigger `POST /api/reset`.
2. **Time-Series Trend Graph (`frontend/src/components/HistoryChart.jsx`)**:
   - Visual line or bar chart showing `Timestamp` on X-axis and `People Count` on Y-axis.
   - Hover tooltips showing exact timestamp, count, and confidence.
   - Smooth rendering using Chart.js or Recharts.
3. **Detection Event Log Table**:
   - Columns: ID, Date & Time, People Count, Average Confidence, Inference Time, Image Reference.
   - Empty state illustration when no records exist.
   - Pagination or scrollable view.

---

## 3. Progress Tracking Checklist

- [ ] Implement `backend/models/record.py` (SQLite schema, initialization, query functions).
- [ ] Implement `backend/routes/history.py` (`GET /history` with filters, `POST /reset`).
- [ ] Write backend unit tests in `backend/tests/test_history.py`.
- [ ] Implement `frontend/src/components/HistoryChart.jsx` (trend graph).
- [ ] Implement `frontend/src/pages/HistoryView.jsx` (filter bar, event table, reset modal).
- [ ] Verify history retrieval and reset via frontend UI.
- [ ] Verify test suite passes (`pytest backend/tests/test_history.py`).

---

## 4. Plan Evolution, Deviations & Bug Tracker

| Date | Type | Description | Status | Resolution / Action |
|---|---|---|---|---|
| 2026-10-01 | Architecture | Decided to use standard library `sqlite3` to avoid heavy ORM dependencies while keeping database file git-ignored. | Open | Validated in requirements. |
