// Cost-of-living enricher — BEA Regional Price Parities (state-level).
//
// API: https://apps.bea.gov/api/data
//   datasetname=Regional, TableName=SARPP, GeoFips=<state-fips>
//   LineCodes: 1 = All items, 2 = Goods, 3 = Services-Rents, 4 = Services-Other
//
// RPP indexes are scaled to 100 = U.S. average, which maps directly onto
// the CostOfLivingSummary.overallIndexUs100 / housingIndex fields.
// Granularity is state, not county — BEA does not publish a comparable
// county-level series. We record areaScope="custom" since
// station_category_summaries CHECK constraint accepts that, and tag the
// value with the 2-digit state FIPS for traceability.
//
// asOf: BEA publishes RPP data ~18 months in arrears; we ask for the
// most recent year and fall back one year if it is not yet released.

const BEA_ENDPOINT = "https://apps.bea.gov/api/data";
const BEA_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const PRIMARY_YEAR_OFFSET = 2;
const FALLBACK_YEAR_OFFSET = 3;

export const category = "costOfLiving";

export async function fetchForStation(station, ctx) {
  const apiKey = process.env.BEA_API_KEY;
  if (!apiKey) {
    throw new Error(
      "BEA_API_KEY env var required (free signup at https://apps.bea.gov/API/signup/)"
    );
  }
  const stateFips = pickStateFips(station);
  if (!stateFips) return null;

  const currentYear = new Date().getUTCFullYear();
  const candidateYears = [currentYear - PRIMARY_YEAR_OFFSET, currentYear - FALLBACK_YEAR_OFFSET];

  for (const year of candidateYears) {
    const result = await fetchYear({ politeFetch: ctx.politeFetch, apiKey, stateFips, year });
    if (result) {
      return result;
    }
  }
  return null;
}

function pickStateFips(station) {
  if (station.countyFips && station.countyFips.length === 5) return station.countyFips.slice(0, 2);
  if (station.placeFips && station.placeFips.length === 7) return station.placeFips.slice(0, 2);
  return null;
}

async function fetchYear({ politeFetch, apiKey, stateFips, year }) {
  const url = buildUrl(apiKey, stateFips, year);
  let body;
  try {
    body = await politeFetch(url, { ttlMs: BEA_TTL_MS });
  } catch {
    return null;
  }
  const summary = buildSummary(body);
  if (!summary) return null;
  return {
    areaScope: "custom",
    areaValue: `state:${stateFips}`,
    areaKey: stateFips,
    radiusMiles: null,
    summaryData: { ...summary, asOf: String(year) },
    dataSource: `BEA Regional Price Parities (state, ${year})`,
    sourceUrl: stripBeaKey(url),
  };
}

function buildUrl(apiKey, stateFips, year) {
  const params = new URLSearchParams({
    UserID: apiKey,
    method: "GetData",
    datasetname: "Regional",
    TableName: "SARPP",
    LineCode: "1,2,3,4",
    GeoFips: stateFips,
    Year: String(year),
    ResultFormat: "json",
  });
  return `${BEA_ENDPOINT}?${params.toString()}`;
}

function stripBeaKey(url) {
  const u = new URL(url);
  u.searchParams.delete("UserID");
  return u.toString();
}

export function buildSummary(body) {
  const rows = body?.BEAAPI?.Results?.Data ?? [];
  if (!Array.isArray(rows) || rows.length === 0) return null;

  // BEA returns one row per (LineCode, GeoFips, TimePeriod). The LineCode
  // isn't echoed verbatim — we identify each metric by Code:
  //   RPPALL  = All items (overall index)
  //   RPPGOOD = Goods
  //   RPPSER  = Services other (we ignore — no field on the type)
  //   RPPRENT = Services - rents (housing proxy)
  const overall = pickValue(rows, "RPPALL");
  const housing = pickValue(rows, "RPPRENT");
  if (overall === null && housing === null) return null;

  return {
    overallIndexUs100: overall,
    housingIndex: housing,
    groceriesIndex: null,
    utilitiesIndex: null,
    transportIndex: null,
  };
}

function pickValue(rows, code) {
  const row = rows.find((entry) => entry?.Code === code);
  if (!row) return null;
  const raw = String(row.DataValue ?? "").replace(/,/g, "");
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}
