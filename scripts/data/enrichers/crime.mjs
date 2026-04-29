// Crime enricher — FBI Crime Data Explorer (CDE) state-level estimates.
//
// API: https://api.usa.gov/crime/fbi/cde/...
//   /estimate/state/<STATE_ABBR>?api_key=...&from=YYYY&to=YYYY
//   /estimate/national?api_key=...&from=YYYY&to=YYYY
//
// State-level granularity is the cleanest free option — county-level
// numbers in CDE require aggregating per-agency reports, which is
// noisy because not every agency reports every year. The state
// estimates already include per-state population so we compute
// per-100k rates without an extra ACS lookup.
//
// Coverage: every U.S. state + DC. Stations whose `state` field is
// not a 2-letter abbreviation (e.g., territories without FBI estimates)
// will return null.

const CDE_BASE = "https://api.usa.gov/crime/fbi/cde";
const CRIME_TTL_MS = 90 * 24 * 60 * 60 * 1000;

// FBI CDE updates UCR/NIBRS once a year, ~9 months in arrears.
const PRIMARY_YEAR_OFFSET = 1;
const FALLBACK_YEAR_OFFSET = 2;

export const category = "crime";

const VALID_STATE = /^[A-Z]{2}$/;

export async function fetchForStation(station, ctx) {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    throw new Error(
      "DATA_GOV_API_KEY env var required (free signup at https://api.data.gov/signup/)"
    );
  }
  const stateAbbr = (station.state ?? "").toUpperCase();
  if (!VALID_STATE.test(stateAbbr)) return null;

  const currentYear = new Date().getUTCFullYear();
  const candidateYears = [currentYear - PRIMARY_YEAR_OFFSET, currentYear - FALLBACK_YEAR_OFFSET];

  for (const year of candidateYears) {
    const result = await fetchYear({ politeFetch: ctx.politeFetch, apiKey, stateAbbr, year });
    if (result) return result;
  }
  return null;
}

async function fetchYear({ politeFetch, apiKey, stateAbbr, year }) {
  const stateUrl = `${CDE_BASE}/estimate/state/${stateAbbr}?api_key=${encodeURIComponent(apiKey)}&from=${year}&to=${year}`;
  const nationalUrl = `${CDE_BASE}/estimate/national?api_key=${encodeURIComponent(apiKey)}&from=${year}&to=${year}`;

  let stateBody;
  let nationalBody;
  try {
    [stateBody, nationalBody] = await Promise.all([
      politeFetch(stateUrl, { ttlMs: CRIME_TTL_MS }),
      politeFetch(nationalUrl, { ttlMs: CRIME_TTL_MS }),
    ]);
  } catch {
    return null;
  }

  const summary = buildSummary(stateBody, nationalBody, year);
  if (!summary) return null;

  return {
    areaScope: "custom",
    areaValue: `state:${stateAbbr}`,
    areaKey: stateAbbr,
    radiusMiles: null,
    summaryData: summary,
    dataSource: `FBI Crime Data Explorer (state estimates, ${year})`,
    sourceUrl: stripKey(stateUrl),
  };
}

export function buildSummary(stateBody, nationalBody, year) {
  const stateRow = pickRow(stateBody, year);
  const nationalRow = pickRow(nationalBody, year);
  if (!stateRow) return null;

  const violent = numberOrNull(stateRow.violent_crime);
  const property = numberOrNull(stateRow.property_crime);
  const population = numberOrNull(stateRow.population);
  const usViolent = numberOrNull(nationalRow?.violent_crime);
  const usProperty = numberOrNull(nationalRow?.property_crime);
  const usPopulation = numberOrNull(nationalRow?.population);

  const violentPer100k = perHundredK(violent, population);
  const propertyPer100k = perHundredK(property, population);
  const usViolentPer100k = perHundredK(usViolent, usPopulation);
  const usPropertyPer100k = perHundredK(usProperty, usPopulation);

  if (
    violentPer100k === null &&
    propertyPer100k === null &&
    usViolentPer100k === null &&
    usPropertyPer100k === null
  ) {
    return null;
  }

  // Safety index: 100 if both violent and property rates are well below
  // the U.S. baseline, 0 if both are far above. Linear interpolation on
  // the ratio, clamped — purely a UX-affordance and we record asOfYear
  // so consumers can recompute differently if needed.
  const safetyIndex = computeSafetyIndex(
    violentPer100k,
    propertyPer100k,
    usViolentPer100k,
    usPropertyPer100k
  );

  return {
    violentPer100k,
    propertyPer100k,
    usViolentPer100k,
    usPropertyPer100k,
    safetyIndex0to100: safetyIndex,
    asOfYear: year,
  };
}

function pickRow(body, year) {
  const rows = body?.results ?? body?.data ?? [];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.find((row) => Number(row.year) === year) ?? rows[0];
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function perHundredK(count, population) {
  if (count === null || population === null || !population) return null;
  return Number(((count / population) * 100_000).toFixed(1));
}

function computeSafetyIndex(violent, property, usViolent, usProperty) {
  if (violent === null || property === null || !usViolent || !usProperty) return null;
  const violentRatio = violent / usViolent;
  const propertyRatio = property / usProperty;
  const avgRatio = (violentRatio + propertyRatio) / 2;
  // ratio 1 → 50 (national avg), ratio 0.5 → 75, ratio 1.5 → 25, clamped.
  const score = 100 - Math.min(100, Math.max(0, avgRatio * 50));
  return Math.round(score);
}

function stripKey(url) {
  const u = new URL(url);
  u.searchParams.delete("api_key");
  return u.toString();
}
