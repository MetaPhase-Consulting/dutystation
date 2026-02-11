# Requirements Traceability Matrix

## Legend
- Status: `Done`, `In Progress`, `Planned`
- Evidence paths point to implementation artifacts in this repository.

| Requirement Source | Requirement Summary | Implementation Artifact(s) | Validation Evidence | Status |
|---|---|---|---|---|
| RFI §2 | Community info by location with search/filter | `src/pages/DirectoryPage.tsx`, `src/lib/data/stationFilters.ts` | `src/lib/data/stationFilters.test.ts` | Done |
| RFI §2 | Compare communities | `src/pages/ComparisonPage.tsx` | `npm run test:run` | Done |
| RFI §3 Navigation | Intuitive navigation and search | `src/components/NavBar.tsx`, `src/pages/HomePage.tsx` | `src/pages/__tests__/HomePage.test.tsx` | Done |
| RFI §3 Load time | Optimize loading/performance | `vite.config.ts`, lazy data fetch via React Query | `npm run build` bundle output | In Progress |
| RFI §3 Browser consistency | Major browser support | Responsive React/Tailwind architecture | Manual matrix in checklist | Planned |
| RFI §3 Forms usability | Clear labels/errors/validation | Search inputs updated with labels and keyboard interaction | HomePage tests | In Progress |
| RFI §3 Reporting | Usage metrics and reporting | `supabase/migrations/20260211090000_initial_modernization.sql`, `src/lib/data/usageTracking.ts` | DB schema + event insert path | In Progress |
| RFI §3 Accessibility | 508 + WCAG 2.1 support | `src/components/StationMap.tsx`, keyboard-accessible list, semantic labels | `src/pages/__tests__/HomePage.accessibility.test.tsx` | In Progress |
| RFI §3 Mobile compatibility | Responsive experience | Tailwind responsive layouts in pages/components | Build/test baseline | Done |
| RFI §3 Clickable links/buttons | Visual click affordances | Existing card/button/link styling + states | UI tests and review | Done |
| RFI §3 Security/privacy | Baseline security standards | `vite.config.ts`, dependency audit script, sanitization in `stationFilters` | `npm run audit:deps` | In Progress |
| SOW §3.5 | Section 508/WCAG 2.1 AA | `docs/compliance/accessibility-security-checklist.md` + incremental fixes | Accessibility test + checklist | In Progress |
| SOW §3.12 | Cybersecurity requirements | Security headers + dependency audit + runbook docs | lint/build/test + checklist | In Progress |
| SOW §3.13/4 | Database operations and BI reporting | Supabase schema (`usage_events`, views, link audits) | migration SQL committed | Done |
| SOW §4 | Third-party API/resource integration | External resource links + travel resources + link quality metadata | station detail UX + audit script | Done |
| SOW §4 | Customer feedback system | (Not yet implemented in UI) | Planned backlog item | Planned |
| SOW §4 | Cross-browser test results | Pending formal browser matrix run | Checklist placeholder | Planned |
| SOW §4 | Training/documentation | Docs suite under `docs/` | Docs present and versioned | In Progress |
| Client Request | Incentive highlighting | `src/components/directory/StationCard.tsx`, `src/pages/StationDetailPage.tsx` | UI + tests | Done |
| Client Request | Pin hover name | `src/components/StationMap.tsx` tooltip overlay | Manual validation in map view | Done |
| Client Request | CBP relocation disclaimer | `src/pages/StationDetailPage.tsx`, `src/pages/DataSourcesPage.tsx` | Station detail test | Done |
| Client Request | Position toggles | `src/components/directory/DirectoryFilters.tsx`, `src/pages/ComparisonPage.tsx` | Filter tests | Done |
| Client Request | Travel links | `src/lib/data/legacyStationData.ts`, `src/pages/StationDetailPage.tsx` | Station detail test | Done |
| Client Request | Recreation info | `src/lib/data/legacyStationData.ts`, `src/pages/StationDetailPage.tsx` | Station detail test | Done |
| Client Request | External link reliability | `scripts/data/audit-external-links.mjs`, `station_links` metadata fields | audit report + runbook | Done |

## Open Items
- Full 508/WCAG AA conformance audit is not complete yet.
- Nearby-community radius (100 miles) model is scheduled for expansion phase.
- Feedback form and formal help desk workflow remain planned.
