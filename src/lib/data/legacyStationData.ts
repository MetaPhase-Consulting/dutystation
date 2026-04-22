import { dutyStations as legacyDutyStations } from "@/data/dutyStations";
import alphaSeed from "../../../supabase/seed/summary-alpha.json";
import {
  CategorySummary,
  CategorySummaryDataMap,
  DutyStation,
  PositionType,
  RecreationResource,
  STATION_LINK_CATEGORIES,
  StationLink,
  StationSummaries,
  SummaryCategory,
  TravelResource,
} from "@/types/station";

const DEFAULT_POSITION_TYPES: PositionType[] = ["BPA"];

// Incentive-eligible station flagging was removed from the UI in April 2026
// pending an authoritative public list. See docs/backlog/icebox.md for
// context and the surfaces to restore if/when a sourced list is available.
const INCENTIVE_STATIONS = new Set<string>();

const REGION_RECREATION: Record<
  string,
  Array<Omit<RecreationResource, "id" | "distanceMiles"> & { distanceMiles?: number }>
> = {
  Southwest: [
    {
      category: "Outdoor",
      name: "National Parks & Hiking",
      description: "Public lands, trails, and scenic overlooks near station communities.",
      url: "https://www.nps.gov/index.htm",
      distanceMiles: 35,
    },
    {
      category: "Fishing",
      name: "State Fishing Access",
      description: "State-by-state fishing locations, licenses, and species guides.",
      url: "https://www.takeemfishing.org/",
      distanceMiles: 22,
    },
  ],
  Northwest: [
    {
      category: "Outdoor",
      name: "US Forest Service Recreation",
      description: "Camping, hiking, off-road, and wilderness resources.",
      url: "https://www.fs.usda.gov/recreation",
      distanceMiles: 28,
    },
    {
      category: "Fishing",
      name: "NOAA Fisheries Recreation",
      description: "Regional recreational fishing information and seasons.",
      url: "https://www.fisheries.noaa.gov/recreational-fishing",
      distanceMiles: 18,
    },
  ],
  Midwest: [
    {
      category: "Outdoor",
      name: "State Parks Directory",
      description: "Locate parks, trails, and campground options nearby.",
      url: "https://www.stateparks.com/",
      distanceMiles: 30,
    },
  ],
  Northeast: [
    {
      category: "Outdoor",
      name: "Scenic Byways and Trails",
      description: "Regional trail and recreation resources for weekends and family trips.",
      url: "https://www.recreation.gov/",
      distanceMiles: 26,
    },
  ],
  Southeast: [
    {
      category: "Outdoor",
      name: "US Fish & Wildlife Refuges",
      description: "Refuge maps, hunting/fishing access, and wildlife recreation.",
      url: "https://www.fws.gov/refuges",
      distanceMiles: 24,
    },
  ],
};

export const DEFAULT_TRAVEL_RESOURCES: TravelResource[] = [
  {
    id: "travel",
    category: "trip-planner",
    name: "Travel",
    description: "Compare flights, hotels, and rental cars for relocation planning.",
    url: "https://www.kayak.com/",
    displayOrder: 1,
  },
];

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

// Parse the URL and compare the hostname to a known value. Avoids the
// CodeQL js/incomplete-url-substring-sanitization pattern that can match
// attacker-controlled paths like "https://evil.com/moving.com/".
function hostIs(url: string, host: string): boolean {
  try {
    const parsed = new URL(url);
    const h = parsed.hostname.toLowerCase().replace(/^www\./, "");
    return h === host.toLowerCase();
  } catch {
    return false;
  }
}

function inferLinkHealth(url: string): Pick<StationLink, "isValid" | "statusCode"> {
  if (!url) {
    return { isValid: false, statusCode: 0 };
  }

  if (hostIs(url, "moving.com")) {
    return { isValid: false, statusCode: 404 };
  }

  if (hostIs(url, "rome2rio.com")) {
    return { isValid: null, statusCode: null };
  }

  if (url.includes("/y/9999/")) {
    return { isValid: false, statusCode: 404 };
  }

  return { isValid: true, statusCode: 200 };
}

function normalizeCity(city: string): string {
  return city
    .replace(/Road([A-Z])/g, "Road $1")
    .replace(/Hwy([A-Z])/g, "Hwy $1")
    .replace(/\s+/g, " ")
    .trim();
}

