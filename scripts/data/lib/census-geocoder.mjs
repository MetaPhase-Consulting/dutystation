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

// Reverse-geocode lat/lng to FIPS identifiers — used to backfill county /
// place codes for stations whose street address could not be matched
// (border crossings, ports of entry on water, "no personnel on site"
// entries) but for which we still have coordinates from the legacy
// import or a manual override.
const COORD_ENDPOINT = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates";

export async function geocodeCoordinates({ politeFetch, lat, lng }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const primary = await tryReverse(politeFetch, lat, lng, PRIMARY_BENCHMARK, PRIMARY_VINTAGE);
  if (primary) return primary;
  return tryReverse(politeFetch, lat, lng, FALLBACK_BENCHMARK, FALLBACK_VINTAGE);
}

async function tryReverse(politeFetch, lat, lng, benchmark, vintage) {
  const params = new URLSearchParams({
    x: String(lng),
    y: String(lat),
    benchmark,
    vintage,
    format: "json",
  });
  const url = `${COORD_ENDPOINT}?${params.toString()}`;
  let body;
  try {
    body = await politeFetch(url, { ttlMs: 365 * 24 * 60 * 60 * 1000 });
  } catch {
    return null;
  }

  const geos = body?.result?.geographies ?? {};
  const county = (geos["Counties"] ?? [])[0];
  if (!county?.GEOID) return null;
  const incorporatedPlace = (geos["Incorporated Places"] ?? [])[0];
  const cdp = (geos["Census Designated Places"] ?? [])[0];
  const place = incorporatedPlace ?? cdp ?? null;

  return {
    lat,
    lng,
    matchedAddress: null,
    countyFips: county.GEOID,
    countyName: cleanCensusName(county.NAME),
    placeFips: place?.GEOID ?? null,
    placeName: cleanCensusName(place?.NAME),
    source: `census-geocoder-coords:${benchmark}/${vintage}`,
    sourceUrl: url,
  };
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
