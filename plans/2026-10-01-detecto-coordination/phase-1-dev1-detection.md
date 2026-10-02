# Phase 1A: Detection & Inference Pipeline (Developer 1)

## 1. Goal & Requirements

Developer 1 takes full-stack ownership of the **Detection & Inference Pipeline**. This includes processing uploaded frames or selected samples, running the pretrained YOLOv8 person detection model, computing performance metrics, and dynamically rendering color-coded bounding boxes on a React canvas overlay.

- **Gate Dependencies**: Blocked by Gate 0 (Scaffolding Complete) & Gate 1 (Contract Freeze).
- **Unblocks**: Gate 2 (Feature Unit Verification) & Phase 2 (Integration).
- **Assigned Owner**: Developer 1.

---

## 2. Technical Scope & Implementation Breakdown

### 2.1 Backend Implementation (`backend/`)
1. **Image Preprocessing (`backend/utils/preprocessing.py`)**:
   - Validate uploaded bytes (ensure valid JPEG, PNG, or base64 data).
   - Convert byte stream / base64 string to OpenCV `numpy.ndarray` (BGR) or PIL Image.
   - Resize and contrast normalization helpers if necessary.
   - Return clean image dimensions `(height, width)`.
2. **YOLOv8 Person Inference (`backend/routes/detect.py`)**:
   - Initialize YOLOv8 Nano (`yolov8n.pt`) once upon server startup.
   - Filter predictions strictly to class index `0` (`person`).
   - Extract bounding box coordinates and normalize to `[ymin, xmin, ymax, xmax]` in range `[0.0, 1.0]`.
   - Compute:
     - Total detected person count (`count`).
     - Average confidence score across all valid person detections.
     - Exact inference latency in milliseconds (`inference_time_ms`).
   - Generate base64-encoded annotated image with overlaid boxes as fallback visual.
3. **Automated Unit Tests (`backend/tests/test_detect.py`)**:
   - Test image upload with valid sample image -> verify 200 OK and expected JSON schema.
   - Test invalid non-image file upload -> verify HTTP 400/422.
   - Test empty body -> verify HTTP 422.

### 2.2 Frontend Implementation (`frontend/`)
1. **Detection View Interface (`frontend/src/pages/DetectionView.jsx`)**:
   - Drag-and-drop file upload zone supporting JPEG and PNG.
   - Sample image gallery selector (allows selecting from `frontend/public/samples/`).
   - Action button to trigger detection request (`POST /api/detect`).
   - Loading indicator and user-friendly error banners.
2. **Bounding Box Canvas Overlay (`frontend/src/components/BoundingBoxCanvas.jsx`)**:
   - Render original image on an HTML5 `<canvas>` element.
   - Scale normalized bounding boxes dynamically to canvas dimensions.
   - Draw semi-transparent bounding boxes with distinct borders.
   - Render confidence label badges (e.g. `person 94%`) anchored to box corners.
3. **Performance & Statistics Cards**:
   - **People Count Badge**: Prominent display of detected count.
   - **Average Confidence**: Formatted percentage (e.g. `89.2%`).
   - **Inference Latency**: Formatted milliseconds (e.g. `124 ms`).

---

## 3. Progress Tracking Checklist

- [ ] Implement `backend/utils/preprocessing.py` (decoding, validation, dimensions).
- [ ] Implement `backend/routes/detect.py` (YOLOv8 loading, person filtering, latency measurement).
- [ ] Write backend unit tests in `backend/tests/test_detect.py`.
- [ ] Implement `frontend/src/components/BoundingBoxCanvas.jsx` (dynamic box rendering & scaling).
- [ ] Implement `frontend/src/pages/DetectionView.jsx` (file upload, sample selector, stats cards).
- [ ] Verify frontend and backend communicate via `/api/detect`.
- [ ] Verify test suite passes (`pytest backend/tests/test_detect.py`).

---

## 4. Plan Evolution, Deviations & Bug Tracker

| Date | Type | Description | Status | Resolution / Action |
|---|---|---|---|---|
| 2026-10-01 | Architecture | Normalized box coordinates `[ymin, xmin, ymax, xmax]` chosen to decouple frontend canvas dimensions from raw image pixels. | Open | Ensures responsive scaling across viewport sizes. |
