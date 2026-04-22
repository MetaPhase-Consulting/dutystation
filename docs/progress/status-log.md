# DutyStation Progress Log

## 2026-02-11
### Completed
- Implemented Supabase migration schema with RLS and analytics/link-audit tables.
- Added typed station domain model at `src/types/station.ts`.
- Added repository abstraction and Supabase/local fallback data access in `src/lib/data/stationRepository.ts`.
- Added data automation scripts:
  - `scripts/data/export-duty-stations-json.mjs`
  - `scripts/data/seed-supabase.mjs`
  - `scripts/data/audit-external-links.mjs`
  - `scripts/data/enrich-from-csv.mjs`
- Added feature enhancements:
  - Incentive badge + incentive-only filter
  - Position toggles (CBPO/BPA/AMO)
  - Map hover labels + keyboard-accessible pin list
  - Disclaimer on station detail and data pages
  - Travel resources section
  - Recreation info section
  - Link health messaging for unverified/unavailable links
- Strengthened tests:
  - Added station filter tests
  - Added station detail feature test
  - Added accessibility test using axe
  - Updated existing tests for QueryClient provider
- Fixed lint-blocking errors in shared UI files and tailwind config.
- Provisioned Supabase project and executed remote rollout:
  - Project ref: `xpaoufzwerburtieotxg` (region `us-east-1`)
  - `supabase link` completed
  - `supabase db push` applied migration `20260211090000_initial_modernization.sql`
  - `npm run data:seed:supabase` completed against remote DB (129-station baseline)
  - `npm run data:enrich:csv:sync` completed (CSV expansion and sync)
  - `npm run data:audit:links:sync` completed after expansion (4,165 station links audited and synchronized)
- Added CI/CD and automation workflows:
  - `.github/workflows/ci.yml` (lint/typecheck/test/build/audit)
  - `.github/workflows/security.yml` (dependency audit + dependency review)
  - `.github/workflows/cd.yml` (GitHub Pages deployment)
  - `.github/workflows/db-migrations.yml` (Supabase migration push)
  - `.github/workflows/data-maintenance.yml` (scheduled link audit + enrichment sync)
  - `.github/dependabot.yml`

### Current Quality Baseline
- `npm run test:run` passes (38 tests).
- `npm run build` passes.
- `npm run lint` passes with warnings only (no errors).
- `npm run typecheck` passes.
- `npm audit --json` reports zero vulnerabilities.
- External link audit baseline generated at `docs/progress/link-audit-latest.json`:
  - 4,165 checked links
  - 2,375 unique URLs
  - 3,247 valid, 153 invalid, 765 unknown/rate-limited

### Remote Data Verification (`xpaoufzwerburtieotxg`)
- stations: 595
- station_attributes: 595
- station_positions: 691
- station_links: 4,165
- recreation_resources: 825
- travel_resources: 3
- link_audit_results: 6,068

### Blockers / Risks
- External providers can rate-limit link checks; runbook defines handling policy.
- Official position-type mapping per station is still partially inferred and should be refined with authoritative data sources.
- CSV enrichment geocoding relies on third-party geocoding and fallback centroids when unavailable.

### Next Actions
- Add additional automated accessibility checks for directory/detail/compare pages.
- Run manual browser/device verification matrix and record results in compliance docs.
- Refine external-link generation rules for station-level accuracy where providers support deep links.
- Add nearby-community (100-mile) data model and ingestion path for future phase alignment.

## 2026-02-19
### Completed
- Implemented CBP-wide classification and UI support:
  - Added component/facility model support (USBP/OFO/AMO and Station/Port/Field Office taxonomy) in DB and app types.
  - Added primary component toggles in directory and compare flows.
  - Added component and facility badges on cards/detail/compare.
- Switched directory UX to map-first:
  - Default view is map.
  - Increased map prominence and added map legend + incentive ring styling.
  - Preserved keyboard-accessible location list for non-pointer workflows.
- Finalized legal/disclaimer architecture:
  - Added centralized legal copy source (`src/content/legal.ts`).
  - Rendered legal block on station detail and data-sources pages only.
- Added link remediation workflow and policy enforcement:
  - Added remediation metadata fields on `station_links`.
  - Added automated remediation script (`scripts/data/remediate-links.mjs`).
  - Added audit validation script (`scripts/data/validate-link-audit.mjs`) for fallback-category hard-fail thresholding.
  - Updated scheduled GitHub workflow to run remediation -> audit -> policy validation -> enrichment.
- Modernized CBP-wide language and resource reliability defaults:
  - Updated home/nav/search copy to “CBP duty locations”.
  - Updated data-sources references to stable fallback providers (USA.gov moving, weather.gov, NCES, City-Data, Google Maps transit).
- Expanded automated test coverage:
  - Added integration tests for map-first directory rendering and component filtering.
  - Added legal rendering test for data-sources page.
  - Updated app/home/layout tests for revised CBP-wide copy.
- Added governance documentation package aligned to engineering harness best practices:
  - `docs/governance/engineering-harness-standard.md`
  - `docs/governance/release-gates-and-slos.md`
  - Updated `README.md` documentation index
- Resolved open GitHub Dependabot runtime alert for `minimatch` (`GHSA-3ppc-4f35-3m26`) by:
  - moving `tailwindcss-animate` from runtime dependencies to dev-only scope
  - upgrading lint toolchain packages and lockfile (`eslint`, `typescript-eslint`, related plugins)
  - confirming no runtime `minimatch` path remains (`npm ls minimatch --omit=dev`)
  - confirming production dependency audit is clean (`npm audit --omit=dev`)

### Current Quality Baseline
- `npm run test:run` passes (43 tests).
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm run lint` passes with warnings only (no errors).
- Link remediation + audit status (`docs/progress/link-remediation-latest.json`, `docs/progress/link-audit-latest.json`):
  - 851 remediations applied
  - 4,165 links checked
  - 1,824 unique URLs
  - 3,525 valid, 0 invalid, 640 unknown
  - 0 unresolved hard failures in fallback categories (`data:validate:link-audit`)

### Remote Data Verification (`xpaoufzwerburtieotxg`)
- stations: 595
- station_links: 4,165
- component distribution: OFO 266, USBP 232, AMO 97
- facility distribution includes OFO field offices and ports:
  - Port of Entry: 339
  - Field Office: 20
  - Station: 103
  - Sector: 4
  - Other: 129

### Remaining Gaps
- Full manual browser/device matrix evidence still pending in compliance checklist.
- Formal external legal counsel review of disclaimer text is still pending.
- Accessibility hardening for all page-level interaction paths requires additional manual verification.
