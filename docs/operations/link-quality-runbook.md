# Link Quality Runbook

## Purpose
Maintain reliability of external links (housing, schools, crime, weather, transit, moving resources) and provide transparent fallback behavior when links fail.

## Inputs
- Station links in `station_links` table (preferred)
- Fallback source: `src/data/dutyStations.ts`

## Commands
- Dry audit report (local/file output):
```bash
npm run data:audit:links
```
- Audit and sync status into Supabase:
```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:audit:links:sync
```
- Custom output path:
```bash
node scripts/data/audit-external-links.mjs --out docs/progress/link-audit-latest.json
```

## Result Artifacts
- JSON report file (default): `docs/progress/link-audit-latest.json`
- DB audit rows: `link_audit_results`
- Updated latest status on `station_links` (`is_valid`, `http_status`, `last_checked_at`)

## Classification Policy
- `200-399`: valid (`is_valid = true`)
- `404/410`: invalid (`is_valid = false`)
- `403/405/429`: unknown (rate-limited/blocked), keep as `is_valid = null`
- network timeout/error: unknown (`is_valid = null`)

## SLA and Response Targets
- Critical (broken core categories for multiple stations): triage within 1 business day
- Moderate (single station broken link): triage within 3 business days
- Unknown/rate-limited: recheck in next scheduled run; do not auto-remove

## UI Behavior Requirements
- For invalid or unknown links, UI shows warning text and still exposes source link.
- No silent failures; user always sees status context.

## Escalation
- If a provider blocks automation for 3 consecutive runs, classify as manual verification required.
- Document provider-specific exceptions in `docs/progress/status-log.md`.
