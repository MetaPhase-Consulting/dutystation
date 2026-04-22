-- Area summary dashboards: precise address/geography per station + per-category
-- summary statistics (jsonb) so the station detail and compare pages can show
-- inline data (avg temp, median home price, violent crime rate, etc.) rather
-- than only linking out.

alter table public.stations
  add column if not exists street_address text,
  add column if not exists street_address_2 text,
  add column if not exists precise_lat double precision,
  add column if not exists precise_lng double precision,
  add column if not exists address_geocoded_at timestamptz,
  add column if not exists address_geocode_source text,
  add column if not exists county_name text,
  add column if not exists county_fips text,
  add column if not exists place_name text,
  add column if not exists place_fips text;

-- Seed precise_lat/lng from the existing city-level lat/lng so downstream code
-- can read precise_* as the source of truth; the scraper will overwrite with
-- Census-geocoder results as it runs.
update public.stations
set
  precise_lat = coalesce(precise_lat, lat),
  precise_lng = coalesce(precise_lng, lng)
where lat is not null and lng is not null;

create index if not exists idx_stations_county_fips on public.stations (county_fips);
create index if not exists idx_stations_place_fips on public.stations (place_fips);

-- Extend the station_links category CHECK to include the three new categories
-- that will also have summaries. The original constraint was inline + unnamed,
-- so resolve its system name and drop it before re-adding.
do $$
declare
  existing_constraint text;
begin
  select conname into existing_constraint
  from pg_constraint
  where conrelid = 'public.station_links'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%category%in%realEstate%';

  if existing_constraint is not null then
    execute format('alter table public.station_links drop constraint %I', existing_constraint);
  end if;

  alter table public.station_links
    add constraint station_links_category_check
    check (category in (
      'realEstate', 'schools', 'crime', 'costOfLiving',
      'weather', 'transit', 'movingTips',
      'demographics', 'healthcare', 'jobs'
    ));
end $$;

create table if not exists public.station_category_summaries (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  category text not null check (category in (
    'realEstate', 'schools', 'crime', 'costOfLiving',
    'weather', 'transit',
    'demographics', 'healthcare', 'jobs'
  )),
  area_scope text not null check (area_scope in (
    'zip', 'county', 'place', 'msa', 'radius', 'custom'
  )),
  area_value text not null,
  area_key text,
  radius_miles numeric,
  summary_data jsonb not null,
  data_source text not null,
  source_url text,
  fetched_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (station_id, category)
);

create index if not exists idx_station_category_summaries_station
  on public.station_category_summaries (station_id);

create index if not exists idx_station_category_summaries_category
  on public.station_category_summaries (category);

-- Keep updated_at in sync for upserts that don't specify it.
create or replace function public.touch_station_category_summaries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_station_category_summaries_updated_at
  on public.station_category_summaries;

create trigger trg_station_category_summaries_updated_at
  before update on public.station_category_summaries
  for each row
  execute function public.touch_station_category_summaries_updated_at();

-- RLS: public SELECT (this is public-facing data); writes go through the
-- service role client in scripts/data/, which bypasses RLS.
alter table public.station_category_summaries enable row level security;

drop policy if exists "Public read station_category_summaries"
  on public.station_category_summaries;

create policy "Public read station_category_summaries"
  on public.station_category_summaries
  for select
  to anon
  using (true);
