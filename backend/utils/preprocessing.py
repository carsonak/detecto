"""Image preprocessing, decoding, and annotation utilities (Developer 1)."""

import base64
from typing import Any, Sequence

import cv2
import numpy as np

BASE64_PREFIX = "data:image/jpeg;base64,"


def decode_image(data: bytes) -> np.ndarray:
    """Decode raw bytes into a BGR image array.

    Args:
        data: Encoded image bytes (JPEG, PNG, ...).

    Returns:
        The decoded image as an ``np.ndarray`` in BGR channel order.

    Raises:
        ValueError: If the bytes cannot be decoded as an image.
    """
    buffer = np.frombuffer(data, dtype=np.uint8)
    image = cv2.imdecode(buffer, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Unsupported or corrupted image data")
    return image


def preprocess_frame(img: np.ndarray, size: int = 640) -> np.ndarray:
    """Resize a frame to the model input size.

    Args:
        img: Source BGR image.
        size: Target edge length in pixels.

    Returns:
        The resized BGR image; YOLO handles normalization internally.
    """
    return cv2.resize(img, (size, size), interpolation=cv2.INTER_LINEAR)


def encode_image_base64(img: np.ndarray) -> str:
    """Encode a BGR image as a base64 data URI.

    Args:
        img: Image to encode.

    Returns:
        A JPEG data URI prefixed with ``data:image/jpeg;base64,``.
    """
    success, encoded = cv2.imencode(".jpg", img)
    if not success:
        raise ValueError("Failed to encode image as JPEG")
    return BASE64_PREFIX + base64.b64encode(encoded.tobytes()).decode("utf-8")


def draw_boxes(img: np.ndarray, detections: Sequence[Any]) -> np.ndarray:
    """Draw red person rectangles with confidence labels onto a copy of the image.

    Args:
        img: Source BGR image.
        detections: Pydantic detection objects exposing ``box`` (normalized
            ``[x1, y1, x2, y2]``) and ``confidence``.

    Returns:
        A new annotated image; the input array is left untouched.
    """
    annotated = img.copy()
    height, width = annotated.shape[:2]

    for detection in detections:
        x1, y1, x2, y2 = detection.box
        left = int(max(0.0, min(1.0, x1)) * width)
        top = int(max(0.0, min(1.0, y1)) * height)
        right = int(max(0.0, min(1.0, x2)) * width)
        bottom = int(max(0.0, min(1.0, y2)) * height)

        cv2.rectangle(annotated, (left, top), (right, bottom), (0, 0, 255), 2)
        label = f"person {detection.confidence:.2f}"
        # Flip label above the box when the box touches the top edge.
        baseline = top - 6 if top - 6 > 14 else bottom + 18
        cv2.putText(
            annotated,
            label,
            (left, baseline),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 0, 255),
            2,
        )

    return annotated