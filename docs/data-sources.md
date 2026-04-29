# Data Sources & Provenance

This document records every third-party data source used by the Phase 3
summary enrichment pipeline. Each entry covers what we extract, where
the upstream is, the licensing or terms-of-service status, the refresh
cadence we run on, and the fallback we use when the source is
unavailable. The rendered `/data-sources` page on dutystation.us links
here for the full picture; the cards on that page are intentionally
shorter for readability.

## Polite-fetch policy

All outbound HTTP from `scripts/data/` flows through
`scripts/data/lib/polite-fetch.mjs`, which enforces:

- **User-Agent**: `dutystation-enrichment/1.0 (+https://dutystation.us/data-sources)`
  — allow-listed in `public/robots.txt`.
- **Per-host throttle**: 1 request / 500 ms by default, configurable
  per source. Most public APIs we hit explicitly permit this rate.
- **Exponential backoff**: 3 retries on 429 / 5xx with jitter, capped
  at 30 s.
- **robots.txt honor**: opt-in via `honorRobots: true` for HTML
  scraping targets. Cached per host for 24 h.
- **ETag caching**: every successful response is written to
  `scripts/data/.cache/<host>/<sha1(url)>.json` with the ETag header,
  and subsequent requests revalidate with `If-None-Match`. The cache
  directory is gitignored.
- **POST cacheKey**: `politeFetch(url, { method: "POST", body, cacheKey })`
  uses the `cacheKey` to dedupe distinct payloads to the same URL
  (used by the BLS BLS POST-only API).

Per-source TTLs (used by `politeFetch(url, { ttlMs })`) are noted in each
section below.

## Address enrichment — U.S. Census Bureau Geocoder

- **What we extract**: `precise_lat`, `precise_lng`, `county_name`,
  `county_fips`, `place_name`, `place_fips` for each station, written
  to the `stations` table.
- **Endpoint**: `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress`
  (benchmark `Public_AR_Current`, vintage `Current_Current`; falls back
  to `Public_AR_Census2020` / `Census2020_Current`).
- **Auth**: none.
- **License / ToS**: U.S. government public domain (17 USC § 105).
  Census's own ToS asks for reasonable rate limits — we send ≤4
  requests/sec.
- **Refresh**: yearly, manual rerun of `npm run data:enrich:addresses:apply`.
  Address data does not move quickly.
- **Fallback when no match**: `supabase/seed/address-overrides.json` —
  hand-curated entries keyed by station `legacy_id`. Used for AMO
  airbases on military land and similar addresses Census cannot resolve.

## Demographics — U.S. Census American Community Survey (5-year)

- **What we extract**: `population`, `medianAge`, `medianHouseholdIncome`,
  `householdSize`, `pctEnglishOnly`.
- **Endpoint**: `https://api.census.gov/data/2022/acs/acs5`
- **Variables**: `B01003_001E`, `B01002_001E`, `B19013_001E`,
  `B25010_001E`, `B16001_001E`, `B16001_002E`.
- **Auth**: free `CENSUS_API_KEY` from
  https://api.census.gov/data/key_signup.html (instant, email-based).
- **License / ToS**: U.S. government public domain. Census API ToS
  permits non-commercial and commercial use with attribution.
- **Refresh cadence**: yearly when ACS publishes (mid-December).
  Cache TTL: 1 year.
- **Granularity**: place when the station has a `place_fips`, otherwise
  county.
- **Stripped from public source URL**: `key=` query parameter.

## Real estate — U.S. Census ACS housing tables

- **What we extract**: `medianHomePrice`, `medianRent2br`. `pricePerSqft`
  and `yoyChangePct` stay null — neither is published in ACS at
  place / county granularity.
- **Endpoint**: same `acs5` API as demographics.
- **Variables**: `B25077_001E` (median home value),
  `B25031_004E` (median 2-bedroom rent), `B25064_001E` (overall
  median gross rent — fallback when 2-br is suppressed).
