// Cost-of-living enricher — BEA Regional Price Parities.
//
// API: https://apps.bea.gov/api/data
//   datasetname=Regional, TableName=MARPP (metropolitan), GeoFips=<5-digit CBSA>
//   datasetname=Regional, TableName=SARPP (state), GeoFips=<2-digit state FIPS>
//   LineCodes: 1 = All items, 2 = Goods, 3 = Services-Rents, 4 = Services-Other
//
// We prefer MSA-level RPPs (MARPP) when the station's county sits inside a
// Metropolitan Statistical Area, falling back to state-level (SARPP) for
// non-metro stations. This matches the user-facing expectation that
// stations in Phoenix, Tucson, and Yuma should have *different* COL signals,
// not identical state-level numbers — while still publishing a value for
// border-patrol stations in non-metro counties.
//
// Why not county: BEA does not publish a county-level RPP series. RPPs are
// only released at state, MSA, and "metropolitan/non-metropolitan portion
// of state" — and we already have higher-fidelity *housing* data via the
// realEstate enricher (Census ACS at place/county). RPP is the only free,
// official "groceries + services + housing combined" index in the U.S.
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

  const target = pickTarget(station);
  if (!target) return null;

  const currentYear = new Date().getUTCFullYear();
  const candidateYears = [
    currentYear - PRIMARY_YEAR_OFFSET,
    currentYear - FALLBACK_YEAR_OFFSET,
  ];

  for (const year of candidateYears) {
    const result = await fetchYear({
      politeFetch: ctx.politeFetch,
      apiKey,
      target,
      year,
    });
    if (result) return result;
  }
  return null;
}

// Choose the most specific geography we can resolve for this station.
//   - If the station has a CBSA code, query MARPP at MSA granularity.
//   - Otherwise fall back to SARPP at state granularity using state FIPS.
function pickTarget(station) {
  if (station.cbsaCode) {
    return {
      table: "MARPP",
      geoFips: station.cbsaCode,
      areaScope: "msa",
      areaValue: `cbsa:${station.cbsaCode}`,
      areaKey: station.cbsaCode,
      label: station.cbsaTitle ?? `CBSA ${station.cbsaCode}`,
    };
  }
  const stateFips = pickStateFips(station);
  if (!stateFips) return null;
  return {
    table: "SARPP",
    geoFips: stateFips,
    areaScope: "custom",
    areaValue: `state:${stateFips}`,
    areaKey: stateFips,
    label: `state ${stateFips}`,
  };
}

function pickStateFips(station) {
  if (station.countyFips && station.countyFips.length === 5) return station.countyFips.slice(0, 2);
  if (station.placeFips && station.placeFips.length === 7) return station.placeFips.slice(0, 2);
  return null;
}

async function fetchYear({ politeFetch, apiKey, target, year }) {
  const url = buildUrl(apiKey, target, year);
  let body;
  try {
    body = await politeFetch(url, { ttlMs: BEA_TTL_MS });
  } catch {
    return null;
  }
  const summary = buildSummary(body);
  if (!summary) return null;
  return {
    areaScope: target.areaScope,
    areaValue: target.areaValue,
    areaKey: target.areaKey,
    radiusMiles: null,
    summaryData: { ...summary, asOf: String(year), areaLabel: target.label },
    dataSource: `BEA Regional Price Parities (${target.table === "MARPP" ? "MSA" : "state"}, ${year})`,
    sourceUrl: stripBeaKey(url),
  };
}

function buildUrl(apiKey, target, year) {
  const params = new URLSearchParams({
    UserID: apiKey,
    method: "GetData",
    datasetname: "Regional",
    TableName: target.table,
    LineCode: "1,2,3,4",
    GeoFips: target.geoFips,
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
  // identifier is in the `Code` field:
  //   RPPALL  = All items (overall index)
  //   RPPGOOD = Goods
  //   RPPRENT = Services - rents (housing proxy)
  //   RPPSER  = Services - other
  const overall = pickValue(rows, "RPPALL");
  const housing = pickValue(rows, "RPPRENT");
  const goods = pickValue(rows, "RPPGOOD");
  const services = pickValue(rows, "RPPSER");
  if (overall === null && housing === null && goods === null && services === null) {
    return null;
  }

  return {
    overallIndexUs100: overall,
    housingIndex: housing,
    goodsIndex: goods,
    servicesIndex: services,
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
