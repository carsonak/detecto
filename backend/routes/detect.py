import base64
import time
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from pydantic import BaseModel
try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

from models.record import insert_record
from utils.preprocessing import (
    decode_image,
    draw_boxes,
    encode_image_base64,
)

router = APIRouter(prefix="", tags=["Detection"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
CONFIDENCE_THRESHOLD = 0.4
PERSON_CLASS_ID = 0

_model: Optional[object] = None


def get_model():
    """Return the process-wide YOLO model, loading weights on first use.

    Side effect: downloads ``yolov8n.pt`` into the working directory the first
    time this is called, then caches the instance in a module global.
    """
    global _model
    if YOLO is None:
        raise RuntimeError("ultralytics is not installed in the current environment")
    if _model is None:
        _model = YOLO("yolov8n.pt")
    return _model


class BoundingBox(BaseModel):
    """Normalized rectangle in the plan contract's named-key form."""

    ymin: float
    xmin: float
    ymax: float
    xmax: float


class Detection(BaseModel):
    """A single person detection.

    ``box`` is normalized ``[x1, y1, x2, y2]``; ``bbox`` is the same rectangle
    as named keys per the frozen plan contract (overview.md 4.1).
    """

    box: list[float]
    bbox: BoundingBox
    label: str = "person"
    confidence: float


class DetectionResponse(BaseModel):
    """Result payload returned by ``POST /detect``.

    ``count``/``annotated_image`` alias ``people_count``/``image_base64`` so the
    frozen plan contract (overview.md 4.1) and the original field names coexist.
    """

    people_count: int
    count: int
    detections: list[Detection]
    avg_confidence: float
    inference_time_ms: float
    image_base64: str
    annotated_image: str


@router.post("/detect", response_model=DetectionResponse)
async def detect_persons(
    request: Request,
    file: Optional[UploadFile] = File(default=None),
) -> DetectionResponse:
    """Run person detection on an uploaded image or base64 payload and record the result.

    Accepts either multipart/form-data upload or JSON payload with base64 encoded image.

    Args:
        request: FastAPI request object.
        file: Optional uploaded JPEG or PNG image file.

    Returns:
        Counts, normalized boxes, mean confidence, latency, and an annotated
        preview image.

    Raises:
        HTTPException: 422 if no image payload is provided.
        HTTPException: 400 for an unsupported content type or undecodable image.
    """
    image_name: Optional[str] = None
    payload: bytes = b""

    content_type = request.headers.get("content-type", "")

    if file is not None and file.filename:
        if file.content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported content type: {file.content_type}. Allowed: image/jpeg, image/png",
            )
        payload = await file.read()
        image_name = file.filename
        if not payload:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")
    elif "application/json" in content_type:
        try:
            body = await request.json()
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {exc}") from exc

        if not isinstance(body, dict) or "image" not in body or not body["image"]:
            raise HTTPException(status_code=422, detail="Field 'image' is required in JSON payload")

        image_data = body["image"]
        image_name = body.get("image_name")
        if "," in image_data and "base64" in image_data:
            image_data = image_data.split(",", 1)[1]

        try:
            payload = base64.b64decode(image_data)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Invalid base64 encoding: {exc}") from exc
    else:
        # No file and not JSON -> unprocessable
        raise HTTPException(
            status_code=422,
            detail="Missing image data. Submit either multipart file upload or JSON with 'image' base64 string.",
        )

    try:
        image = decode_image(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    model = get_model()
    started = time.perf_counter()
    results = model(image, conf=CONFIDENCE_THRESHOLD, classes=[PERSON_CLASS_ID], verbose=False)
    inference_time_ms = (time.perf_counter() - started) * 1000.0

    height, width = image.shape[:2]
    detections: list[Detection] = []

    for result in results:
        boxes = getattr(result, "boxes", None)
        if boxes is None or len(boxes.xyxy) == 0:
            continue
        for box, confidence in zip(boxes.xyxy.tolist(), boxes.conf.tolist()):
            x1, y1, x2, y2 = box
            # Clamp to [0, 1] since xyxy can exceed image bounds.
            normalized_xyxy = [
                min(max(x1 / width, 0.0), 1.0),
                min(max(y1 / height, 0.0), 1.0),
                min(max(x2 / width, 0.0), 1.0),
                min(max(y2 / height, 0.0), 1.0),
            ]
            detections.append(
                Detection(
                    box=normalized_xyxy,
                    bbox=BoundingBox(
                        ymin=normalized_xyxy[1],
                        xmin=normalized_xyxy[0],
                        ymax=normalized_xyxy[3],
                        xmax=normalized_xyxy[2],
                    ),
                    confidence=float(confidence),
                )
            )

    avg_confidence = (
        sum(d.confidence for d in detections) / len(detections) if detections else 0.0
    )
    image_base64 = encode_image_base64(draw_boxes(image, detections))

    insert_record(
        timestamp=datetime.now(timezone.utc).isoformat(),
        people_count=len(detections),
        avg_confidence=avg_confidence,
        inference_time_ms=inference_time_ms,
        image_name=image_name,
    )

    return DetectionResponse(
        people_count=len(detections),
        count=len(detections),
        detections=detections,
        avg_confidence=avg_confidence,
        inference_time_ms=inference_time_ms,
        image_base64=image_base64,
        annotated_image=image_base64,
    )