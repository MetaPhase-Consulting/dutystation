-- Add Core-Based Statistical Area (CBSA / Metropolitan Statistical Area)
-- identifiers to each station so MSA-level enrichers (BEA Regional Price
-- Parities, future HUD FMR rollups, etc.) can map a station to its metro
-- without re-deriving the crosswalk on every run.
--
-- Backfill is performed by scripts/data/backfill-cbsa.mjs using the
-- scripts/data/static/county-cbsa.mjs crosswalk (built from the U.S.
-- Census OMB delineation file). Stations whose county is non-metro
-- (Micropolitan or unaffiliated) keep cbsa_code null, and downstream
-- enrichers must fall back to state-level data for those rows.

alter table public.stations
  add column if not exists cbsa_code text,
  add column if not exists cbsa_title text;

create index if not exists idx_stations_cbsa_code on public.stations (cbsa_code);
