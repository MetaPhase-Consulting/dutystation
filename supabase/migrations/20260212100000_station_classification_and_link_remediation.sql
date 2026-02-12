-- Station classification and link remediation metadata (Phase 2 completion)

alter table public.stations
  add column if not exists component_type text,
  add column if not exists facility_type text,
  add column if not exists source_type text,
  add column if not exists source_parent text,
  add column if not exists source_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'stations_component_type_check'
  ) then
    alter table public.stations
      add constraint stations_component_type_check
      check (component_type in ('USBP', 'OFO', 'AMO'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'stations_facility_type_check'
  ) then
    alter table public.stations
      add constraint stations_facility_type_check
      check (facility_type in ('Station', 'Port of Entry', 'Field Office', 'Sector', 'Other'));
  end if;
end $$;

update public.stations
set
  component_type = case
    when component_type in ('USBP', 'OFO', 'AMO') then component_type
    when coalesce(source_type, '') in ('Port of Entry', 'Field Office') then 'OFO'
    when lower(coalesce(name, '') || ' ' || coalesce(source_type, '') || ' ' || coalesce(source_parent, '')) ~ '(air|marine|amo)' then 'AMO'
    when coalesce(source_type, '') = 'Station'
      and (coalesce(source_parent, '') ilike '%sector%' or coalesce(sector, '') ilike '%sector%') then 'USBP'
    when coalesce(source_type, '') = 'Sector' or coalesce(sector, '') ilike '%sector%' then 'USBP'
    else 'OFO'
  end,
  facility_type = case
    when facility_type in ('Station', 'Port of Entry', 'Field Office', 'Sector', 'Other') then facility_type
    when coalesce(source_type, '') in ('Station', 'Port of Entry', 'Field Office', 'Sector') then source_type
    else 'Other'
  end;

alter table public.stations
  alter column component_type set default 'OFO',
  alter column component_type set not null,
  alter column facility_type set default 'Other',
  alter column facility_type set not null;

create index if not exists idx_stations_component_type on public.stations (component_type);
create index if not exists idx_stations_facility_type on public.stations (facility_type);

alter table public.station_links
  add column if not exists original_url text,
  add column if not exists is_remediated boolean not null default false,
  add column if not exists remediation_reason text,
  add column if not exists remediated_at timestamptz;

update public.station_links
set original_url = coalesce(original_url, url)
where original_url is null;
