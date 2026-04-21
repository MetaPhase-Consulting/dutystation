[![CI](https://github.com/MetaPhase-Consulting/dutystation/actions/workflows/ci.yml/badge.svg)](https://github.com/MetaPhase-Consulting/dutystation/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/322b89fe-7d36-4c3f-a73f-3fb97adbaf4a/deploy-status)](https://app.netlify.com/projects/dutystation/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)](.nvmrc)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Section 508](https://img.shields.io/badge/accessibility-Section%20508%20%2F%20WCAG%202.1%20AA-FF8A3D)](docs/compliance/accessibility-security-checklist.md)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![CivicTech](https://img.shields.io/badge/Civic-Tech-1f7a8c)](https://github.com/MetaPhase-Consulting)
[![Built by MetaPhase](https://img.shields.io/badge/Built%20by-MetaPhase-fb641f)](https://metaphase.tech)

# Duty Station Relocation

**Live:** [dutystation.us](https://dutystation.us)

A public, open-source, map-first directory of U.S. Customs and Border Protection
(CBP) duty stations — covering Border Patrol (USBP), Office of Field Operations
(OFO), and Air & Marine Operations (AMO). Built to help prospective CBP
employees and their families explore potential assignments: location, local
context, housing, schools, climate, and links to authoritative references for
each station.

No login. No tracking of personal profiles. No implication of official CBP
endorsement — this is a CivicTech contribution.

## Who It's For

- **Primary:** CBP job applicants weighing relocation offers.
- **Secondary:** CBP HR / recruiting teams supporting workforce mobility.
- **Tertiary:** Public researchers and journalists interested in CBP
  geographic footprint.

## Key Features

| Feature | Description |
|---|---|
| **Map-first directory** | OpenLayers map of every CBP station with filters by component (USBP, OFO, AMO), region, state, and facility type. |
| **Station detail** | Per-station page with local context, travel resources, and vetted external links (housing, schools, climate, etc.). |
| **Side-by-side comparison** | Pick up to three stations and compare attributes, incentives, and resource sets. |
| **Link quality gate** | Every external link is audited, remediated, and validated in CI — broken or redirect-to-error links block release. |
| **Static-hostable fallback** | Runs against Supabase when configured; falls back to a bundled dataset so the site stays available even without a database. |
| **Accessibility first** | axe-core unit tests, `@axe-core/cli` page scans, and Playwright + axe E2E — WCAG 2.1 AA / Section 508. |
| **Hardened CI** | Typecheck, lint, unit + E2E tests, link audit, npm audit, CodeQL, gitleaks, Trivy, OWASP ZAP, Lighthouse on every PR. |

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) + [Vite 7](https://vitejs.dev/) — SPA deployed to [Netlify](https://www.netlify.com/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) component primitives
- [Supabase](https://supabase.com/) — managed PostgreSQL with RLS; drives the station + link tables
- [OpenLayers](https://openlayers.org/) — interactive mapping
- [Lucide](https://lucide.dev/) for icons
- [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/) + [jest-axe](https://github.com/nickcolley/jest-axe) — unit and accessibility tests
- [Playwright](https://playwright.dev/) + [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) — E2E and in-browser a11y
- [OWASP ZAP](https://www.zaproxy.org/), [CodeQL](https://codeql.github.com/), [gitleaks](https://github.com/gitleaks/gitleaks), [Trivy](https://trivy.dev/) — security scanning in CI
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) — performance and a11y budgets

## Architecture

- Typed repository layer (`src/lib/data/stationRepository.ts`) fronts Supabase.
- When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set, the app reads from Supabase; otherwise it falls back to the bundled dataset (`src/data/`) — the site remains functional as a pure static deploy.
- DB schema and RLS policies are versioned in `supabase/migrations/`.
- Operational data pipeline (seed, enrich, audit, remediate, validate) lives in `scripts/data/` and is exercised by a scheduled GitHub Actions workflow.
- CI pipeline is a single multi-stage workflow covering quality, security, a11y, performance, E2E, and migration validation.

## Local Setup

### Prerequisites

- [Node.js 20](https://nodejs.org/) (use [`.nvmrc`](.nvmrc) via `nvm use`)
- npm 10+ (ships with Node 20)

### Steps

```sh
git clone https://github.com/MetaPhase-Consulting/dutystation.git
cd dutystation
npm install
npm run dev
```

The app is available at `http://localhost:5173`. For a pinned port:

```sh
npm run dev:secure   # http://localhost:8080
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values as needed:

```sh
cp .env.example .env
```

Frontend runtime keys (exposed to the browser):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Script-only keys (never exposed to the frontend):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Without these the app still runs against the bundled dataset.

## Data Operations

```sh
# Export current source to JSON
npm run data:export

# Seed Supabase tables
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:seed:supabase

# Audit external links (writes report)
npm run data:audit:links -- --out docs/progress/link-audit-latest.json

# Dry-run link remediation
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:remediate:links

# Apply remediations
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:remediate:links:apply

# Sync audit status to Supabase
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:audit:links:sync

# Validate link-quality gate (fails if thresholds exceeded)
npm run data:validate:link-audit -- --report docs/progress/link-audit-latest.json --maxUnknownRate 0.35

# Enrich from CBP CSV
npm run data:enrich:csv -- --out supabase/seed/enriched_stations.json
```

See [docs/operations/link-quality-runbook.md](docs/operations/link-quality-runbook.md) for the full pipeline.

## Quality Gates

Run these locally before opening a PR:

```sh
npm run typecheck        # TypeScript
npm run lint             # ESLint
npm run test:run         # Vitest unit + jest-axe
npm run test:a11y        # axe-core CLI on key routes
npm run test:e2e         # Playwright smoke (desktop + mobile)
npm run build            # Production Vite build
npm run test:audit       # npm audit (prod)
npm run data:validate:link-audit
```

## CI/CD

Every PR runs a single consolidated workflow:

1. Lint + typecheck
2. Unit tests + coverage
3. Build + bundle size report
4. Security scan (npm audit, CodeQL, gitleaks, Trivy, OWASP ZAP baseline)
5. Accessibility (axe-core CLI)
6. Lighthouse CI
7. E2E smoke (Playwright, desktop + mobile Chrome)
8. Migration validation
9. Netlify preview deploy (for PRs) / production deploy (on `main`)
10. Supabase migration push (on merge to `dev` / `main`)

A separate scheduled workflow (`data-maintenance.yml`) runs the link audit,
remediation, and enrichment pipeline daily.

Required repository secrets:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`
- `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` (if CI-driven deploys are enabled; otherwise Netlify's GitHub App handles deploys directly)

## Program Documentation

- Collaboration rules: [CLAUDE.md](CLAUDE.md), [AGENTS.md](AGENTS.md)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Implementation roadmap: [docs/plan/implementation-roadmap.md](docs/plan/implementation-roadmap.md)
- Requirements traceability: [docs/requirements/traceability-matrix.md](docs/requirements/traceability-matrix.md)
- Progress log: [docs/progress/status-log.md](docs/progress/status-log.md)
- Architecture decisions: [docs/architecture/adr-001-data-platform.md](docs/architecture/adr-001-data-platform.md)
- Engineering harness: [docs/governance/engineering-harness-standard.md](docs/governance/engineering-harness-standard.md)
- Release gates and SLOs: [docs/governance/release-gates-and-slos.md](docs/governance/release-gates-and-slos.md)
- Link operations runbook: [docs/operations/link-quality-runbook.md](docs/operations/link-quality-runbook.md)
- Accessibility & security checklist: [docs/compliance/accessibility-security-checklist.md](docs/compliance/accessibility-security-checklist.md)

## Deployment

Production deploys to [Netlify](https://app.netlify.com/projects/dutystation) from
`main`. Pull requests get automatic deploy previews. Netlify runs
`npm ci --legacy-peer-deps && npm run build` and publishes the `dist/`
directory — see `netlify.toml` for the full build + headers config.

Because the app ships with a bundled dataset fallback, the production artifact
is a self-contained static SPA and can also be hosted anywhere that serves
static files.

## Built by MetaPhase

Developed by [MetaPhase](https://metaphase.tech) as a free, open-source
CivicTech contribution — delivered with our internal
[OrangeAI accelerators](https://metaphase.tech/accelerators) to rapidly ship
government-grade generative AI solutions.

## License

MIT — see [LICENSE](LICENSE). You are free to use, modify, and distribute this
software in accordance with the terms of that license.
