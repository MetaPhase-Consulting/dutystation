export const STATION_LINK_CATEGORIES = [
  "realEstate",
  "schools",
  "crime",
  "costOfLiving",
  "weather",
  "transit",
  "movingTips",
  "demographics",
  "healthcare",
  "jobs",
] as const;

export type StationLinkCategory = (typeof STATION_LINK_CATEGORIES)[number];

// Categories that carry a dashboard summary (movingTips stays link-only).
export const SUMMARY_CATEGORIES = [
  "weather",
  "schools",
  "crime",
  "costOfLiving",
  "realEstate",
  "transit",
  "demographics",
  "healthcare",
  "jobs",
] as const satisfies readonly StationLinkCategory[];

export type SummaryCategory = (typeof SUMMARY_CATEGORIES)[number];

export type PositionType = "CBPO" | "BPA" | "AMO";
export type ComponentType = "USBP" | "OFO" | "AMO";
export type FacilityType = "Station" | "Port of Entry" | "Field Office" | "Sector" | "Other";

export type AreaScope = "zip" | "county" | "place" | "msa" | "radius" | "custom";

export interface StationLink {
  category: StationLinkCategory;
  url: string;
  originalUrl: string | null;
  isRemediated: boolean;
  remediationReason: string | null;
  remediatedAt: string | null;
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

// Per-category summary shapes. All numeric fields nullable so partial data
// still renders gracefully (the scraper may only get some fields from some
// sources on a given run).
export interface WeatherSummary {
  avgHighF: number | null;
  avgLowF: number | null;
  summerHighF: number | null;
  winterLowF: number | null;
  annualPrecipIn: number | null;
  annualSnowIn: number | null;
  sunnyDays: number | null;
  climateLabel: string | null;
}

export interface SchoolsSummary {
  avgRating0to10: number | null;
  numK12: number | null;
  numDistricts: number | null;
  gradRatePct: number | null;
  studentTeacherRatio: number | null;
}

export interface CrimeSummary {
  violentPer100k: number | null;
  propertyPer100k: number | null;
  usViolentPer100k: number | null;
  usPropertyPer100k: number | null;
  safetyIndex0to100: number | null;
  asOfYear: number | null;
}

export interface CostOfLivingSummary {
  overallIndexUs100: number | null;
  housingIndex: number | null;
  groceriesIndex: number | null;
  utilitiesIndex: number | null;
  transportIndex: number | null;
  asOf: string | null;
}

export interface RealEstateSummary {
  medianHomePrice: number | null;
  medianRent2br: number | null;
  pricePerSqft: number | null;
  yoyChangePct: number | null;
  asOfMonth: string | null;
}

export interface TransitSummary {
  nearestAirportIata: string | null;
  airportDistanceMi: number | null;
  walkScore: number | null;
  transitScore: number | null;
  bikeScore: number | null;
}

export interface DemographicsSummary {
  population: number | null;
  medianAge: number | null;
  medianHouseholdIncome: number | null;
  householdSize: number | null;
  pctEnglishOnly: number | null;
}

export interface HealthcareSummary {
  hospitalsWithin25mi: number | null;
  nearestHospitalName: string | null;
  nearestHospitalMi: number | null;
  nearestVaMi: number | null;
}

export interface JobsSummary {
  unemploymentRate: number | null;
  laborForce: number | null;
  topIndustries: string[] | null;
  medianWageAll: number | null;
}

export interface CategorySummaryDataMap {
  weather: WeatherSummary;
  schools: SchoolsSummary;
  crime: CrimeSummary;
  costOfLiving: CostOfLivingSummary;
  realEstate: RealEstateSummary;
  transit: TransitSummary;
  demographics: DemographicsSummary;
  healthcare: HealthcareSummary;
  jobs: JobsSummary;
}

export interface CategorySummary<TCategory extends SummaryCategory = SummaryCategory> {
  category: TCategory;
  areaScope: AreaScope;
  areaValue: string;
  areaKey: string | null;
  radiusMiles: number | null;
  summaryData: CategorySummaryDataMap[TCategory];
  dataSource: string;
  sourceUrl: string | null;
  fetchedAt: string;
  expiresAt: string | null;
}

export type StationSummaries = {
  [TCategory in SummaryCategory]?: CategorySummary<TCategory>;
};

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
  componentType: ComponentType;
  facilityType: FacilityType;
  sourceType: string | null;
  sourceParent: string | null;
  sourceUrl: string | null;
  positionTypes: PositionType[];
  attributes: StationAttributes;
  links: Record<StationLinkCategory, StationLink>;
  recreation: RecreationResource[];
  streetAddress: string | null;
  streetAddress2: string | null;
  preciseLat: number | null;
  preciseLng: number | null;
  countyName: string | null;
  countyFips: string | null;
  placeName: string | null;
  placeFips: string | null;
  addressGeocodedAt: string | null;
  addressGeocodeSource: string | null;
  summaries: StationSummaries;
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
  componentTypes?: ComponentType[];
  facilityTypes?: FacilityType[];
  positionTypes?: PositionType[];
  sortOrder?: "asc" | "desc";
}
