// Shared client for the U.S. Census ACS 5-year API.
//
//   https://api.census.gov/data/<year>/acs/acs5
//
// Both demographics and realEstate enrichers use this. Pure module —
// callers inject politeFetch so unit tests stub HTTP without running a
// network call.

export const ACS_YEAR = "2022";
export const ACS_AS_OF_MONTH = `${ACS_YEAR}-12`;
export const ACS_BASE = `https://api.census.gov/data/${ACS_YEAR}/acs/acs5`;
export const ACS_CACHE_TTL_MS = 365 * 24 * 60 * 60 * 1000;

// Picks the geographic area to query for a station. Place is preferred
// (more specific) but a station outside any incorporated/CDP boundary
// falls back to county. Returns null when neither is known.
export function pickAcsArea(station) {
  if (station.placeFips && station.placeFips.length === 7) {
    return {
      scope: "place",
      key: station.placeFips,
      label: station.placeName ?? station.placeFips,
      stateFips: station.placeFips.slice(0, 2),
      placeFips: station.placeFips.slice(2),
    };
  }
  if (station.countyFips && station.countyFips.length === 5) {
    return {
      scope: "county",
      key: station.countyFips,
      label: station.countyName ?? station.countyFips,
      stateFips: station.countyFips.slice(0, 2),
      countyFips: station.countyFips.slice(2),
    };
  }
  return null;
}

export function buildAcsUrl(target, vars, apiKey) {
  const params = new URLSearchParams({
    get: `NAME,${vars.join(",")}`,
    key: apiKey,
  });
  if (target.scope === "place") {
    params.set("for", `place:${target.placeFips}`);
    params.set("in", `state:${target.stateFips}`);
  } else {
    params.set("for", `county:${target.countyFips}`);
    params.set("in", `state:${target.stateFips}`);
  }
  return `${ACS_BASE}?${params.toString()}`;
}

export function stripAcsKey(url) {
  const u = new URL(url);
  u.searchParams.delete("key");
  return u.toString();
}

// Returns a {variable: number|null} map. Census suppression sentinels
// (-666666666, -999999999) and empty strings collapse to null.
export function parseAcsRow(body) {
  if (!Array.isArray(body) || body.length < 2) return null;
  const headers = body[0];
  const values = body[1];
  const map = {};
  for (let index = 0; index < headers.length; index += 1) {
    map[headers[index]] = numberOrNull(values[index]);
  }
  return map;
}

export function numberOrNull(value) {
  if (value === null || value === undefined || value === "" || value === "-") return null;
  if (value === "-666666666" || value === "-999999999") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function fetchAcsVariables({ politeFetch, station, vars }) {
  const apiKey = process.env.CENSUS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "CENSUS_API_KEY env var required (free signup at https://api.census.gov/data/key_signup.html)"
    );
  }
  const target = pickAcsArea(station);
  if (!target) return null;

  const url = buildAcsUrl(target, vars, apiKey);
  const body = await politeFetch(url, { ttlMs: ACS_CACHE_TTL_MS });
  const row = parseAcsRow(body);
  if (!row) return null;

  return {
    target,
    row,
    sourceUrl: stripAcsKey(url),
    dataSource: `Census ACS 5-year ${ACS_YEAR}`,
  };
}
