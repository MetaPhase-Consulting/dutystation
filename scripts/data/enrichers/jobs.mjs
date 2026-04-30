// Jobs enricher — BLS Local Area Unemployment Statistics (LAUS) by county.
//
// LAUS series IDs at the county level follow the pattern
//   LAUCN<5-digit-county-fips>0000000003   unemployment rate (%)
//   LAUCN<5-digit-county-fips>0000000006   labor force (count)
//
// We pull both for the most recent year + previous year (so the API
// has data even when the latest month hasn't released yet) and read
// the newest non-null observation.
//
// topIndustries (QCEW) and medianWageAll (OEWS) are not yet wired —
// they require additional series and a more involved aggregation that
// we'll layer in a follow-up.

import { fetchBlsSeries, latestBlsValue } from "../lib/bls.mjs";

export const category = "jobs";

const UNEMPLOYMENT_SUFFIX = "0000000003";
const LABOR_FORCE_SUFFIX = "0000000006";

export async function fetchForStation(station, ctx) {
  if (!station.countyFips || station.countyFips.length !== 5) return null;

  const seriesIds = [
    `LAUCN${station.countyFips}${UNEMPLOYMENT_SUFFIX}`,
    `LAUCN${station.countyFips}${LABOR_FORCE_SUFFIX}`,
  ];
  const now = new Date();
  const endYear = now.getUTCFullYear();
  const startYear = endYear - 1;

  const series = await fetchBlsSeries({
    politeFetch: ctx.politeFetch,
    seriesIds,
    startYear,
    endYear,
  });

  const summary = buildSummary(series, seriesIds);
  if (!summary) return null;

  return {
    areaScope: "county",
    areaValue: station.countyName ?? station.countyFips,
    areaKey: station.countyFips,
    radiusMiles: null,
    summaryData: summary,
    dataSource: "BLS LAUS (county)",
    sourceUrl: `https://www.bls.gov/web/metro/laucntycur14.txt`,
  };
}

export function buildSummary(series, seriesIds) {
  const [unemploymentId, laborForceId] = seriesIds;
  const byId = new Map(series.map((entry) => [entry.seriesID, entry]));

  const unemployment = latestBlsValue(byId.get(unemploymentId));
  const laborForce = latestBlsValue(byId.get(laborForceId));

  if (!unemployment && !laborForce) return null;

  return {
    unemploymentRate: unemployment?.value ?? null,
    laborForce: laborForce?.value ?? null,
    topIndustries: null,
    medianWageAll: null,
  };
}
