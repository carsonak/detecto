# Plans Directory Guide & Coordination Protocol

This directory houses the structured task, architecture, and milestone coordination plans for the `detecto` project. Plans are tracked in git so that both developers (and any AI agents or tools used by either developer) maintain a shared, synchronized understanding of project state, dependencies, and interfaces.

---

## 1. Directory Structure & Naming Conventions

Each major feature, epic, or coordination effort lives in its own date-stamped folder:

```text
plans/
├── README.md                           # This guide
└── YYYY-MM-DD-<task-label>/
    ├── overview.md                     # High-level architecture, gates, and dashboard
    ├── phase-0-<name>.md               # Detailed phase breakdown
    ├── phase-1-<name>.md               # Detailed phase breakdown
    └── ...
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

To enable maximum development parallelism without stepping on each other's work or encountering unexpected integration collisions, work is synchronized through **Coordination Gates**:

| Gate | Title | Entry Requirement | Purpose & Unblocked Work |
|---|---|---|---|
| **Gate 0** | **Scaffolding Complete** | Clean build & server boot | Unblocks initial setup and route/component skeletons. |
| **Gate 1** | **Contract & Mock Readiness** | API schemas frozen in plan | Unblocks independent, concurrent development for Dev 1 and Dev 2. |
| **Gate 2** | **Feature Unit Verification** | Unit tests passing on both sides | Confirms Dev 1 (Detection) and Dev 2 (History) are verified before integration. |
| **Gate 3** | **End-to-End Integration** | Detection auto-logs to History | Unblocks system-wide flow validation and error edge cases. |
| **Gate 4** | **Benchmark & Evaluation** | All 5 metrics verified | Unblocks documentation, screenshots, and final delivery. |

---

## 4. Living Documentation Standard

Every plan file (`overview.md` and individual `phase-*.md` files) must be maintained as a **living document**:

1. **Agent-Agnostic Usability**: Written in clear, unambiguous language so any developer or AI assistant can pick up the task and understand context immediately.
2. **Incremental Updates**: Update checklists step-by-step (`[ ]` Pending, `[-]` In Progress, `[x]` Completed) rather than updating everything at the very end.
3. **Plan Evolution, Deviations & Bug Tracker**:
   - Document any deviation from original technical assumptions.
   - Record newly discovered scope additions or external constraints.
   - Log architectural holes, bugs in the plan, or test regressions, detailing how they were addressed or who is assigned to resolve them.
