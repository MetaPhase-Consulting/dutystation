# ADR-001: Adopt Supabase Managed PostgreSQL with Repository Abstraction

- Status: Accepted
- Date: 2026-02-11
- Decision owner: Engineering

## Context
The original application relied on a static TypeScript dataset (`src/data/dutyStations.ts`) with no persistent backend, no operational audit trail, and no scalable path for structured data updates. Project requirements include database operations, analytics/reporting, link reliability management, and expansion of data coverage.

## Decision
1. Use Supabase managed PostgreSQL as the primary application data store.
2. Introduce a repository abstraction in `src/lib/data/stationRepository.ts` so UI components depend on typed interfaces rather than storage details.
3. Keep a local fallback dataset for developer continuity when Supabase env vars are not configured.
4. Store operational metadata (link audits, usage events) in dedicated tables and expose summary views.

## Consequences
### Positive
- Enables controlled data ingestion and reporting.
- Adds a clear path for future admin workflows and analytics.
- Preserves local development usability without hard DB dependency.

### Tradeoffs
- Supabase project setup and secrets management become required for production-read behavior.
- Data parity and migration validation are now a release concern.
- Need ongoing governance for third-party links and station metadata quality.

## Alternatives Considered
- Keep static TypeScript only: rejected due to inability to satisfy database/reporting requirements.
- Self-host Postgres now: deferred for speed and operational simplicity.
- Build custom backend API first: deferred; repository + Supabase is sufficient for current phase.

## Implementation References
- Migration: `supabase/migrations/20260211090000_initial_modernization.sql`
- Data layer: `src/lib/data/stationRepository.ts`
- Seed script: `scripts/data/seed-supabase.mjs`
- Link audit pipeline: `scripts/data/audit-external-links.mjs`
