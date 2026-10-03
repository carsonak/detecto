# Plans Directory Guide & Coordination Protocol

This directory houses the structured task, architecture, and milestone coordination plans for the `detecto` project. Plans are tracked in git so that both developers (and any AI agents or tools used by either developer) maintain a shared, synchronized understanding of project state, dependencies, and interfaces.

---

## 1. Directory Structure & Naming Conventions

Each major feature, epic, or coordination effort lives in its own date-stamped folder:

```text
plans/
├── README.md                           # This guide
├── 2026-10-01-detecto-coordination/    # Phase 0-3 architecture, gates & initial sprint
│   ├── overview.md
│   └── phase-*.md
└── 2026-10-03-pipeline-remediation/    # Post-PR#1 bug fixes, contract alignment & completion
    └── overview.md
```

- **Date Format**: `YYYY-MM-DD` (ISO 8601 calendar date).
- **Task Label**: Concise hyphenated topic (e.g., `2026-10-01-detecto-coordination`).
- **Single-File vs. Multi-Phase**:
  - Small, isolated tasks may use a single `plan.md`.
  - Multi-phase tasks or tasks split across multiple developers **must** use the multi-file format anchored by `overview.md`.

---

## 2. Multi-File Plan Conventions

For multi-file plans, `overview.md` is the single entrypoint and must provide:

1. **High-Level Context**: Objective, architectural background, and technical stack.
2. **Coordination Gates Matrix**: Clear sequence of synchronization gates indicating entry criteria, dependencies, and unblocked work.
3. **Developer Split & Dependency Matrix**: Detailed mapping of which developer owns which components across backend, frontend, and tests.
4. **Consolidated Progress Dashboard**: High-level matrix showing real-time completion state of every phase.
5. **Living Plan Evolution & Bug Tracker**: Global log of design shifts, uncovered gaps, and resolved issues.

---

## 3. Coordination Gates Protocol

Coordination Gates are formal synchronization checkpoints designed to decouple complex or multi-developer tasks, allowing parallel execution without risking architectural drift, merge conflicts, or interface mismatches.

### 3.1 Purpose & Core Mechanics

In multi-developer and agent-assisted workflows, work often splits into separate domains (e.g. backend vs. frontend, or feature slice A vs. feature slice B). Rather than enforcing lockstep synchronization on every line of code, **Coordination Gates** define explicit synchronization milestones:

- **Decoupled Velocity**: Teams work concurrently and independently between gates using agreed-upon mocks and frozen data contracts.
- **Controlled Integration**: Heavy synchronization or irreversible merges occur only when passing a designated gate.
- **Explicit Blockers**: If a prerequisite gate is not yet cleared, dependent downstream tasks remain paused, preventing premature integration attempts.

### 3.2 Anatomy of a Coordination Gate

Every gate defined in an `overview.md` plan must specify three elements:

1. **Entry Criteria (Prerequisites)**: The verifiable state or completed deliverables required before entering the gate (e.g., scaffolding passes checks, contracts signed off, unit test suites pass).
2. **Unblocked Parallel Work**: The tasks that can safely be executed simultaneously once the gate is active without cross-developer interference.
3. **Exit Criteria (Clearing the Gate)**: Concrete automated tests, build confirmations, or manual verifications required to declare the gate passed.

### 3.3 Gate Progression in Task Plans

The specific gate sequence, dependency flowcharts, and milestone statuses are documented in each task's `overview.md` file. As developers and agents complete work, gate transitions must be reflected in the consolidated progress dashboard.

---

## 4. Living Documentation Standard

Every plan file (`overview.md` and individual `phase-*.md` files) must be maintained as a **living document**:

1. **Agent-Agnostic Usability**: Written in clear, unambiguous language so any developer or AI assistant can pick up the task and understand context immediately.
2. **Incremental Updates**: Update checklists step-by-step (`[ ]` Pending, `[-]` In Progress, `[x]` Completed) rather than updating everything at the very end.
3. **Plan Evolution, Deviations & Bug Tracker**:
   - Document any deviation from original technical assumptions.
   - Record newly discovered scope additions or external constraints.
   - Log architectural holes, bugs in the plan, or test regressions, detailing how they were addressed or who is assigned to resolve them.
