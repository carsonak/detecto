"""Data models and SQLite persistence for detection history (Developer 2)."""

import sqlite3
from typing import Optional

from pydantic import BaseModel

DB_PATH = "detecto.db"


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


def _connect() -> sqlite3.Connection:
    """Open a connection to the detections database with dict-like rows."""
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    """Create the detections table if it does not already exist.

    Side effect: writes ``detecto.db`` in the process working directory.
    """
    with _connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS detections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                people_count INTEGER NOT NULL,
                avg_confidence REAL NOT NULL,
                inference_time_ms REAL NOT NULL
            )
            """
        )
        connection.commit()


def insert_record(
    timestamp: str,
    people_count: int,
    avg_confidence: float,
    inference_time_ms: float,
) -> int:
    """Persist one detection event and return its new row id.

    Args:
        timestamp: ISO 8601 event time.
        people_count: Number of persons detected.
        avg_confidence: Mean confidence across detections (0.0 when none).
        inference_time_ms: Model inference duration in milliseconds.

    Returns:
        The autoincrement id of the inserted row.

    Side effect: writes a row to SQLite.
    """
    with _connect() as connection:
        cursor = connection.execute(
            "INSERT INTO detections "
            "(timestamp, people_count, avg_confidence, inference_time_ms) "
            "VALUES (?, ?, ?, ?)",
            (timestamp, people_count, avg_confidence, inference_time_ms),
        )
        connection.commit()
        return int(cursor.lastrowid)


def query_records(
    limit: Optional[int] = None,
    min_confidence: Optional[float] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
) -> list[dict]:
    """Return detection records newest-first with optional filters applied.

    Args:
        limit: Maximum rows to return; ``None`` returns all matches.
        min_confidence: Only return rows with avg_confidence at or above this.
        start_date: Inclusive lower bound on the timestamp (ISO 8601 string).
        end_date: Inclusive upper bound on the timestamp (ISO 8601 string).

    Returns:
        A list of row dictionaries ordered by id descending.
    """
    clauses: list[str] = []
    params: list[object] = []

    if min_confidence is not None:
        clauses.append("avg_confidence >= ?")
        params.append(min_confidence)
    if start_date is not None:
        clauses.append("timestamp >= ?")
        params.append(start_date)
    if end_date is not None:
        clauses.append("timestamp <= ?")
        params.append(end_date)

    query = "SELECT * FROM detections"
    if clauses:
        query += " WHERE " + " AND ".join(clauses)
    query += " ORDER BY id DESC"
    if limit is not None:
        query += " LIMIT ?"
        params.append(limit)

    with _connect() as connection:
        rows = connection.execute(query, params).fetchall()
        return [dict(row) for row in rows]


def clear_records() -> int:
    """Delete every detection record.

    Returns:
        Number of rows deleted.

    Side effect: empties the detections table in SQLite.
    """
    with _connect() as connection:
        cursor = connection.execute("DELETE FROM detections")
        connection.commit()
        return cursor.rowcount