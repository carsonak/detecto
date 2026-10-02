"""Main FastAPI entrypoint for Detecto API."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.detect import router as detect_router
from backend.routes.history import router as history_router

app = FastAPI(
    title="Detecto API",
    description="Real-time person detection and analytics API",
    version="0.1.0",
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(detect_router)
app.include_router(history_router)


@app.get("/health")
def health_check():
    """Health check endpoint to verify server is running."""
    return {"status": "ok", "service": "detecto-backend"}
