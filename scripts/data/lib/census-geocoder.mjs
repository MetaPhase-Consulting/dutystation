// Thin wrapper over the U.S. Census Geocoder.
//
// API: https://geocoding.geo.census.gov/geocoder/
// Free, no API key, no auth. We use the `geographies/onelineaddress`
// endpoint so a single call returns lat/lng AND the county + place
// FIPS codes that downstream enrichers (BLS, ACS, FBI Crime, NCES) key off.
//
// Pure module: callers inject politeFetch so unit tests can stub it.

const ENDPOINT = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";
const PRIMARY_BENCHMARK = "Public_AR_Current";
const PRIMARY_VINTAGE = "Current_Current";
const FALLBACK_BENCHMARK = "Public_AR_Census2020";
const FALLBACK_VINTAGE = "Census2020_Current";

export async function geocodeAddress({ politeFetch, address }) {
  if (!address || typeof address !== "string") return null;

  const primary = await tryGeocode(politeFetch, address, PRIMARY_BENCHMARK, PRIMARY_VINTAGE);
  if (primary) return primary;

  const fallback = await tryGeocode(politeFetch, address, FALLBACK_BENCHMARK, FALLBACK_VINTAGE);
  return fallback;
}

async function tryGeocode(politeFetch, address, benchmark, vintage) {
  const url = buildUrl(address, benchmark, vintage);
  let body;
  try {
    body = await politeFetch(url, { ttlMs: 365 * 24 * 60 * 60 * 1000 }); // 1y cache
  } catch {
    return null;
  }

  const matches = body?.result?.addressMatches ?? [];
  const match = matches[0];
  if (!match) return null;

  const lat = numberOrNull(match.coordinates?.y);
  const lng = numberOrNull(match.coordinates?.x);
  if (lat === null || lng === null) return null;

  const county = (match.geographies?.["Counties"] ?? [])[0];
  const incorporatedPlace = (match.geographies?.["Incorporated Places"] ?? [])[0];
  const cdp = (match.geographies?.["Census Designated Places"] ?? [])[0];
  const place = incorporatedPlace ?? cdp ?? null;

  return {
    lat,
    lng,
    matchedAddress: match.matchedAddress ?? null,
    countyFips: county?.GEOID ?? null,
    countyName: cleanCensusName(county?.NAME),
    placeFips: place?.GEOID ?? null,
    placeName: cleanCensusName(place?.NAME),
    source: `census-geocoder:${benchmark}/${vintage}`,
    sourceUrl: url,
  };
}

function buildUrl(address, benchmark, vintage) {
  const params = new URLSearchParams({
    address,
    benchmark,
    vintage,
    format: "json",
  });
  return `${ENDPOINT}?${params.toString()}`;
}

function numberOrNull(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

// Census names often look like "Frisco city" / "Denton County" — strip the
// trailing class word so display names look natural.
function cleanCensusName(name) {
  if (!name) return null;
  return String(name)
    .replace(/\s+(city|town|village|borough|township|county|cdp|municipality)$/i, "")
    .trim();
}
