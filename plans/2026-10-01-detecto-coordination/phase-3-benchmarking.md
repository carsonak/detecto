# Phase 3: 10-Image Benchmarking & Documentation

## 1. Goal & Requirements

Validate the complete `detecto` system against the 5 project evaluation targets defined in the project specification, using at least 10 realistic test frames stored in `frontend/public/samples/` and `backend/samples/`. Document all methodology, evaluation numbers, failure case analysis, architecture, and setup instructions in `README.md` alongside 2–3 UI screenshots.

- **Gate Dependencies**: Blocked by Gate 3 (End-to-End Integration Gate).
- **Unblocks**: Gate 4 (Evaluation & Final Acceptance).
- **Assigned Owners**: Joint (Dev 1 & Dev 2).

---

## 2. Evaluation Targets & Verification Formulas

| Metric | Target | Verification Formula / Measurement Method |
|---|---|---|
| **Detection Accuracy** | ≥ 85% | `(Correct detections ÷ Total visible persons) × 100%` across all 10 sample frames |
| **False Positives** | ≤ 10% | `(Non-person detections ÷ Total detections) × 100%` across all 10 sample frames |
| **Average Inference Time**| ≤ 1.5s | Mean processing time across all 10 test frames on local hardware |
| **Average Confidence** | ≥ 0.70 | Mean confidence score across all valid person detections |
| **System Reliability** | 100% | Process all 10+ test images sequentially without any unhandled exceptions or crashes |

---

## 3. Sample Dataset Curation & Ground Truth Table

The test suite will use 10 representative images showcasing diverse scenarios (single person, small groups, crowded spaces, partial occlusion, different lighting):

| Image Name | Description / Scenario | Ground Truth Visible Persons | Model Detections | Correct | False Positives |
|---|---|---|---|---|---|
| `frame1.jpg` | Single person walking towards entrance | 1 | TBD | TBD | TBD |
| `frame2.jpg` | Two people conversing in a hallway | 2 | TBD | TBD | TBD |
| `frame3.jpg` | Classroom with students seated | 5 | TBD | TBD | TBD |
| `frame4.jpg` | Warehouse worker in high-vis vest | 1 | TBD | TBD | TBD |
| `frame5.jpg` | Group of people at a reception desk | 4 | TBD | TBD | TBD |
| `frame6.jpg` | Person partially occluded by a doorway | 1 | TBD | TBD | TBD |
| `frame7.jpg` | Empty room / lobby (negative test) | 0 | TBD | TBD | TBD |
| `frame8.jpg` | Outdoor pedestrians in bright daylight | 3 | TBD | TBD | TBD |
| `frame9.jpg` | Low-light indoor corridor | 2 | TBD | TBD | TBD |
| `frame10.jpg`| Crowded cafeteria / gathering | 6 | TBD | TBD | TBD |

---

## 4. Documentation Requirements (`README.md`)

The final `README.md` must include:
1. **Project Title & Role Play Context**: Background as an automation and safety monitoring system.
2. **Architecture Diagram**: End-to-end dataflow between React, FastAPI, YOLOv8, and SQLite.
3. **Setup & Installation Instructions**: Clear instructions for both backend (`venv`, `pip install`, `uvicorn`) and frontend (`npm install`, `npm run dev`).
4. **Benchmark Results Table**: Real recorded numbers matching the 5 target metrics.
5. **Screenshots**: 2–3 screenshots showing:
   - Detection View with canvas bounding box overlays and metrics.
   - History View with trend chart and event table.
6. **Failure Analysis & Reflections**: Discussion of edge cases (occlusions, low contrast, dense crowds), what worked well, and future improvements (webcam support, heatmaps).

---

## 5. Progress Tracking Checklist

- [x] Place 10 sample images into `frontend/public/samples/` and `backend/samples/`.
- [x] Run benchmark evaluation script to process all 10 frames and capture metrics.
- [x] Populate the benchmark results table with actual recorded data.
- [ ] Capture 2–3 high-resolution UI screenshots.
- [x] Author comprehensive `README.md`.
- [-] Complete Gate 4 review (metrics recorded, UI screenshots & final remediation in progress).

---

## 6. Plan Evolution, Deviations & Bug Tracker

| Date | Type | Description | Status | Resolution / Action |
|---|---|---|---|---|
| 2026-10-01 | Planning | Negative test frame (`frame7.jpg` empty room) included to verify 0 false positives in empty scenes. | Resolved | Verified 0 false positives across all sample frames. |
| 2026-10-03 | Benchmark | `frame9.jpg` yielded 0 detections due to small scale / lighting. Documented as known limitation. | Resolved | Documented in README.md Section 6. |
| 2026-10-03 | Documentation | Setup commands in README.md need updating to reflect `cd backend` before running pip / uvicorn / pytest. | Open | Scheduled for update in remediation plan. |
