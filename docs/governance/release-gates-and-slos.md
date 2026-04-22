# Release Gates and SLO Policy

## Purpose
Define a release gate model that balances delivery speed with mission-critical quality.

## Gate Model

### Gate A: Build Integrity (Required)
- `npm run typecheck`
- `npm run lint`
- `npm run test:run`
- `npm run build`

### Gate B: Security and Dependency Hygiene (Required)
- Dependency audit workflow green.
- Dependency review green for PRs.

### Gate C: Data Integrity (Required for data-affecting releases)
- Link remediation run completed.
- Link audit completed and synchronized.
- Validation script passes:
  - `npm run data:validate:link-audit -- --report docs/progress/link-audit-latest.json --maxUnknownRate 0.35`
- Zero unresolved hard-fails for fallback categories.

### Gate D: Compliance Evidence (Required for production release)
- Accessibility/security checklist updated with current evidence.
- Requirements traceability matrix updated.
- Progress status log updated.

## SLOs (Initial Targets)
1. Critical path availability (home -> directory -> detail -> compare):
- Target: 99.5% monthly availability.

2. Blocking runtime error rate:
- Target: < 1% of sessions.

3. External resource hard-fail rate for fallback categories:
- Target: 0 unresolved hard-fails after remediation cycle.

4. Accessibility regressions in automated checks:
- Target: 0 new critical violations.

## Error Budget Policy
- If any SLO budget is exhausted:
  - Freeze non-critical feature work.
  - Prioritize reliability/security/accessibility fixes.
  - Re-open feature work only after two consecutive green validation cycles.

## Release Checklist
1. CI green and release candidate built.
2. Data maintenance run completed and artifacts refreshed.
3. Compliance docs updated.
4. Rollback plan validated for migration-bearing release.
5. Release note includes:
- Scope of changes
- Known risks
- Follow-up tasks

## Repository Evidence Paths
- `/Users/bfunk/Documents/GitHub/dutystation/.github/workflows/ci.yml`
- `/Users/bfunk/Documents/GitHub/dutystation/.github/workflows/security.yml`
- `/Users/bfunk/Documents/GitHub/dutystation/.github/workflows/data-maintenance.yml`
- `/Users/bfunk/Documents/GitHub/dutystation/docs/progress/link-audit-latest.json`
- `/Users/bfunk/Documents/GitHub/dutystation/docs/progress/link-remediation-latest.json`
- `/Users/bfunk/Documents/GitHub/dutystation/docs/compliance/accessibility-security-checklist.md`
- `/Users/bfunk/Documents/GitHub/dutystation/docs/requirements/traceability-matrix.md`
