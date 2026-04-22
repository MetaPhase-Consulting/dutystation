import { legacyStations, DEFAULT_TRAVEL_RESOURCES } from "@/lib/data/legacyStationData";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  ComponentType,
  DutyStation,
  FacilityType,
  RecreationResource,
  STATION_LINK_CATEGORIES,
  StationLink,
  TravelResource,
} from "@/types/station";

interface StationRow {
  legacy_id: string;
  name: string;
  city: string;
  state: string;
  zip_code: string;
  sector: string;
  lat: number;
  lng: number;
  region: string;
  description: string;
  component_type: ComponentType | null;
  facility_type: FacilityType | null;
  source_type: string | null;
  source_parent: string | null;
  source_url: string | null;
  station_attributes:
    | {
        incentive_eligible: boolean;
        incentive_label: string | null;
        disclaimer_applies: boolean;
      }[]
    | {
        incentive_eligible: boolean;
        incentive_label: string | null;
        disclaimer_applies: boolean;
      }
    | null;
  station_positions: Array<{ position_type: "CBPO" | "BPA" | "AMO" }> | null;
  station_links:
    | Array<{
        category: string;
        url: string;
        original_url: string | null;
        is_remediated: boolean | null;
        remediation_reason: string | null;
        remediated_at: string | null;
        is_valid: boolean | null;
        last_checked_at: string | null;
        http_status: number | null;
        resolved_url: string | null;
      }>
    | null;
  recreation_resources:
    | Array<{
        id: string;
        category: string;
        name: string;
        description: string;
        url: string;
        distance_miles: number | null;
      }>
    | null;
}

interface TravelResourceRow {
  id: string;
  category: TravelResource["category"];
  name: string;
  description: string;
  url: string;
  display_order: number;
}

function createDefaultLinks(): Record<(typeof STATION_LINK_CATEGORIES)[number], StationLink> {
  return STATION_LINK_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = {
        category,
        url: "",
        originalUrl: null,
        isRemediated: false,
        remediationReason: null,
        remediatedAt: null,
        isValid: null,
        lastCheckedAt: null,
        statusCode: null,
        resolvedUrl: null,
      };

      return acc;
    },
    {} as Record<(typeof STATION_LINK_CATEGORIES)[number], StationLink>
  );
}

function mapRecreationRows(rows: StationRow["recreation_resources"]): RecreationResource[] {
  if (!rows?.length) {
    return [];
  }

  return rows.map((resource) => ({
    id: resource.id,
    category: resource.category,
    name: resource.name,
    description: resource.description,
    url: resource.url,
    distanceMiles: resource.distance_miles,
  }));
}

// Supabase currently holds two seed imports of the same stations: a short-id
// seed ("presidio-station") and a longer CBP-prefixed seed
// ("cbp-presidio-station-tx-79845"). ~100 stations exist under both ids,
// which would otherwise render as duplicate dropdown entries. Prefer the
// short id when both exist because that's the id pattern the app's URL
// routing + sitemap already use.
//
// Long-term fix: clean up the Supabase stations table so only one seed
// remains. Tracked in docs/backlog/icebox.md.
function dedupeByNameCityState(stations: DutyStation[]): DutyStation[] {
  const byKey = new Map<string, DutyStation>();
  for (const station of stations) {
    const key = `${station.name}|${station.city}|${station.state}`.toLowerCase();
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, station);
      continue;
    }
    // Prefer the non-"cbp-" id (the short legacy-id pattern the app routes on).
    const existingIsCbp = existing.id.startsWith("cbp-");
    const incomingIsCbp = station.id.startsWith("cbp-");
    if (existingIsCbp && !incomingIsCbp) {
      byKey.set(key, station);
    }
  }
  return Array.from(byKey.values());
}

