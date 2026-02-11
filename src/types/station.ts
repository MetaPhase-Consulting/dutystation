export const STATION_LINK_CATEGORIES = [
  "realEstate",
  "schools",
  "crime",
  "costOfLiving",
  "weather",
  "transit",
  "movingTips",
] as const;

export type StationLinkCategory = (typeof STATION_LINK_CATEGORIES)[number];
export type PositionType = "CBPO" | "BPA" | "AMO";

export interface StationLink {
  category: StationLinkCategory;
  url: string;
  isValid: boolean | null;
  lastCheckedAt: string | null;
  statusCode: number | null;
  resolvedUrl: string | null;
}

export interface StationAttributes {
  incentiveEligible: boolean;
  incentiveLabel: string | null;
  disclaimerApplies: boolean;
}

export interface RecreationResource {
  id: string;
  category: string;
  name: string;
  description: string;
  url: string;
  distanceMiles: number | null;
}

export interface DutyStation {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCode: string;
  sector: string;
  lat: number;
  lng: number;
  region: string;
  description: string;
  positionTypes: PositionType[];
  attributes: StationAttributes;
  links: Record<StationLinkCategory, StationLink>;
  recreation: RecreationResource[];
}

export interface TravelResource {
  id: string;
  category: "flight" | "car-rental" | "hotel" | "trip-planner";
  name: string;
  description: string;
  url: string;
  displayOrder: number;
}

export interface StationListFilters {
  query?: string;
  sector?: string;
  region?: string;
  state?: string;
  positionTypes?: PositionType[];
  incentiveOnly?: boolean;
  sortOrder?: "asc" | "desc";
}