function mapRecreation(region: string, stationId: string): RecreationResource[] {
  const resources = REGION_RECREATION[region] ?? [];

  return resources.map((resource, index) => ({
    id: `${stationId}-recreation-${index + 1}`,
    category: resource.category,
    name: resource.name,
    description: resource.description,
    url: resource.url,
    distanceMiles: resource.distanceMiles ?? null,
  }));
}

// Alpha seed merged at import time so stations render real summary data even
// without a configured Supabase backend. Once the scraper (Phase 3) ships and
// the DB is the source of truth, this fallback remains as a zero-config dev /
// offline path.
interface AlphaEntry {
  stationId: string;
  address: {
    streetAddress: string | null;
    preciseLat: number | null;
    preciseLng: number | null;
    countyName: string | null;
    countyFips: string | null;
    placeName: string | null;
    placeFips: string | null;
    zip?: string | null;
    source?: string | null;
  };
  summaries: Record<
    string,
    {
      areaScope: string;
      areaValue: string;
      areaKey: string | null;
      radiusMiles?: number | null;
      summaryData: unknown;
      dataSource: string;
      sourceUrl: string | null;
    }
  >;
}

const ALPHA_BY_ID = new Map<string, AlphaEntry>(
  (alphaSeed.stations as AlphaEntry[]).map((entry) => [entry.stationId, entry])
);
const ALPHA_FETCHED_AT = (alphaSeed as { _as_of?: string })._as_of
  ? `${(alphaSeed as { _as_of: string })._as_of}T00:00:00.000Z`
  : new Date().toISOString();

function buildAlphaSummaries(alpha: AlphaEntry | undefined): StationSummaries {
  if (!alpha) return {};
  const summaries: StationSummaries = {};
  for (const [category, entry] of Object.entries(alpha.summaries)) {
    const cat = category as SummaryCategory;
    const parsed: CategorySummary = {
      category: cat,
      areaScope: entry.areaScope as CategorySummary["areaScope"],
      areaValue: entry.areaValue,
      areaKey: entry.areaKey,
      radiusMiles: entry.radiusMiles ?? null,
      summaryData: entry.summaryData as CategorySummaryDataMap[SummaryCategory],
      dataSource: entry.dataSource,
      sourceUrl: entry.sourceUrl,
      fetchedAt: ALPHA_FETCHED_AT,
      expiresAt: null,
    };
    (summaries as Record<SummaryCategory, CategorySummary>)[cat] = parsed;
  }
  return summaries;
}

export const legacyStations: DutyStation[] = legacyDutyStations
  .filter((station) => station.lat !== null && station.lng !== null)
  .map((station) => {
    const alpha = ALPHA_BY_ID.get(station.id);
    const links = createDefaultLinks();

    STATION_LINK_CATEGORIES.forEach((category) => {
      const url = station.links[category] ?? "";
      const health = inferLinkHealth(url);

      links[category] = {
        category,
        url,
        originalUrl: url || null,
        isRemediated: false,
        remediationReason: null,
        remediatedAt: null,
        isValid: health.isValid,
        statusCode: health.statusCode,
        lastCheckedAt: null,
        resolvedUrl: null,
      };
    });

    return {
      id: station.id,
      name: station.name,
      city: normalizeCity(station.city),
      state: station.state,
      zipCode: station.zipCode,
      sector: station.sector,
      lat: station.lat,
      lng: station.lng,
      region: station.region,
      description: station.description,
      componentType: "USBP",
      facilityType: "Station",
      sourceType: "Station",
      sourceParent: station.sector,
      sourceUrl: null,
      positionTypes: [...DEFAULT_POSITION_TYPES],
      attributes: {
        incentiveEligible: INCENTIVE_STATIONS.has(station.id),
        incentiveLabel: INCENTIVE_STATIONS.has(station.id) ? "Incentive Eligible" : null,
        disclaimerApplies: true,
      },
      links,
      recreation: mapRecreation(station.region, station.id),
      streetAddress: alpha?.address.streetAddress ?? null,
      streetAddress2: null,
      preciseLat: alpha?.address.preciseLat ?? null,
      preciseLng: alpha?.address.preciseLng ?? null,
      countyName: alpha?.address.countyName ?? null,
      countyFips: alpha?.address.countyFips ?? null,
      placeName: alpha?.address.placeName ?? null,
      placeFips: alpha?.address.placeFips ?? null,
      addressGeocodedAt: alpha ? ALPHA_FETCHED_AT : null,
      addressGeocodeSource: alpha?.address.source ?? null,
      summaries: buildAlphaSummaries(alpha),
    } satisfies DutyStation;
  });
