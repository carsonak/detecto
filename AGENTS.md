# Agent Guidelines & Workflow Protocol: Detecto

This document defines the operating guidelines, 2-developer collaboration protocol, and task management standards for developers and AI agents working on `detecto`.

---

## 1. Project & Repository Context

- **Repository**: [`detecto`](https://learn.zone01kisumu.ke/git/akihara/detecto)
- **Tech Stack**:
  - **Backend**: Python 3.12+, FastAPI, Uvicorn, Ultralytics YOLOv8, OpenCV, SQLite
  - **Frontend**: Node.js / React 18+, Vite, TailwindCSS / CSS Modules, Lucide icons, Chart.js / Recharts
- **Team**: 2 Developers collaborating in a shared repository.
- **Workflow Model**: Straightforward git workflow with feature branches (`feat/<topic>`) or incremental commits directly on `main` once verified.
- **Agent Boundaries**:
  - Do not spawn sub-agents unless explicitly requested by the user.
  - Work directly within the active repository checkout.

---

## 2. Privacy & Git Cleanliness Protocol (STRICT)

> [!CAUTION]
> **Zero Local Footprint & No Machine Leaks**
> Avoid placing machine-specific paths or internal workstation references into git commits or remote repositories:
>
> - Never commit machine-specific paths (e.g., `/home/...`, `/tmp/...`).
> - Never commit virtual environments (`venv/`, `.venv/`), node dependencies (`node_modules/`), build artifacts (`dist/`), temporary cache files (`__pycache__/`, `.pytest_cache/`), or local database files (`*.db`, `*.sqlite`).
> - Keep commit messages, PR descriptions, and issue replies focused strictly on technical code, architecture, specifications, and tests.
>
> [!NOTE]
> **Exception for Shared Coordination**:
> Planning and design documents located under `plans/` **are tracked** in git to facilitate task coordination, interface alignment, and progress tracking between the two developers.

---

## 3. Git Branching, Commit & Push Standards

1. **Branching Model**:
   - Feature branches follow the pattern: `feat/<feature-name>`, `fix/<issue-name>`, or `docs/<topic>`.
   - Small, self-contained baseline setups or documentation may be committed on `main`.
   - Before pushing or merging, synchronize with remote: `git pull --rebase origin main`.
   - Keep working tree clean and inspect `git status` before committing.

2. **Commit Trigger & Granularity (STRICT)**:
   - **Do not commit anything unless explicitly told to do so by the user.**
   - When told to commit without specific instructions:
     - Automatically break down changes into small, logical, atomic chunks.
     - **Avoid large monolithic commits** containing massive changes across multiple modules or features.
   - When explicit commit instructions are provided by the user, defer strictly to those instructions.
   - Use Conventional Commits format: `type(scope): imperative description`.
     - Scopes: `detection`, `history`, `model`, `ui`, `backend`, `frontend`, `benchmarks`, `scaffold`, `planning`.
   - Verify code compiles and passes checks before creating each commit.

3. **Push Approval Protocol (STRICT)**:
   - **NEVER push code to the remote repository until an explicit go-ahead is given after a review.**
   - Always present verification results and commit summaries to the user, and wait for confirmation before executing `git push`.

---

## 4. 2-Developer Collaboration & Quality Protocol

### 4.1 Feature Ownership & Full-Stack Responsibility

- Work is divided by feature domain. Each developer takes ownership of their feature across the entire stack (FastAPI backend endpoint + React/Vite UI page + automated tests).
- Developers align on shared data contracts and database schemas in `plans/` prior to implementing overlapping touchpoints.

### 4.2 Independent Verification Before Push

Before pushing feature code to a shared branch or `main`:

1. **Backend Checks**:
   - FastAPI server starts cleanly without errors (`uvicorn backend.main:app`).
   - Relevant unit and API route tests pass (`pytest backend/tests`).
   - Edge cases (corrupted images, missing fields, empty uploads) return proper HTTP 400/422 status codes.
2. **Frontend Checks**:
   - Vite production build succeeds (`npm run build` in `frontend/`).
   - Linting passes cleanly (`npm run lint`).
   - UI renders gracefully across screen sizes and displays proper error indicators for failed requests.

---

## 5. Task Planning & Evolution Standard

Every major feature or multi-step task must have a structured plan in `plans/YYYY-MM-DD-<task-label>/`:

1. **Agent-Agnostic Design**: Plans must be self-contained and clear so any human developer or AI assistant can pick them up and continue seamlessly.
2. **Directory Overview**: Refer to `plans/README.md` for directory layout, gate protocols, and living documentation guidelines.
3. **Required Sections for All Plans**:
   - **Goal & Requirements**: Concise summary of what is being built and acceptance criteria.
   - **Interface & Contract Definition**: Signatures, input parameters, and response structures.
   - **Progress Tracking**: Step-by-step testable checklist (`[ ]`, `[-]`, `[x]`).
   - **Plan Evolution, Deviations & Bug Tracker**: A dedicated living section documenting:
     - Deviations from the original plan and why they occurred.
     - New additions or scope adjustments.
     - Unforeseen gaps, holes, or bugs discovered in the plan.
     - Fixes applied or items remaining to be addressed.
4. **Incremental Execution**: Implement, verify, and check off items incrementally rather than batching everything at the end.

---

## 6. Project Benchmark & Evaluation Targets

Every model and detection pipeline contribution must uphold the project evaluation targets defined in the project specification:

| Metric                     | Target | Verification Formula / Method                                |
| -------------------------- | ------ | ------------------------------------------------------------ |
| **Detection Accuracy**     | ≥ 85%  | `(Correct detections ÷ Total visible persons) × 100%`        |
| **False Positives**        | ≤ 10%  | `(Non-person detections ÷ Total detections) × 100%`          |
| **Average Inference Time** | ≤ 1.5s | Mean processing time across 10 test images on local hardware |
| **Average Confidence**     | ≥ 0.70 | Mean confidence score for valid person detections            |
| **System Reliability**     | 100%   | Process all 10+ test images without unhandled crashes        |

---

## 7. Symbol Documentation & Typing Standards

Adapted from robust open-source principles (e.g. `paykit-AGENTS.md`), all code contributions must uphold rigorous symbol documentation and static typing standards.

### 7.1 Consumer-Centric Purpose & Scope

- **Purpose & Intent**: Every exported class, function, API route, React component, custom hook, and data model must include structured documentation.
- **Consumer-Centric Focus**: Comments and docstrings must clearly explain **what** the symbol does, **when** to use it, and **how** to use it without exposing callers to internal mechanics. The intent is to clearly expose public capability.
- **Side Effects & Usage Concerns**: Any side effects that directly affect callers (persisting records to SQLite, making network calls, mutating state, or acquiring locks) must be explicitly disclosed in the doc comments.
- **Internal Implementation Comments**: Algorithmic choices, math formulas, and internal branch logic belong inside function bodies as regular inline comments (`# ...` or `// ...`), never in public symbol docstrings.

### 7.2 Python Documentation & Type Annotations

- All Python functions, methods, and route handlers must use native PEP 484 type annotations for parameters and return types.
- Follow PEP 257 docstring conventions (triple double-quotes `"""..."""`):
  - 1-line summary imperative sentence.
  - `Args:` block detailing parameter types and requirements.
  - `Returns:` block specifying output structure.
  - `Raises:` block detailing any `HTTPException` or custom errors.

### 7.3 JavaScript / React JSDoc Type Safety & CLI Verification

To achieve static typing confidence without TypeScript transpilation overhead:

- Annotate components, props, and utility functions using standard JSDoc comments (`/** ... */`).
- Define shared data structures using `@typedef` tags (e.g. `Detection`, `DetectionRecord`, `BoundingBox`).
- Document component props with `@param {PropsType} props`.
- Document function return types with `@returns {Type}`.
- Run static type checks in CLI using `npm run typecheck` (`tsc --noEmit` via `frontend/jsconfig.json`). All PRs and commits must pass cleanly without type errors.
