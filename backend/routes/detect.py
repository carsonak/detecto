"""Detection routes for person inference (Developer 1)."""

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="", tags=["Detection"])


@router.post("/detect")
async def detect_persons():
    """Run person detection inference on an uploaded image.
    
    Stub endpoint reserved for Developer 1 implementation.
    """
    raise HTTPException(
        status_code=501,
        detail="Detection endpoint not yet implemented. Assigned to Developer 1.",
    )
