# Agent Working Memory

Persistent repo-level guidance for AI coding agents working on dutystation.
Read this before starting work; update it whenever the user gives new standing
guidance.

## Reading Order

Before making changes, read in this order:

1. `README.md` — project overview and scope.
2. This file (`AGENTS.md`) and `CLAUDE.md` — collaboration rules.
3. `docs/plan/` — implementation roadmap and current phase.
4. `docs/requirements/` — traceability matrix and requirements.
5. `docs/operations/link-quality-runbook.md` — how link audit/remediation works.
6. `docs/compliance/accessibility-security-checklist.md` — release gates for a11y and security.

## Repository Map

- `src/` — React 19 + Vite + TypeScript app.
  - `pages/` — route components (`HomePage`, `DirectoryPage`, `StationDetailPage`, `ComparisonPage`, `DataSourcesPage`).
  - `components/` — UI primitives (`ui/` is shadcn/Radix), `directory/`, `StationDetailMap`.
  - `lib/data/` — station repository, filters, usage tracking; `stationRepository.ts` wraps Supabase with a legacy-data fallback.
  - `lib/supabase/client.ts` — Supabase client, returns `null` when env vars unset.
- `supabase/migrations/` — versioned schema. Never skip a migration; add a new dated one.
- `scripts/data/` — data pipeline (export, seed, enrich, audit, remediate, validate).
- `tests/e2e/` — Playwright suite (added in the hardening branch).
- `docs/` — plan, requirements, compliance, architecture, operations.
- `.github/workflows/` — CI, security, data-maintenance.

## Product Invariants (do-not-regress)

- CBP scope covers **all components**: Border Patrol (USBP), Office of Field Operations (OFO), Air & Marine Operations (AMO). Filters and facets treat them as first-class.
- Map-first UX on `/directory` and station detail. The map is not a secondary tab.
- Every external link ships validated by `scripts/data/validate-link-audit.mjs`. Broken or redirect-to-error links are blockers.
- WCAG 2.1 AA clean on every page (axe-core, no critical/serious). Section 508.
- No implication of official CBP endorsement. No federal seals in UI.
- No AI attribution anywhere (commits, PRs, comments).

## User Preferences

- Commits and PRs are authored by humans only. No `Co-Authored-By: Claude`, no "Generated with Claude Code", no "codex", no AI model names in commit messages, PR titles/bodies, or code comments. If a tool injects such a trailer, strip it before pushing.
- No `codex` or `claude` in branch names unless the user explicitly asks.
- Branch names: short, descriptive, professional.
- When a branch already contains unmerged feature work, layer new work on it — don't rebase to `dev` or start fresh unless directed.
- Commit regularly; push regularly.
- Refer to the company as **"MetaPhase"** in user-facing copy. Full legal name ("MetaPhase Consulting, LLC") only in `LICENSE`.
- Never remove entries from `.gitignore` without explicit user permission.
- Keep `CLAUDE.md` and this file in sync when recording new guidance.

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7 (SPA on Netlify at `dutystation.us`)
- Tailwind CSS with dutystation color tokens (federal blue, accent red/gold)
- Supabase (PostgreSQL + RLS, optional at runtime — falls back to bundled legacy data)
- OpenLayers for the interactive map
- `lucide-react` icons
- Vitest + `@testing-library/react` + `jest-axe` (unit + a11y)
- Playwright + `@axe-core/playwright` (E2E smoke, desktop + mobile Chrome)
- `@axe-core/cli` (page-level Section 508 / WCAG 2.1 AA scans)
- OWASP ZAP baseline (DAST)
- Lighthouse CI (performance + a11y budgets)
- CodeQL + gitleaks + Trivy (SAST / secrets / vulnerable deps)
- Node 20 (pinned in `.nvmrc`, `package.json#engines`, Netlify build env)
- Both `package-lock.json` (npm, local/CI) and `bun.lockb` (Netlify) committed — keep in sync.

## Data & Environment Safety

- Never drop or reset the remote Supabase database. Use targeted inserts/updates and a new migration.
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` gate the client — when absent, the app uses bundled legacy data from `src/data/`. Preserve that fallback; it's what keeps the site static-hostable.
- Never commit a real `.env`. Only `.env.example`.
- The scheduled link audit/remediation workflow is load-bearing — don't break its outputs.

## Branch Protection

- Never commit directly to `dev` or `main`.
- Feature branches off `dev`; `main` is the Netlify production branch.
- PRs require at least one human reviewer. Conversation resolution required.
- No force pushes or deletions on `dev` / `main`.
- If a direct commit slips in, rescue it to a feature branch and reset the protected branch.

## PR Review Workflow

When asked to review PR comments:

1. Fetch: `gh api repos/MetaPhase-Consulting/dutystation/pulls/{N}/comments`.
2. Identify unreplied comments from bots and humans.
3. Triage P0 → P2; fix every issue.
4. Reply inline:
   `gh api repos/MetaPhase-Consulting/dutystation/pulls/{N}/comments -f body="..." -F in_reply_to={comment_id}`
5. Commit, push, verify CI.
6. Never leave unreplied review comments on a PR marked ready. Never create new top-level review comments when a reply is possible.

## Release Gates

Every PR must pass:

- Typecheck, lint, unit tests (Vitest)
- Accessibility (axe-core CLI via `test:a11y`; `@axe-core/playwright` in E2E)
- E2E smoke (Playwright on desktop + mobile Chrome)
- Production build (Vite; both `npm run build` and `bun run build`)
- `npm audit --omit=dev` → 0 vulnerabilities
- Link-audit validation (`data:validate:link-audit`)

CI also runs (warn-only, continue-on-error) CodeQL, gitleaks, Trivy, OWASP ZAP baseline, Lighthouse CI. Regressions surface but don't block unless a scan explicitly escalates.

## Maintenance Rule

When the user gives process feedback, update this file and `CLAUDE.md` so every
future session picks up the guidance. Never let these two files drift.
