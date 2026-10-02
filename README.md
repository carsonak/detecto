# Detecto

Real-time person detection and crowd analytics system with a FastAPI backend and React/Vite dashboard.

---

## 1. Project Overview

**Detecto** is an automated computer vision and safety monitoring platform designed for real-world spaces such as entrances, classrooms, warehouses, and transit hubs. The system allows operators and safety analysts to upload image frames or video feeds, perform automated real-time person detection, visualize bounding boxes with confidence scores, and analyze crowd density trends over time.

### Key Capabilities

- **Real-Time Person Detection**: Pretrained YOLOv8 computer vision model optimized for high-accuracy person detection.
- **Interactive Visual Overlays**: Scaled bounding box canvas with dynamic confidence badges and latency indicators.
- **Historical Crowd Analytics**: Persistent event logging with SQLite, interactive time-series trend graphs, and query filters (date range, confidence threshold).
- **Lightweight & Modular**: Clean separation between AI inference pipeline, data storage, and modern web UI.

---

## 2. Architecture & Data Flow

```text
[ React / Vite Frontend ]
       │
       │  POST /api/detect (Image frame: multipart or base64)
       ▼
[ FastAPI Backend Engine ] ────► [ Ultralytics YOLOv8n (Person Class 0) ]
       │                                     │
       │                                     ▼
       │                            [ Bounding Boxes & Confidence ]
       │
       ├────► [ Auto-Log Event ] ───► [ SQLite Database (detecto.db) ]
       │
       ▼  Response: JSON (count, boxes, confidence, latency) + Overlays
[ React Detection View ] ──► Canvas Bounding Box Rendering & Stats Cards
       │
       ▼  GET /api/history (Filter by date, min confidence)
[ React History View ] ───► Time-Series Trend Chart & Event Log Table
```

---

## 3. Quick Start & Setup Instructions

### Prerequisites

- **Python**: Version 3.12+
- **Node.js**: Version 18+ (tested on Node v22)
- **Package Managers**: `pip` and `npm`

### 3.1 Backend Setup (FastAPI)

From the repository root:

1. Create and activate a Python virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI development server:

   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

   The backend API will be available at `http://localhost:8000`. Interactive OpenAPI documentation is accessible at `http://localhost:8000/docs`.

### 3.2 Frontend Setup (React / Vite)

1. In a separate terminal, navigate to `frontend/`:

   ```bash
   cd frontend
   ```

2. Install npm dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

   Open your browser at `http://localhost:3000`. The Vite server automatically proxies `/api` calls to `http://localhost:8000`.

---

## 4. Verification & Testing

### Backend Tests

Execute automated unit and route tests:

```bash
# From repository root
pytest backend/tests -v
```

### Frontend Typechecking (JSDoc Static Safety)

Verify JSDoc type annotations across components without compiling:

```bash
cd frontend
npm run typecheck
```

### Frontend Production Build

Validate CSS Modules and production bundling:

```bash
cd frontend
npm run build
```

---

## 5. Repository Directory Layout

```text
detecto/
├── backend/
│   ├── main.py                # FastAPI entrypoint & CORS middleware
│   ├── routes/
│   │   ├── detect.py          # /detect endpoint (Dev 1)
│   │   └── history.py         # /history and /reset endpoints (Dev 2)
│   ├── models/
│   │   └── record.py          # SQLite schema & Pydantic models (Dev 2)
│   ├── utils/
│   │   └── preprocessing.py   # Image decoding & normalization (Dev 1)
│   ├── samples/               # Backend sample test frames
│   └── tests/
│       ├── test_health.py     # Health check & route registry tests
│       ├── test_detect.py     # Detection unit tests (Dev 1)
│       └── test_history.py    # History unit tests (Dev 2)
│
├── frontend/
│   ├── package.json           # React, Vite, Lucide & Chart dependencies
│   ├── jsconfig.json          # JSDoc static typing configuration
│   ├── vite.config.js         # Vite configuration with API proxy
│   ├── public/samples/        # 10 sample test frames for UI selector
│   └── src/
│       ├── App.jsx            # Tab navigation shell
│       ├── App.module.css     # App navigation styles
│       ├── pages/
│       │   ├── DetectionView.jsx        # Frame upload & canvas overlay (Dev 1)
│       │   ├── DetectionView.module.css
│       │   ├── HistoryView.jsx          # Trend graph & event table (Dev 2)
│       │   └── HistoryView.module.css
│       ├── components/
│       │   ├── BoundingBoxCanvas.jsx    # Bounding box rendering component
│       │   ├── BoundingBoxCanvas.module.css
│       │   ├── HistoryChart.jsx         # Analytics trend graph component
│       │   └── HistoryChart.module.css
│       └── types/
│           └── css-modules.d.ts         # TypeScript module declaration for CSS
│
├── plans/                     # Living multi-developer task coordination suite
│   ├── README.md              # Plans guide & Coordination Gates protocol
│   └── 2026-10-01-detecto-coordination/
│       ├── overview.md        # Gates, data contracts, and progress dashboard
│       ├── phase-0-scaffolding.md
│       ├── phase-1-dev1-detection.md
│       ├── phase-1-dev2-history.md
│       ├── phase-2-integration.md
│       └── phase-3-benchmarking.md
│
├── AGENTS.md                  # Project rules, commit standards, and team protocol
├── requirements.txt           # Python backend dependencies
├── pytest.ini                 # Pytest pythonpath configuration
└── README.md                  # Project documentation (this file)
```

---

## 6. Evaluation Targets & Benchmarks

The detection pipeline is evaluated against the 5 project targets across 10 test frames:

| Metric                     | Target | Formula / Measurement Method                                 |
| -------------------------- | ------ | ------------------------------------------------------------ |
| **Detection Accuracy**     | ≥ 85%  | `(Correct detections ÷ Total visible persons) × 100%`        |
| **False Positives**        | ≤ 10%  | `(Non-person detections ÷ Total detections) × 100%`          |
| **Average Inference Time** | ≤ 1.5s | Mean processing time across 10 test frames on local hardware |
| **Average Confidence**     | ≥ 0.70 | Mean confidence score for valid person detections            |
| **System Reliability**     | 100%   | Process all 10+ test images without unhandled crashes        |

_Note: Actual benchmark numbers, test case failure analysis, and UI screenshots will be documented in this section upon completion of Milestone 3._
