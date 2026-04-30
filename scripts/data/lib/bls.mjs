// Shared client for the U.S. Bureau of Labor Statistics public timeseries API.
//
//   POST https://api.bls.gov/publicAPI/v2/timeseries/data/
//
// Free; a registration key (BLS_API_KEY) raises the daily quota to 500
// requests and unlocks multi-year requests. Series IDs follow strict
// formats; this module just handles transport + parsing — series
// construction lives in the per-category enrichers.

const BLS_ENDPOINT = "https://api.bls.gov/publicAPI/v2/timeseries/data/";
const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function fetchBlsSeries({ politeFetch, seriesIds, startYear, endYear, ttlMs = DEFAULT_TTL_MS }) {
  const apiKey = process.env.BLS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "BLS_API_KEY env var required (free signup at https://data.bls.gov/registrationEngine/)"
    );
  }

  const ids = Array.isArray(seriesIds) ? seriesIds : [seriesIds];
  const payload = JSON.stringify({
    seriesid: ids,
    startyear: String(startYear),
    endyear: String(endYear),
    registrationkey: apiKey,
  });

  // POST body is the same for the same {ids,startYear,endYear} so we use
  // a deterministic cacheKey that lets polite-fetch dedupe across runs.
  const cacheKey = `bls:${ids.join(",")}:${startYear}-${endYear}`;

  const json = await politeFetch(BLS_ENDPOINT, {
    method: "POST",
    body: payload,
    headers: { "content-type": "application/json" },
    cacheKey,
    ttlMs,
  });

  if (!json || json.status !== "REQUEST_SUCCEEDED") {
    const messages = Array.isArray(json?.message) ? json.message.join("; ") : "unknown error";
    throw new Error(`BLS API: ${messages}`);
  }

  return json.Results?.series ?? [];
}

// Returns the most recent (year, period, value) tuple in a BLS series.
// BLS data arrays are pre-sorted newest-first.
export function latestBlsValue(series) {
  if (!series?.data?.length) return null;
  const latest = series.data[0];
  const value = Number(latest.value);
  if (!Number.isFinite(value)) return null;
  return {
    value,
    year: Number(latest.year),
    period: latest.period,
    periodName: latest.periodName,
  };
}
