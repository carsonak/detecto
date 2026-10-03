"""History and persistence routes for detection records (Developer 2)."""

from typing import Optional

from fastapi import APIRouter, Query

from models.record import clear_records, query_records

router = APIRouter(prefix="", tags=["History"])


@router.get("/history")
async def get_history(
    limit: Optional[int] = Query(default=50, ge=1),
    min_confidence: Optional[float] = Query(default=None, ge=0.0, le=1.0),
    start_date: Optional[str] = Query(default=None),
    end_date: Optional[str] = Query(default=None),
) -> list[dict]:
    """Retrieve past detection records, newest first, with optional filters.

    Args:
        limit: Maximum number of records to return.
        min_confidence: Only return records at or above this avg confidence.
        start_date: Inclusive ISO 8601 lower bound on the timestamp.
        end_date: Inclusive ISO 8601 upper bound on the timestamp.

    Returns:
        List of matching detection record dictionaries.
    """
    records = query_records(
        limit=limit,
        min_confidence=min_confidence,
        start_date=start_date,
        end_date=end_date,
    )
    return records


@router.post("/reset")
async def reset_history() -> dict:
    """Clear all past detection records from storage.

    Returns:
        A payload with status success, message, cleared flag, and count_deleted.

    Side effect: deletes every row in the detections table.
    """
    count = clear_records()
    return {
        "status": "success",
        "message": "Detection history cleared successfully",
        "cleared": True,
        "count_deleted": count,
    }