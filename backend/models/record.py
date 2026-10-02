"""Data models and SQLite schema placeholders for detection history (Developer 2)."""

from typing import Optional
from pydantic import BaseModel


class DetectionRecordBase(BaseModel):
    """Base schema for detection log events."""
    timestamp: str
    people_count: int
    avg_confidence: float
    inference_time_ms: float
    image_name: Optional[str] = None


class DetectionRecord(DetectionRecordBase):
    """Full record schema including database ID."""
    id: int

    class Config:
        from_attributes = True


# Developer 2 will implement SQLite helper functions:
# - init_db()
# - insert_record(...)
# - query_records(...)
# - clear_records()
