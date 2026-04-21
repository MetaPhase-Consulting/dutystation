# Duty Station Collaboration Memory

Durable collaboration guidance for assistant work in this repository. Loaded at the
start of every session — update whenever the user gives standing guidance.

## Project

- **Repo:** dutystation ([MetaPhase-Consulting/dutystation](https://github.com/MetaPhase-Consulting/dutystation))
- **Product:** Public, map-first directory of U.S. Customs and Border Protection (CBP) duty stations — Border Patrol, Office of Field Operations, and Air & Marine Operations.
- **License:** MIT (`LICENSE`). This is an open-source CivicTech project — keep it that way.
- **Hosting:** Netlify (`dutystation.us`, site id `322b89fe-7d36-4c3f-a73f-3fb97adbaf4a`) with `bun run build`. Supabase backs the data layer when configured.
- **Audience:** Public. Anything added to the site is assumed to be read by prospective CBP employees, their families, and the general public.

## Standing Preferences

- **Never include AI attribution anywhere.** No `Co-Authored-By: Claude`, no "Generated with Claude Code", no "codex", no model names in commit messages, PR titles, PR bodies, or code comments. Commits and PRs are authored by humans only.
- Never include `codex` or `claude` in a branch name unless the user explicitly asks.
- Keep branch names short, descriptive, and professional (e.g., `deps-and-testing`, `map-marker-cluster`, `data-enrichment-pipeline`).
- When the current branch already holds unmerged feature work, continue layering on it unless the user directs otherwise. Don't rebase onto `dev` or start a fresh branch in that case.
- Commit work regularly as meaningful progress lands; push often so the branch stays backed up.
- Refer to the company as **"MetaPhase"** in user-facing copy — never "MetaPhase Consulting" or "MetaPhase Consulting, LLC". The full legal name is reserved for the `LICENSE` file.
- Never remove entries from `.gitignore` without explicit user permission. Additions are fine.
- Treat process feedback (workflow, naming, docs, conventions) as persistent repo guidance — update this file and `AGENTS.md` together.

## Product Invariants (do not regress)

- **CBP scope is comprehensive**, not just Border Patrol: Border Patrol (USBP), Office of Field Operations (OFO), and Air & Marine Operations (AMO) all render as first-class components with distinct filtering.
- **Map-first UX** on `/directory` and station detail pages. Any work that buries the map in a tab or secondary view is a regression.
- **External-link quality is a release gate.** `scripts/data/audit-external-links.mjs` and `scripts/data/validate-link-audit.mjs` must pass before merge. A broken or redirected-to-error external link is a blocker, not a warning.
- **Disclaimers:** no implication of official CBP endorsement. Do not use CBP, DHS, or other federal seals in the UI.
- **Accessibility:** every page ships WCAG 2.1 AA clean (axe-core, no critical or serious violations). Section 508 compliance is non-negotiable for a CivicTech project.

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7 (SPA on Netlify)
- Tailwind CSS with dutystation tokens (federal blue, accent red/gold)
- Supabase (PostgreSQL, RLS, link/station tables) — optional at runtime; falls back to bundled legacy data when env vars are absent
- OpenLayers (`ol`) for the interactive map
- `lucide-react` for icons
- Vitest + `@testing-library/react` + `jest-axe` for unit / a11y tests
- Playwright + `@axe-core/playwright` for E2E (desktop + mobile Chrome) — added in this hardening branch
- `@axe-core/cli` for Section 508 / WCAG 2.1 AA page scans
- OWASP ZAP baseline for DAST in CI
- Lighthouse CI for performance + a11y budgets
- CodeQL + gitleaks + Trivy for SAST/secret/dep scanning
- Node 20 (pinned via `.nvmrc` and `package.json#engines`)
- Both `package-lock.json` (local/CI) and `bun.lockb` (Netlify build) are committed — keep them in sync when bumping deps.

## Data & Environment Safety

- Never drop or reset the remote Supabase database. Use targeted inserts/updates and versioned migrations in `supabase/migrations/`.
- Never commit a real `.env` — only `.env.example`.
- Data maintenance runs on a schedule (`.github/workflows/data-maintenance.yml`). Don't break the scheduled link audit/remediation outputs — they gate release quality.

## Branch Protection

- **Never commit directly to `dev` or `main`.** All changes go through a feature branch and a PR.
- Create feature branches off `dev`. `main` is the Netlify production branch.
- PRs require at least one human reviewer approval. Required conversation resolution before merge.
- No force pushes or deletions on `dev` or `main`.
- If commits accidentally land on a protected branch, rescue them to a feature branch and reset the protected branch to the last known good commit.

## PR Review Workflow

When the user says "review the PR comments":

1. Fetch: `gh api repos/MetaPhase-Consulting/dutystation/pulls/{N}/comments`
2. Identify unreplied comments from bots (Codex, CodeQL, etc.) and humans.
3. Triage P0 (critical security/correctness) → P1 (important) → P2 (nice-to-have).
4. Fix every issue in code, migrations, or docs.
5. Reply inline — never as a top-level comment:
   `gh api repos/MetaPhase-Consulting/dutystation/pulls/{N}/comments -f body="..." -F in_reply_to={comment_id}`
6. Commit, push, verify CI.
7. Never leave unreplied review comments on a PR marked ready.

## Release Gates

Every PR must be green on:

- `npm run typecheck`
- `npm run lint` (warnings allowed, errors not)
- `npm run test:run` (unit)
- `npm run test:a11y` (axe-core CLI on key routes)
- `npm run test:e2e` (Playwright smoke)
- `npm run build`
- `npm run test:audit` (npm audit prod, 0 vulns)
- `npm run data:validate:link-audit` (link-quality gate)

CI also runs CodeQL, gitleaks, Trivy, OWASP ZAP baseline, and Lighthouse CI as
warn-only (continue-on-error) so a flaky scan doesn't block release but regressions
still surface.

## Maintenance Rule

When the user gives process feedback, update this file and `AGENTS.md` together so
future sessions pick up the guidance.
