# DutyStation Modernization Roadmap

## Program Metadata
- Last updated: 2026-02-11
- Program type: Website modernization (database migration + quality hardening)
- Delivery style: Iterative, phase-based
- Tracking source of truth: `docs/progress/status-log.md`

## Phase 0 - Foundation (Done)
- Owner: Engineering
- Target dates: 2026-02-11 to 2026-02-18
- Scope:
  - Supabase/PostgreSQL schema and RLS baseline
  - Typed domain model and repository layer (`src/lib/data`)
  - Data automation scripts (export, seed, link audit)
  - Environment templates and setup paths
- Exit criteria:
  - Migration SQL committed
  - App reads through repository abstraction
  - Seed and audit scripts runnable with env vars

## Phase 1 - Core Features + DB Migration (Done)
- Owner: Engineering + Product
- Target dates: 2026-02-18 to 2026-03-04
- Scope:
  - Migrate current 129 stations into Supabase
  - Incentive eligibility badges + filter
  - Position toggles (CBPO/BPA/AMO)
  - Map pin hover labels and keyboard-accessible pin list
  - CBP relocation-cost disclaimer
  - Global travel resources (Expedia/Travelocity/Kayak)
  - Recreation information panels
- Exit criteria:
  - Data parity checks pass for station count and key fields
  - Feature acceptance tests pass for list/map/detail/compare flows

## Phase 2 - Quality Hardening (In Progress)
- Owner: Engineering + QA
- Target dates: 2026-03-04 to 2026-03-18
- Scope:
  - Link quality automation and reporting
  - Accessibility uplift (best effort) against WCAG 2.1 AA / 508 baseline
  - Security baseline improvements (dependency checks, header validation, sanitization)
  - Performance budgets and route-level optimization
- Exit criteria:
  - `npm run test:run`, `npm run lint`, `npm run build` green in CI
  - Accessibility/security checklist has evidence links

## Phase 3 - Data Expansion (In Progress)
- Owner: Engineering + Data Steward
- Target dates: 2026-03-18 to 2026-04-08
- Scope:
  - Expand beyond 129 stations via `src/data/cbp_all_locations.csv`
  - Add data normalization and enrichment pipeline
  - Improve station-position mapping fidelity
- Exit criteria:
  - Repeatable ingestion runbook tested
  - Expanded dataset validated by QA checks

## Phase 4 - Operationalization (Planned)
- Owner: Engineering + Operations
- Target dates: 2026-04-08 to 2026-04-22
- Scope:
  - Reporting views and event telemetry refinement
  - O&M runbooks and release readiness docs
  - Maintenance and support readiness package
- Exit criteria:
  - Operational docs complete
  - Production readiness review complete

## Milestones
- M1: Repository + schema merged (Done)
- M2: Phase 1 feature parity complete (Done)
- M3: Quality hardening complete (In Progress)
- M4: Expansion pipeline complete (In Progress)
- M5: Operational handoff complete (Planned)

## Known Risks
- External links can throttle automated checks (429/403) and require layered validation policy.
- Official CBPO/BPA/AMO mapping may require authoritative external source integration.
- Accessibility compliance is best-effort in current phase; full hard gate remains a future milestone.
