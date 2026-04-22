# Contributing to Duty Station Relocation

Thanks for your interest in contributing! This is an MIT-licensed open-source
CivicTech project maintained by [MetaPhase](https://metaphase.tech). We welcome
bug reports, feature suggestions, documentation improvements, and pull requests
from the public.

## Code of Conduct

Participation is governed by [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
Be respectful, assume good intent, and keep discussions focused on the work.

## Getting Set Up

See [`README.md`](./README.md) for the full local-setup instructions. In
brief:

```sh
nvm use                # picks Node 20 from .nvmrc
git clone https://github.com/MetaPhase-Consulting/dutystation.git
cd dutystation
npm install
npm run dev
```

The app falls back to a bundled dataset when Supabase env vars are absent, so
you can start contributing without any external credentials.

## Branch Workflow

- Branch off `dev` (not `main`). `main` is the Netlify production branch.
- Keep branch names short, descriptive, and professional
  (e.g., `map-marker-cluster`, `a11y-navbar-focus`, `docs-link-runbook`).
- Do not put `claude`, `codex`, or any AI model name in branch names,
  commit messages, PR titles, or PR bodies — commits and PRs are authored
  by humans only.
- Use [Conventional Commits](https://www.conventionalcommits.org/) format:
  `feat(scope): ...`, `fix(scope): ...`, `docs(scope): ...`, `chore(scope): ...`,
  `test(scope): ...`, `ci(scope): ...`, `deps(scope): ...`.
- Commit regularly; push regularly so your work stays backed up.

## Quality Gates

Every PR must pass the following locally before it's opened. CI re-runs
the same set.

```sh
npm run typecheck
npm run lint
npm run test:run            # Vitest + jest-axe unit tests
npm run test:a11y           # axe-core CLI on key routes
npm run test:e2e            # Playwright smoke (desktop + mobile)
npm run build               # production Vite build
npm run test:audit          # npm audit, 0 vulnerabilities required
npm run data:validate:link-audit
```

The pipeline also runs CodeQL, gitleaks, Trivy, OWASP ZAP baseline, and
Lighthouse CI as warn-only stages — your PR won't be blocked by a flaky
scan, but regressions surface in the PR status.

## Supabase Migrations

- Database changes go in `supabase/migrations/` as **new timestamped SQL
  files**. Never edit an existing migration or reset the remote database.
- Write RLS-aware SQL — every table enforces row-level security.
- Run migrations in CI only on merges to `dev` / `main`; don't push
  ad-hoc from your machine.

## Data Pipeline

External-link quality is a release gate. If you touch station data or
link records:

1. `npm run data:audit:links` — regenerate the audit report.
2. `npm run data:validate:link-audit` — confirm the quality thresholds
   still hold.
3. If you've added a new remediation pattern, update
   [`docs/operations/link-quality-runbook.md`](docs/operations/link-quality-runbook.md).

## Pull Requests

- PRs target `dev` unless you are a maintainer shipping to `main`.
- Include a short summary of what changed and why.
- Link related issues or roadmap items.
- Add a test plan (what you verified locally).
- A human reviewer must approve; all review conversations must be
  resolved before merge.
- No force-pushes to `dev` or `main`.
- No AI-authorship footers (`Co-Authored-By: Claude`,
  "Generated with Claude Code", etc.).

## Reporting Bugs

Open an issue with:

- What you were doing.
- What you expected to happen.
- What actually happened (include a screenshot or console output if
  relevant).
- Browser / OS / deploy (production, preview, local).

For **security issues**, follow [`SECURITY.md`](./SECURITY.md) instead of
opening a public issue.

---

Thanks for helping make this better.
