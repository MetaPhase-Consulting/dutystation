-- DutyStation modernization schema (Phase 0/1)

create extension if not exists "pgcrypto";

create table if not exists public.stations (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  name text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  sector text not null,
  lat double precision not null,
  lng double precision not null,
  region text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.station_attributes (
  station_id uuid primary key references public.stations(id) on delete cascade,
  incentive_eligible boolean not null default false,
  incentive_label text,
  disclaimer_applies boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.position_types (
  code text primary key,
  label text not null,
  created_at timestamptz not null default now()
);

insert into public.position_types (code, label)
values
  ('CBPO', 'Customs and Border Protection Officer'),
  ('BPA', 'Border Patrol Agent'),
  ('AMO', 'Air and Marine Operations')
on conflict (code) do nothing;

create table if not exists public.station_positions (
  station_id uuid not null references public.stations(id) on delete cascade,
  position_type text not null references public.position_types(code),
  created_at timestamptz not null default now(),
  primary key (station_id, position_type)
);

create table if not exists public.station_links (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  category text not null check (category in ('realEstate', 'schools', 'crime', 'costOfLiving', 'weather', 'transit', 'movingTips')),
  url text not null,
  is_valid boolean,
  last_checked_at timestamptz,
  http_status integer,
  resolved_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (station_id, category)
);

create table if not exists public.recreation_resources (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations(id) on delete cascade,
  category text not null,
  name text not null,
  description text not null,
  url text not null,
  distance_miles numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.travel_resources (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('flight', 'car-rental', 'hotel', 'trip-planner')),
  name text not null,
  description text not null,
  url text not null,
  display_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name)
);

insert into public.travel_resources (category, name, description, url, display_order)
values
  ('flight', 'Expedia', 'Flight search and booking options for pre-academy travel planning.', 'https://www.expedia.com/', 1),
  ('hotel', 'Travelocity', 'Hotel and lodging options for pre-academy relocation travel.', 'https://www.travelocity.com/', 2),
  ('car-rental', 'Kayak', 'Rental car and transportation comparison across carriers.', 'https://www.kayak.com/', 3)
on conflict (name) do nothing;

create table if not exists public.link_audit_results (
  id uuid primary key default gen_random_uuid(),
  station_id uuid references public.stations(id) on delete cascade,
  category text,
  url text not null,
  status_code integer,
  is_valid boolean,
  response_time_ms integer,
  resolved_url text,
  checked_at timestamptz not null default now(),
  error_message text,
  source text not null default 'script'
);

create index if not exists idx_link_audit_results_checked_at on public.link_audit_results (checked_at desc);
create index if not exists idx_link_audit_results_station_id on public.link_audit_results (station_id);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  station_id uuid references public.stations(id) on delete set null,
  event_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_usage_events_event_name on public.usage_events (event_name);
create index if not exists idx_usage_events_created_at on public.usage_events (created_at desc);

create or replace view public.station_usage_summary as
select
  event_name,
  date_trunc('day', created_at) as event_day,
  count(*) as event_count
from public.usage_events
group by event_name, date_trunc('day', created_at);

alter table public.stations enable row level security;
alter table public.station_attributes enable row level security;
alter table public.station_positions enable row level security;
alter table public.position_types enable row level security;
alter table public.station_links enable row level security;
alter table public.recreation_resources enable row level security;
alter table public.travel_resources enable row level security;
alter table public.link_audit_results enable row level security;
alter table public.usage_events enable row level security;

create policy "Public read stations" on public.stations for select to anon using (true);
create policy "Public read station_attributes" on public.station_attributes for select to anon using (true);
create policy "Public read station_positions" on public.station_positions for select to anon using (true);
create policy "Public read position_types" on public.position_types for select to anon using (true);
create policy "Public read station_links" on public.station_links for select to anon using (true);
create policy "Public read recreation_resources" on public.recreation_resources for select to anon using (true);
create policy "Public read travel_resources" on public.travel_resources for select to anon using (true);

create policy "Public insert usage events" on public.usage_events for insert to anon with check (true);

-- link_audit_results remains service-role only for inserts/updates.
