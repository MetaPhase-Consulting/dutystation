// FBI Crime Data Explorer agency lookup.
//
// The CDE summarized API publishes per-agency offense rates at
//   https://cde.ucr.cjis.gov/LATEST/summarized/agency/{ORI}/{offense}
// where ORI is a 9-character originating-agency identifier (e.g.
// "AZ0040100" for Globe PD). To map a station to an ORI we fetch the
// per-state agency listing once, cache it in-memory, and pick the
// nearest NIBRS-reporting agency to the station's precise lat/lng.
//
// Reasoning behind agency selection:
//   - Prefer agencies with `is_nibrs: true` because non-reporters return
//     empty rates from the summarized endpoint.
//   - Prefer "City" agencies over "County" sheriffs when the station is
//     inside a city — city PDs publish more granular monthly rates.
//   - Within the preferred tier, pick the closest by great-circle
//     distance from the station's `precise_lat / precise_lng`.
//
// The state listing is small (~hundreds of rows) and cheap to fetch,
// so we cache it for the lifetime of the orchestrator process.

import { haversineMiles } from "./haversine.mjs";

const AGENCY_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const AGENCY_BASE = "https://cde.ucr.cjis.gov/LATEST/agency/byStateAbbr";

const stateCache = new Map();

export function clearAgencyCache() {
  stateCache.clear();
}

export async function listAgenciesForState({ politeFetch, apiKey, stateAbbr }) {
  if (!stateAbbr) return [];
  const cached = stateCache.get(stateAbbr);
  if (cached) return cached;

  const url = `${AGENCY_BASE}/${stateAbbr}?api_key=${encodeURIComponent(apiKey)}`;
  const body = await politeFetch(url, { ttlMs: AGENCY_TTL_MS });

  // Response shape: { COUNTY_NAME: [agency, agency, ...], ... } — we flatten
  // into a single list and tag each agency with its county.
  const agencies = [];
  if (body && typeof body === "object") {
    for (const [countyKey, list] of Object.entries(body)) {
      if (!Array.isArray(list)) continue;
      for (const agency of list) {
        agencies.push({
          ori: agency.ori,
          name: agency.agency_name,
          type: agency.agency_type_name,
          county: countyKey,
          countyName: agency.counties ?? countyKey,
          stateAbbr: agency.state_abbr ?? stateAbbr,
          lat: agency.latitude ?? null,
          lng: agency.longitude ?? null,
          isNibrs: Boolean(agency.is_nibrs),
          nibrsStartDate: agency.nibrs_start_date ?? null,
        });
      }
    }
  }

  stateCache.set(stateAbbr, agencies);
  return agencies;
}

export function findNearestAgency(station, agencies, options = {}) {
  if (!Array.isArray(agencies) || agencies.length === 0) return null;
  if (!Number.isFinite(station.preciseLat) || !Number.isFinite(station.preciseLng)) return null;

  const { maxMiles = 50 } = options;

  // Score every agency that has coordinates, prioritising NIBRS reporters
  // and city PDs. We compute distance once and apply a soft penalty rather
  // than partitioning, so a city PD 5 mi away still beats a county sheriff
  // 1 mi away (city data is more granular) but a sheriff 2 mi away beats a
  // city PD 30 mi away.
  let best = null;
  for (const agency of agencies) {
    if (!Number.isFinite(agency.lat) || !Number.isFinite(agency.lng)) continue;
    const distance = haversineMiles(station.preciseLat, station.preciseLng, agency.lat, agency.lng);
    if (distance === null || distance > maxMiles) continue;

    const tierPenalty = (() => {
      if (!agency.isNibrs) return 25;
      if (agency.type === "City") return 0;
      if (agency.type === "County") return 5;
      if (agency.type === "State Police") return 15;
      return 10;
    })();

    const score = distance + tierPenalty;
    if (!best || score < best.score) {
      best = { agency, distance, score };
    }
  }

  return best;
}
