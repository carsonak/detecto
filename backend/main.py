"""Main FastAPI entrypoint for Detecto API."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.record import init_db
from routes.detect import router as detect_router
from routes.history import router as history_router

logger = logging.getLogger("detecto")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialise the detections database before serving requests.

    Side effect: creates the SQLite database file and table on startup.
    """
    init_db()
    logger.info("DB initialized")
    yield


app = FastAPI(
    title="Detecto API",
    description="Real-time person detection and analytics API",
    version="0.1.0",
    lifespan=lifespan,
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