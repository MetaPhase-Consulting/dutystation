// Demographics enricher — Census ACS 5-year tables.
//
// Variables (2022 vintage):
//   B01003_001E  Total population
//   B01002_001E  Median age
//   B19013_001E  Median household income (past 12 months, inflation-adjusted)
//   B25010_001E  Average household size of occupied housing units
//   B16001_001E  Population 5 years and over (English-only denominator)
//   B16001_002E  Population 5+ that speaks only English

import { fetchAcsVariables } from "../lib/census-acs.mjs";

const VARS = [
  "B01003_001E",
  "B01002_001E",
  "B19013_001E",
  "B25010_001E",
  "B16001_001E",
  "B16001_002E",
];

export const category = "demographics";

export async function fetchForStation(station, ctx) {
  const fetched = await fetchAcsVariables({
    politeFetch: ctx.politeFetch,
    station,
    vars: VARS,
  });
  if (!fetched) return null;

  const summary = buildSummary(fetched.row);
  if (!summary) return null;

  return {
    areaScope: fetched.target.scope,
    areaValue: fetched.target.label,
    areaKey: fetched.target.key,
    radiusMiles: null,
    summaryData: summary,
    dataSource: fetched.dataSource,
    sourceUrl: fetched.sourceUrl,
  };
}

export function buildSummary(row) {
  const population = row.B01003_001E;
  const medianAge = row.B01002_001E;
  const medianIncome = row.B19013_001E;
  const householdSize = row.B25010_001E;
  const totalLanguage = row.B16001_001E;
  const englishOnly = row.B16001_002E;

  const pctEnglishOnly =
    totalLanguage && englishOnly !== null && totalLanguage > 0
      ? Number(((englishOnly / totalLanguage) * 100).toFixed(1))
      : null;

  if (
    population === null &&
    medianAge === null &&
    medianIncome === null &&
    householdSize === null &&
    pctEnglishOnly === null
  ) {
    return null;
  }

  return {
    population,
    medianAge,
    medianHouseholdIncome: medianIncome,
    householdSize,
    pctEnglishOnly,
  };
}
