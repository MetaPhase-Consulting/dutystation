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
  // SARPP requires the 5-digit state-padded GeoFips ("27000") rather
  // than the bare 2-digit state FIPS ("27") — passing the latter trips
  // BEA error 40.
  const stateGeoFips = `${stateFips}000`;
  return {
    table: "SARPP",
    geoFips: stateGeoFips,
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

// BEA only allows a single LineCode per request for the metropolitan
// (MARPP) table — passing "1,2,3,4" trips API error 41 — so we issue
// one request per LineCode. The four lines map to:
//   1 = All items, 2 = Goods, 3 = Services-Rents (housing), 4 = Services-Other.
// The Code field in MARPP rows is "MARPP-1"/"MARPP-2"/etc. and in SARPP
// rows is "RPPALL"/"RPPGOOD"/"RPPRENT"/"RPPSER", so rather than parse it
// we tag each response with the LineCode we asked for.
const LINE_CODES = ["1", "2", "3", "4"];

async function fetchYear({ politeFetch, apiKey, target, year }) {
  const urls = LINE_CODES.map((line) => buildUrl(apiKey, target, year, line));
  const settled = await Promise.all(
    urls.map((url) =>
      politeFetch(url, { ttlMs: BEA_TTL_MS }).catch(() => null)
    )
  );
  const valuesByLine = {};
  for (let i = 0; i < LINE_CODES.length; i += 1) {
    const line = LINE_CODES[i];
    const body = settled[i];
    valuesByLine[line] = pickFirstValue(body);
  }
  const summary = buildSummary(valuesByLine);
  if (!summary) return null;
  return {
    areaScope: target.areaScope,
    areaValue: target.areaValue,
    areaKey: target.areaKey,
    radiusMiles: null,
    summaryData: { ...summary, asOf: String(year), areaLabel: target.label },
    dataSource: `BEA Regional Price Parities (${target.table === "MARPP" ? "MSA" : "state"}, ${year})`,
    sourceUrl: stripBeaKey(urls[0]),
  };
}

function buildUrl(apiKey, target, year, lineCode) {
  const params = new URLSearchParams({
    UserID: apiKey,
    method: "GetData",
    datasetname: "Regional",
    TableName: target.table,
    LineCode: lineCode,
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

// `valuesByLine` is { "1": <number|null>, "2": ..., "3": ..., "4": ... }
// where each key is the BEA LineCode we requested and each value is the
// DataValue from the first row of that response. This isolates the
// shape difference between MARPP ("MARPP-1") and SARPP ("RPPALL") Code
// fields — we no longer parse Code at all.
export function buildSummary(valuesByLine) {
  if (!valuesByLine || typeof valuesByLine !== "object") return null;
  const overall = valuesByLine["1"] ?? null;
  const goods = valuesByLine["2"] ?? null;
  const housing = valuesByLine["3"] ?? null;
  const services = valuesByLine["4"] ?? null;
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

function pickFirstValue(body) {
  const rows = body?.BEAAPI?.Results?.Data ?? [];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const raw = String(rows[0].DataValue ?? "").replace(/,/g, "");
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}
