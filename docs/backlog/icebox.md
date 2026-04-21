# Icebox — Deferred Features

Ideas that were scoped out of the current build but may be worth revisiting.
Each entry should document *why it was deferred* so future maintainers don't
re-litigate the same trade-off from scratch.

## Incentive-eligible station flagging

**Status:** Deferred (removed from UI on `hardening/deps-and-testing`
branch in April 2026).

**What it would do:** Surface on each station a visible badge / filter for
CBP recruitment and retention incentives — the "hard-to-fill" duty locations
that carry an additional signing bonus (currently up to +$10K for remote
locations as part of the $60K total recruitment + retention package).

**Why deferred:** CBP does not publish a canonical, date-stamped current list
of hard-to-fill locations in a single public place. The most specific public
reference is reporting from a 2023/2024 recruitment push naming 8 stations
(Sierra Blanca TX, Presidio TX, Sanderson TX, Comstock TX, Lordsburg NM,
Freer TX, Hebbronville TX, Ajo AZ). After the program expanded to $60K in
late 2025, no updated station list has been published. USAJobs BPA postings
sometimes enumerate qualifying locations, but the set rotates per vacancy.

Without an authoritative current list, surfacing an incentive flag risks
actively misleading recruits — either omitting a station that is currently
eligible, or flagging one that is not. Both outcomes are worse than silence,
so the UI has been removed rather than shipped with unverified data.

**What was kept:** The underlying data schema (`station_attributes.incentive_eligible`,
`incentive_label`) and the repository-layer mapping are intact. Migrations
and types weren't touched. When an authoritative source is available, the
feature can be re-enabled by populating the data and restoring the UI
surface points below.

**UI surfaces to restore if re-enabled:**

- `src/components/directory/DirectoryFilters.tsx` — "Incentive" toggle switch.
- `src/pages/DirectoryPage.tsx` — `incentiveOnly` state + wiring into the
  filter call + tracking metadata.
- `src/pages/StationDetailPage.tsx` — incentive badge next to the station h1.
- `src/pages/ComparisonPage.tsx` — incentive badge on comparison cards.
- `src/components/directory/StationCard.tsx` — list-view badge.
- `src/components/StationMap.tsx` — incentive chip in the click-selected
  popup AND the gold ring highlight around incentive-eligible pins (see
  `createMarkerStyle`).
- `src/components/directory/MapLegend.tsx` — "Incentive" legend item.
- `src/lib/data/legacyStationData.ts` — `INCENTIVE_STATIONS` set + conditional
  assignment of `incentiveEligible` / `incentiveLabel`.
- `src/lib/data/stationFilters.ts` — `incentiveOnly` filter parameter and
  its corresponding test in `stationFilters.test.ts`.

**Required before re-enabling:**

1. Canonical source for the current hard-to-fill list (ideally from CBP HR
   or a CBP Careers page that can be cited and dated).
2. Refresh the list on a cadence that matches CBP's program updates.
3. Small-print caveat visible near any incentive badge ("Incentive status
   not guaranteed; confirm with your CBP recruiter") since CBP's designations
   can shift.

**References:**

- [DHS opens up new $60K bonuses for Border Patrol agents, other officers](https://www.govexec.com/pay-benefits/2025/12/dhs-opens-new-60k-bonuses-border-patrol-agents-other-officers/410271/) — Government Executive, Dec 2025
- [CBP recruitment incentives reach as high as $30,000](https://homelandprepnews.com/stories/81648-cbp-recruitment-incentives-reach-as-high-as-30000-for-new-border-patrol-agents/) — Homeland Prep News (source for the 8-station list)
- [Recruitment and Retention Incentives](https://careers.cbp.gov/s/applicant-resources/recruitment-and-retention-incentives) — CBP Careers