function mapStationRow(row: StationRow): DutyStation {
  const links = createDefaultLinks();

  row.station_links?.forEach((link) => {
    if (!STATION_LINK_CATEGORIES.includes(link.category as (typeof STATION_LINK_CATEGORIES)[number])) {
      return;
    }

    const category = link.category as (typeof STATION_LINK_CATEGORIES)[number];
    links[category] = {
      category,
      url: link.url,
      originalUrl: link.original_url,
      isRemediated: Boolean(link.is_remediated),
      remediationReason: link.remediation_reason,
      remediatedAt: link.remediated_at,
      isValid: link.is_valid,
      statusCode: link.http_status,
      lastCheckedAt: link.last_checked_at,
      resolvedUrl: link.resolved_url,
    };
  });

  const attributes = (Array.isArray(row.station_attributes)
    ? row.station_attributes[0]
    : row.station_attributes) ?? {
    incentive_eligible: false,
    incentive_label: null,
    disclaimer_applies: true,
  };

  const positionTypes =
    row.station_positions?.map((position) => position.position_type).filter(Boolean) ?? ["BPA"];

  return {
    id: row.legacy_id,
    name: row.name,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    sector: row.sector,
    lat: row.lat,
    lng: row.lng,
    region: row.region,
    description: row.description,
    componentType: row.component_type ?? "USBP",
    facilityType: row.facility_type ?? "Station",
    sourceType: row.source_type,
    sourceParent: row.source_parent,
    sourceUrl: row.source_url,
    positionTypes,
    attributes: {
      incentiveEligible: Boolean(attributes.incentive_eligible),
      incentiveLabel: attributes.incentive_label,
      disclaimerApplies: Boolean(attributes.disclaimer_applies),
    },
    links,
    recreation: mapRecreationRows(row.recreation_resources),
  };
}

export interface StationRepository {
  getStations: () => Promise<DutyStation[]>;
  getStationById: (id: string) => Promise<DutyStation | null>;
  getTravelResources: () => Promise<TravelResource[]>;
}

class LocalStationRepository implements StationRepository {
  async getStations(): Promise<DutyStation[]> {
    return legacyStations;
  }

  async getStationById(id: string): Promise<DutyStation | null> {
    return legacyStations.find((station) => station.id === id) ?? null;
  }

  async getTravelResources(): Promise<TravelResource[]> {
    return DEFAULT_TRAVEL_RESOURCES;
  }
}

class SupabaseStationRepository implements StationRepository {
  private readonly localRepository = new LocalStationRepository();

  async getStations(): Promise<DutyStation[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return this.localRepository.getStations();
    }

    const { data, error } = await supabase
      .from("stations")
      .select(
        `
        legacy_id,
        name,
        city,
        state,
        zip_code,
        sector,
        lat,
        lng,
        region,
        description,
        component_type,
        facility_type,
        source_type,
        source_parent,
        source_url,
        station_attributes(incentive_eligible,incentive_label,disclaimer_applies),
        station_positions(position_type),
        station_links(category,url,original_url,is_remediated,remediation_reason,remediated_at,is_valid,last_checked_at,http_status,resolved_url),
        recreation_resources(id,category,name,description,url,distance_miles)
      `
      )
      .order("name", { ascending: true });

    if (error || !data) {
      console.warn("Falling back to local station data", error?.message);
      return this.localRepository.getStations();
    }

    return dedupeByNameCityState((data as StationRow[]).map(mapStationRow));
  }

  async getStationById(id: string): Promise<DutyStation | null> {
    const stations = await this.getStations();
    return stations.find((station) => station.id === id) ?? null;
  }

  async getTravelResources(): Promise<TravelResource[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return this.localRepository.getTravelResources();
    }

    const { data, error } = await supabase
      .from("travel_resources")
      .select("id,category,name,description,url,display_order")
      .order("display_order", { ascending: true });

    if (error || !data?.length) {
      return this.localRepository.getTravelResources();
    }

    return (data as TravelResourceRow[]).map((resource) => ({
      id: resource.id,
      category: resource.category,
      name: resource.name,
      description: resource.description,
      url: resource.url,
      displayOrder: resource.display_order,
    }));
  }
}

export const stationRepository: StationRepository = new SupabaseStationRepository();
