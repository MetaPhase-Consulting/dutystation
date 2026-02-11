# Accessibility and Security Checklist

## Scope
Best-effort Phase 1 compliance baseline for Section 508, WCAG 2.1 AA, and security hardening requirements.

## Accessibility (508/WCAG 2.1 AA)
- [x] Search controls have explicit labels (`HomePage`, `NavBar`).
- [x] Interactive suggestion items use button semantics (keyboard operable).
- [x] Map has keyboard-accessible alternative list (`StationMap`).
- [x] Focusable controls use visible focus indicators via design system styles.
- [x] Core pages include headings and semantic landmarks.
- [x] Accessibility smoke test added (`src/pages/__tests__/HomePage.accessibility.test.tsx`).
- [ ] Full multi-page axe sweep (directory, detail, compare, data sources).
- [ ] Manual screen reader pass (VoiceOver/NVDA matrix).
- [ ] Formal color contrast audit report.

## Security Baseline
- [x] Input sanitization utility for search query handling (`stationFilters.ts`).
- [x] Security headers configured in Vite server config.
- [x] Dependency audit command added (`npm run audit:deps`).
- [x] CI security analysis configured (`.github/workflows/security.yml`, dependency audit/review).
- [x] DB access model uses RLS policies for public read paths.
- [x] Service-role key usage isolated to scripts, not frontend runtime.
- [ ] CSP hardening for production host environment (deployment-level).
- [ ] Secret scanning and CI policy enforcement beyond CodeQL/dependency audit.
- [ ] Threat model review for analytics and external link handling.

## Quality Gates
- [x] Unit/component tests passing.
- [x] Build successful.
- [x] Lint no errors.
- [x] CI workflow enforces lint/typecheck/test/build/audit.
- [ ] Browser/device matrix execution and evidence capture.

## Evidence Links
- `src/pages/__tests__/HomePage.accessibility.test.tsx`
- `src/lib/data/stationFilters.ts`
- `supabase/migrations/20260211090000_initial_modernization.sql`
- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`
- `docs/operations/link-quality-runbook.md`
- `docs/progress/status-log.md`
