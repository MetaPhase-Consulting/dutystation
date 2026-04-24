import type {
  CostOfLivingSummary,
  CrimeSummary,
  DemographicsSummary,
  HealthcareSummary,
  JobsSummary,
  RealEstateSummary,
  SchoolsSummary,
  TransitSummary,
  WeatherSummary,
} from "@/types/station";

// Formatters used by summary cards + comparison tables.
// Keep all user-facing number formatting in one place so the dashboard and
// head-to-head view can't disagree about how a number is rendered.

export function formatNumber(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number | null | undefined, fractionDigits = 1): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatTemperature(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${Math.round(value)}°F`;
}

export function formatDistance(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${Math.round(value)} mi`;
}

export function formatInches(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(1)} in`;
}

export function formatIndex(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return String(Math.round(value));
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface DetailStat {
  label: string;
  value: string;
}

// Per-category heroes + details. Each returns the big number to display first
// and a short list of supporting figures. Null/missing data degrades to "—".

export function weatherHero(data: WeatherSummary): HeroStat {
  return { value: formatTemperature(data.avgHighF), label: "Avg daily high" };
}

export function weatherDetails(data: WeatherSummary): DetailStat[] {
  return [
    { label: "Summer high", value: formatTemperature(data.summerHighF) },
    { label: "Winter low", value: formatTemperature(data.winterLowF) },
    { label: "Annual rain", value: formatInches(data.annualPrecipIn) },
    { label: "Annual snow", value: formatInches(data.annualSnowIn) },
  ];
}

export function schoolsHero(data: SchoolsSummary): HeroStat {
  const rating = data.avgRating0to10;
  return {
    value: rating == null ? "—" : `${rating.toFixed(1)}/10`,
    label: "Avg school rating",
  };
}

export function schoolsDetails(data: SchoolsSummary): DetailStat[] {
  return [
    { label: "K-12 schools", value: formatNumber(data.numK12) },
    { label: "Districts", value: formatNumber(data.numDistricts) },
    { label: "Graduation rate", value: formatPercent(data.gradRatePct, 0) },
    { label: "Student/teacher", value: data.studentTeacherRatio == null ? "—" : `${data.studentTeacherRatio.toFixed(1)}:1` },
  ];
}

export function crimeHero(data: CrimeSummary): HeroStat {
  return {
    value: formatNumber(data.violentPer100k),
    label: "Violent crimes per 100k",
  };
}

export function crimeDetails(data: CrimeSummary): DetailStat[] {
  return [
    { label: "Property per 100k", value: formatNumber(data.propertyPer100k) },
    { label: "US violent per 100k", value: formatNumber(data.usViolentPer100k) },
    { label: "Safety index", value: data.safetyIndex0to100 == null ? "—" : `${Math.round(data.safetyIndex0to100)}/100` },
    { label: "As of", value: data.asOfYear == null ? "—" : String(data.asOfYear) },
  ];
}

export function costOfLivingHero(data: CostOfLivingSummary): HeroStat {
  return {
    value: formatIndex(data.overallIndexUs100),
    label: "Overall index (US = 100)",
  };
}

export function costOfLivingDetails(data: CostOfLivingSummary): DetailStat[] {
  return [
    { label: "Housing", value: formatIndex(data.housingIndex) },
    { label: "Groceries", value: formatIndex(data.groceriesIndex) },
    { label: "Utilities", value: formatIndex(data.utilitiesIndex) },
    { label: "Transport", value: formatIndex(data.transportIndex) },
  ];
}

export function realEstateHero(data: RealEstateSummary): HeroStat {
  return {
    value: formatCurrency(data.medianHomePrice),
    label: "Median home price",
  };
}

export function realEstateDetails(data: RealEstateSummary): DetailStat[] {
  return [
    { label: "Median rent (2BR)", value: formatCurrency(data.medianRent2br) },
    { label: "Price / sq ft", value: formatCurrency(data.pricePerSqft) },
    { label: "YoY change", value: formatPercent(data.yoyChangePct) },
    { label: "As of", value: data.asOfMonth ?? "—" },
  ];
}

export function transitHero(data: TransitSummary): HeroStat {
  return {
    value: data.nearestAirportIata ?? "—",
    label: "Nearest major airport",
  };
}

export function transitDetails(data: TransitSummary): DetailStat[] {
  return [
    { label: "Airport distance", value: formatDistance(data.airportDistanceMi) },
    { label: "Walk score", value: formatIndex(data.walkScore) },
    { label: "Transit score", value: formatIndex(data.transitScore) },
    { label: "Bike score", value: formatIndex(data.bikeScore) },
  ];
}

export function demographicsHero(data: DemographicsSummary): HeroStat {
  return {
    value: formatNumber(data.population),
    label: "Population",
  };
}

export function demographicsDetails(data: DemographicsSummary): DetailStat[] {
  return [
    { label: "Median age", value: data.medianAge == null ? "—" : data.medianAge.toFixed(1) },
    { label: "Median HH income", value: formatCurrency(data.medianHouseholdIncome) },
    { label: "Household size", value: data.householdSize == null ? "—" : data.householdSize.toFixed(2) },
    { label: "English at home", value: formatPercent(data.pctEnglishOnly, 0) },
  ];
}

export function healthcareHero(data: HealthcareSummary): HeroStat {
  return {
    value: formatNumber(data.hospitalsWithin25mi),
    label: "Hospitals within 25 mi",
  };
}

export function healthcareDetails(data: HealthcareSummary): DetailStat[] {
  return [
    { label: "Nearest hospital", value: data.nearestHospitalName ?? "—" },
    { label: "Hospital distance", value: formatDistance(data.nearestHospitalMi) },
    { label: "Nearest VA", value: formatDistance(data.nearestVaMi) },
  ];
}

export function jobsHero(data: JobsSummary): HeroStat {
  return {
    value: formatPercent(data.unemploymentRate),
    label: "Unemployment rate",
  };
}

export function jobsDetails(data: JobsSummary): DetailStat[] {
  return [
    { label: "Labor force", value: formatNumber(data.laborForce) },
    { label: "Median wage", value: formatCurrency(data.medianWageAll) },
    {
      label: "Top industries",
      value:
        data.topIndustries == null || data.topIndustries.length === 0
          ? "—"
          : data.topIndustries.slice(0, 3).join(", "),
    },
  ];
}

// Human-readable label for an area scope + value, e.g. "Laredo, TX (78040)".
export function formatAreaScope(scope: string, value: string): string {
  const pretty: Record<string, string> = {
    zip: "ZIP",
    county: "County",
    place: "City",
    msa: "Metro",
    radius: "Radius",
    custom: "Area",
  };
  const label = pretty[scope] ?? "Area";
  return `${label}: ${value}`;
}