- **Auth**: same `CENSUS_API_KEY`.
- **License / ToS / refresh / fallback**: same as demographics.
- **Considered & deferred**: Realtor.com county-level RDC dataset for
  `pricePerSqft` and `yoyChangePct`. Pending review of Realtor.com ToS
  for automated access; will land in a follow-up if cleared.

## Crime — FBI Crime Data Explorer (CDE)

- **What we extract**: `violentPer100k`, `propertyPer100k`,
  `usViolentPer100k`, `usPropertyPer100k`, `safetyIndex0to100`,
  `asOfYear`.
- **Endpoint**: `https://api.usa.gov/crime/fbi/cde/estimate/state/<STATE>`
  and `/estimate/national`.
- **Auth**: free `DATA_GOV_API_KEY` from https://api.data.gov/signup/
  (instant, email-based — same key works for any agency proxied through
  api.data.gov).
- **License / ToS**: U.S. government public domain.
- **Refresh**: yearly, ~9 months in arrears. Cache TTL: 90 days.
- **Granularity**: state. County-level rollups in CDE require
  aggregating per-agency NIBRS reports, which is unreliable when
  reporting is incomplete.
- **safetyIndex0to100**: derived from the state vs. national ratio.
  Not a clinical measure — purely a UX hint, documented as such in
  `src/types/station.ts`.

## Cost of living — BEA Regional Price Parities (RPPs)

- **What we extract**: `overallIndexUs100`, `housingIndex` (rents).
  `groceriesIndex`, `utilitiesIndex`, `transportIndex` stay null;
  BEA RPPs do not break those out at the state level.
- **Endpoint**: `https://apps.bea.gov/api/data` (dataset `Regional`,
  table `SARPP`).
- **Auth**: free `BEA_API_KEY` from https://apps.bea.gov/API/signup/
  (instant, email-based).
- **License / ToS**: U.S. government public domain.
- **Refresh**: yearly, ~18 months in arrears. Cache TTL: 90 days.
- **Granularity**: state. BEA does not publish county-level RPPs;
  we tag `area_scope = "custom"` with the 2-digit state FIPS so the
  scope is unambiguous in the database.
- **Stripped from public source URL**: `UserID=` parameter.

## Jobs — BLS Local Area Unemployment Statistics (LAUS)

- **What we extract**: `unemploymentRate`, `laborForce`. `topIndustries`
  and `medianWageAll` stay null — they need additional series (QCEW
  by NAICS code, OEWS) and a more involved aggregation.
- **Endpoint**: `https://api.bls.gov/publicAPI/v2/timeseries/data/`
  (POST).
- **Series**:
  - `LAUCN<5-digit-county-fips>0000000003` — unemployment rate %
  - `LAUCN<5-digit-county-fips>0000000006` — labor force count
- **Auth**: free `BLS_API_KEY` from
  https://data.bls.gov/registrationEngine/ (instant, email-based).
  Raises the daily quota from 25 to 500 requests.
- **License / ToS**: U.S. government public domain. BLS ToS expects
  attribution and reasonable rate limits.
- **Refresh**: monthly (LAUS publishes a few weeks after each month).
  Cache TTL: 30 days.
- **Granularity**: county.

## Healthcare — HIFLD Hospitals (FEMA / GeoPlatform)

- **What we extract**: `hospitalsWithin25mi`, `nearestHospitalName`,
  `nearestHospitalMi`. `nearestVaMi` stays null (VA Facilities API
  now requires a developer key from developer.va.gov; that's a
  follow-up enricher).
- **Endpoint**:
  `https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Hospitals/FeatureServer/0/query`
- **Auth**: none. ArcGIS service is publicly readable.
- **License / ToS**: HIFLD aggregates state license rolls + Medicare
  provider data; CC0 / public domain.
- **Refresh**: HIFLD updates the dataset roughly twice a year. Cache
  TTL: 90 days.
