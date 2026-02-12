import { dutyStations as legacyDutyStations } from "@/data/dutyStations";
import {
  DutyStation,
  PositionType,
  RecreationResource,
  STATION_LINK_CATEGORIES,
  StationLink,
  TravelResource,
} from "@/types/station";

const DEFAULT_POSITION_TYPES: PositionType[] = ["BPA"];

const INCENTIVE_STATIONS = new Set([
  "ajo-station",
  "douglas-station",
  "three-points-station",
  "rangeley-station",
  "warroad-station",
  "sanderson-station",
  "presidio-station",
  "sonoita-station",
  "houlton-station",
  "havre-station",
  "blythe-station",
  "fort-kent-station",
]);

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
    id: "travel-expedia",
    category: "flight",
    name: "Expedia",
    description: "Flight search and booking options for pre-academy travel planning.",
    url: "https://www.expedia.com/",
    displayOrder: 1,
  },
  {
    id: "travel-travelocity",
    category: "hotel",
    name: "Travelocity",
    description: "Hotel and lodging options for pre-academy relocation travel.",
    url: "https://www.travelocity.com/",
    displayOrder: 2,
  },
  {
    id: "travel-kayak",
    category: "car-rental",
    name: "Kayak",
    description: "Rental car and transportation comparison across carriers.",
    url: "https://www.kayak.com/",
    displayOrder: 3,
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

function inferLinkHealth(url: string): Pick<StationLink, "isValid" | "statusCode"> {
  if (!url) {
    return { isValid: false, statusCode: 0 };
  }

  if (url.includes("moving.com")) {
    return { isValid: false, statusCode: 404 };
  }

  if (url.includes("rome2rio.com")) {
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

export const legacyStations: DutyStation[] = legacyDutyStations
  .filter((station) => station.lat !== null && station.lng !== null)
  .map((station) => {
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
    } satisfies DutyStation;
  });
