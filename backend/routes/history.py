"""History and persistence routes for detection records (Developer 2)."""

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="", tags=["History"])


@router.get("/history")
async def get_history():
    """Retrieve past detection records with optional filters.
    
    Stub endpoint reserved for Developer 2 implementation.
    """
    raise HTTPException(
        status_code=501,
        detail="History endpoint not yet implemented. Assigned to Developer 2.",
    )


@router.post("/reset")
async def reset_history():
    """Clear all past detection records from storage.
    
    Stub endpoint reserved for Developer 2 implementation.
    """
    raise HTTPException(
        status_code=501,
        detail="Reset endpoint not yet implemented. Assigned to Developer 2.",
    )
