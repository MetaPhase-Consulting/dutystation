import {
  formatCurrency,
  formatDistance,
  formatIndex,
  formatInches,
  formatNumber,
  formatPercent,
  formatTemperature,
} from "@/lib/summaryFormat";
import type {
  StationSummaries,
  SummaryCategory,
} from "@/types/station";

// Higher-is-better = greater value is a positive for a relocator (income,
// safety index, school rating, walkability).
// Lower-is-better = lower value is the positive (rent, commute, unemployment).
// Neutral = no universal direction (temperature, population).
export type MetricDirection = "higher-is-better" | "lower-is-better" | "neutral";

export interface CompareMetric {
  id: string;
  category: SummaryCategory;
  label: string;
  direction: MetricDirection;
  extract: (summaries: StationSummaries) => number | null;
  format: (value: number | null) => string;
  headline?: boolean;
}

function get<T, K extends keyof T>(obj: T | undefined, key: K): T[K] | null {
  return obj ? (obj[key] ?? null) : null;
}

export const COMPARE_METRICS: CompareMetric[] = [
  // Weather — neutral direction (preference varies).
  {
    id: "weather.summerHigh",
    category: "weather",
    label: "Summer high",
    direction: "neutral",
    extract: (s) => get(s.weather?.summaryData, "summerHighF"),
    format: formatTemperature,
    headline: true,
  },
  {
    id: "weather.winterLow",
    category: "weather",
    label: "Winter low",
    direction: "neutral",
    extract: (s) => get(s.weather?.summaryData, "winterLowF"),
    format: formatTemperature,
  },
  {
    id: "weather.annualPrecip",
    category: "weather",
    label: "Annual rainfall",
    direction: "neutral",
    extract: (s) => get(s.weather?.summaryData, "annualPrecipIn"),
    format: formatInches,
  },

  // Cost of living — lower index = cheaper = better for a relocator.
  {
    id: "costOfLiving.overall",
    category: "costOfLiving",
    label: "Cost of living (US=100)",
    direction: "lower-is-better",
    extract: (s) => get(s.costOfLiving?.summaryData, "overallIndexUs100"),
    format: formatIndex,
  },

  // Real estate.
  {
    id: "realEstate.medianHome",
    category: "realEstate",
    label: "Median home price",
    direction: "lower-is-better",
    extract: (s) => get(s.realEstate?.summaryData, "medianHomePrice"),
    format: formatCurrency,
    headline: true,
  },
  {
    id: "realEstate.medianRent",
    category: "realEstate",
    label: "Median rent (2BR)",
    direction: "lower-is-better",
    extract: (s) => get(s.realEstate?.summaryData, "medianRent2br"),
    format: formatCurrency,
  },

  // Schools.
  {
    id: "schools.avgRating",
    category: "schools",
    label: "Avg school rating (/10)",
    direction: "higher-is-better",
    extract: (s) => get(s.schools?.summaryData, "avgRating0to10"),
    format: (v) => (v == null ? "—" : v.toFixed(1)),
    headline: true,
  },
  {
    id: "schools.gradRate",
    category: "schools",
    label: "Graduation rate",
    direction: "higher-is-better",
    extract: (s) => get(s.schools?.summaryData, "gradRatePct"),
    format: (v) => formatPercent(v, 0),
  },

  // Crime.
  {
    id: "crime.violent",
    category: "crime",
    label: "Violent crime / 100k",
    direction: "lower-is-better",
    extract: (s) => get(s.crime?.summaryData, "violentPer100k"),
    format: formatNumber,
    headline: true,
  },
  {
    id: "crime.property",
    category: "crime",
    label: "Property crime / 100k",
    direction: "lower-is-better",
    extract: (s) => get(s.crime?.summaryData, "propertyPer100k"),
    format: formatNumber,
  },

  // Demographics.
  {
    id: "demographics.population",
    category: "demographics",
    label: "Population",
    direction: "neutral",
    extract: (s) => get(s.demographics?.summaryData, "population"),
    format: formatNumber,
  },
  {
    id: "demographics.medianHhi",
    category: "demographics",
    label: "Median HH income",
    direction: "higher-is-better",
    extract: (s) => get(s.demographics?.summaryData, "medianHouseholdIncome"),
    format: formatCurrency,
  },

  // Jobs.
  {
    id: "jobs.unemployment",
    category: "jobs",
    label: "Unemployment",
    direction: "lower-is-better",
    extract: (s) => get(s.jobs?.summaryData, "unemploymentRate"),
    format: (v) => formatPercent(v, 1),
    headline: true,
  },
  {
    id: "jobs.medianWage",
    category: "jobs",
    label: "Median wage",
    direction: "higher-is-better",
    extract: (s) => get(s.jobs?.summaryData, "medianWageAll"),
    format: formatCurrency,
  },

  // Healthcare.
  {
    id: "healthcare.hospitals25mi",
    category: "healthcare",
    label: "Hospitals within 25 mi",
    direction: "higher-is-better",
    extract: (s) => get(s.healthcare?.summaryData, "hospitalsWithin25mi"),
    format: formatNumber,
  },
  {
    id: "healthcare.nearestVa",
    category: "healthcare",
    label: "Nearest VA",
    direction: "lower-is-better",
    extract: (s) => get(s.healthcare?.summaryData, "nearestVaMi"),
    format: formatDistance,
  },

  // Transit.
  {
    id: "transit.walkScore",
    category: "transit",
    label: "Walk score",
    direction: "higher-is-better",
    extract: (s) => get(s.transit?.summaryData, "walkScore"),
    format: formatIndex,
  },
  {
    id: "transit.airportDistance",
    category: "transit",
    label: "Airport distance",
    direction: "lower-is-better",
    extract: (s) => get(s.transit?.summaryData, "airportDistanceMi"),
    format: formatDistance,
  },
];

export type WinnerSide = "a" | "b" | "tie" | null;

// Returns which station "wins" on a given metric per the direction, or null
// when either value is missing, or "tie" when they're equal.
export function computeWinner(
  metric: CompareMetric,
  valueA: number | null,
  valueB: number | null
): WinnerSide {
  if (valueA == null || valueB == null) return null;
  if (valueA === valueB) return "tie";
  if (metric.direction === "neutral") return null;

  const aWins = metric.direction === "higher-is-better" ? valueA > valueB : valueA < valueB;
  return aWins ? "a" : "b";
}