- **Granularity**: ≤25 mi radius around each station's precise lat/lng,
  computed in-memory after a single fetch of the full U.S. dataset.

## Transit — FAA NPIAS commercial-service airports (curated subset)

- **What we extract**: `nearestAirportIata`, `airportDistanceMi`.
  `walkScore`, `transitScore`, `bikeScore` stay null — the only
  authoritative source is Walk Score's paywalled partner API.
- **Source**: hand-curated list at `scripts/data/static/us-airports.mjs`,
  derived from the FAA's National Plan of Integrated Airport Systems
  (NPIAS): https://www.faa.gov/airports/planning_capacity/npias/
- **Auth**: none. Pure local computation.
- **License**: FAA NPIAS data is U.S. government public domain.
- **Refresh**: manual when the FAA publishes a new NPIAS edition
  (every 2 years). The list of major commercial airports rarely
  changes.
- **Granularity**: nearest single airport by great-circle distance.

## Schools — NCES Common Core of Data via Urban Institute

- **What we extract**: `numK12`, `numDistricts`, `studentTeacherRatio`.
  `avgRating0to10` stays null (no free quality-rating source —
  GreatSchools' API is paid). `gradRatePct` is a follow-up via the
  ACGR endpoint.
- **Endpoint**: `https://educationdata.urban.org/api/v1/schools/ccd/directory/<year>/`
- **Auth**: none. Urban Institute Education Data Portal is a free
  no-key wrapper over the NCES public CCD files.
- **License / ToS**: NCES underlying data is U.S. government public
  domain. Urban Institute's wrapper requires attribution.
- **Refresh**: yearly, ~18 months after the academic year. Cache TTL:
  1 year.
- **Granularity**: county.

## Weather — NOAA NCEI Climate Normals 1991-2020

- **What we extract**: `avgHighF`, `avgLowF`, `summerHighF`,
  `winterLowF`, `annualPrecipIn`, `annualSnowIn`, `climateLabel`.
  `sunnyDays` stays null — NCEI does not publish it in `NORMAL_MLY`.
- **Endpoint**: `https://www.ncei.noaa.gov/cdo-web/api/v2/`
  - `/stations` to find the nearest weather station that publishes
    monthly normals.
  - `/data?datasetid=NORMAL_MLY` to fetch the monthly normals.
- **Datatypes**: `MLY-TMAX-NORMAL`, `MLY-TMIN-NORMAL`,
  `MLY-PRCP-NORMAL`, `MLY-SNOW-NORMAL`.
- **Auth**: free `NOAA_CDO_TOKEN` from
  https://www.ncdc.noaa.gov/cdo-web/token (instant, email-based).
- **License / ToS**: U.S. government public domain. NCEI rate limits
  to 5 req/sec, 1000 req/day.
- **Refresh**: every ~10 years (the 1991-2020 normals are stable until
  the 2001-2030 release in 2031). Cache TTL: 1 year.
- **Granularity**: nearest weather station; we record the station ID
  and distance.
- **climateLabel**: a Köppen-light classification derived from
  summer high, winter low, and precipitation. Documented as a UX
  hint, not a climatological label.

## Compliance posture

- Every key API is free, government-issued, and instant-signup. No
  paid sources are wired into the default pipeline.
- All API keys are stripped from `source_url` before persisting to
  `station_category_summaries`, so the audit gate at
  `data:audit:links` cannot leak credentials.
- Two HTML-scraping fallbacks (Realtor.com for real estate,
  BestPlaces for cost of living) are *not* wired in v1 — they will
  only land if the per-source ToS review clears them. The
  `scripts/data/lib/polite-fetch.mjs` module has the `honorRobots`
  hook ready when those fallbacks are enabled.
- `npm run data:audit:links` validates every `source_url` we record
  here every Sunday in CI; broken upstream URLs surface in
  `docs/progress/link-audit-latest.json`.
