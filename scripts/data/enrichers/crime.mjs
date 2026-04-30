// Crime enricher — FBI Crime Data Explorer (CDE) agency-level summaries.
//
// API: https://cde.ucr.cjis.gov/LATEST/summarized/agency/{ORI}/{offense}
//   from / to are MM-YYYY (we always span Jan–Dec of a single year).
// Offenses: violent-crime, property-crime.
//
// Granularity is agency (city PD or county sheriff) — meaningfully better
// than the deprecated state-level /estimate endpoints. We pick the
// nearest NIBRS-reporting agency to the station's precise coordinates,
// preferring city PDs over sheriffs and state police. National rates are
// pulled from /summarized/national/{offense} for the same year so we can
// derive a comparable safetyIndex0to100 against the U.S. baseline.
//
// Coverage: not every state's small agencies are NIBRS reporters yet.
// When the nearest agency returns empty rates we walk a couple of
// fallback agencies before giving up. Stations with no precise lat/lng
// or no agency within maxRadius miles return null.

import { listAgenciesForState, findNearestAgency } from "../lib/cde-agency.mjs";

const CDE_BASE = "https://cde.ucr.cjis.gov/LATEST";
const CRIME_TTL_MS = 90 * 24 * 60 * 60 * 1000;

// CDE updates monthly with ~6 month lag for most agencies, so prefer the
// previous calendar year and fall back another year if the agency hasn't
// reported.
const PRIMARY_YEAR_OFFSET = 1;
const FALLBACK_YEAR_OFFSET = 2;

const SEARCH_RADIUS_MI = 50;
const FALLBACK_AGENCIES_TO_TRY = 3;

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
  if (!Number.isFinite(station.preciseLat) || !Number.isFinite(station.preciseLng)) {
    return null;
  }

  const agencies = await listAgenciesForState({
    politeFetch: ctx.politeFetch,
    apiKey,
    stateAbbr,
  });
  if (!agencies.length) return null;

  const candidates = collectCandidates(station, agencies);
  if (!candidates.length) return null;

  const currentYear = new Date().getUTCFullYear();
  const candidateYears = [
    currentYear - PRIMARY_YEAR_OFFSET,
    currentYear - FALLBACK_YEAR_OFFSET,
  ];

  for (const year of candidateYears) {
    for (const candidate of candidates) {
      const result = await fetchAgencyYear({
        politeFetch: ctx.politeFetch,
        apiKey,
        agency: candidate.agency,
        distance: candidate.distance,
        year,
      });
      if (result) return result;
    }
  }
  return null;
}

function collectCandidates(station, agencies) {
  const candidates = [];
  const seen = new Set();
  let pool = agencies.slice();

  for (let i = 0; i < FALLBACK_AGENCIES_TO_TRY; i += 1) {
    const best = findNearestAgency(station, pool, { maxMiles: SEARCH_RADIUS_MI });
    if (!best || seen.has(best.agency.ori)) break;
    seen.add(best.agency.ori);
    candidates.push(best);
    pool = pool.filter((a) => a.ori !== best.agency.ori);
  }
  return candidates;
}

async function fetchAgencyYear({ politeFetch, apiKey, agency, distance, year }) {
  const violentUrl = buildAgencyUrl(agency.ori, "violent-crime", year, apiKey);
  const propertyUrl = buildAgencyUrl(agency.ori, "property-crime", year, apiKey);
  const nationalViolentUrl = buildNationalUrl("violent-crime", year, apiKey);
  const nationalPropertyUrl = buildNationalUrl("property-crime", year, apiKey);

  let violentBody;
  let propertyBody;
  let nationalViolentBody;
  let nationalPropertyBody;

  try {
    [violentBody, propertyBody, nationalViolentBody, nationalPropertyBody] = await Promise.all([
      politeFetch(violentUrl, { ttlMs: CRIME_TTL_MS }),
      politeFetch(propertyUrl, { ttlMs: CRIME_TTL_MS }),
      politeFetch(nationalViolentUrl, { ttlMs: CRIME_TTL_MS }),
      politeFetch(nationalPropertyUrl, { ttlMs: CRIME_TTL_MS }),
    ]);
  } catch {
    return null;
  }

  const violentPer100k = annualizeAgencyRate(violentBody, agency.name);
  const propertyPer100k = annualizeAgencyRate(propertyBody, agency.name);
  const usViolentPer100k = annualizeNationalRate(nationalViolentBody);
  const usPropertyPer100k = annualizeNationalRate(nationalPropertyBody);

  if (violentPer100k === null && propertyPer100k === null) return null;

  const safetyIndex = computeSafetyIndex(
    violentPer100k,
    propertyPer100k,
    usViolentPer100k,
    usPropertyPer100k
  );

  return {
    areaScope: "custom",
    areaValue: `agency:${agency.ori}`,
    areaKey: agency.ori,
    radiusMiles: distance !== null && distance !== undefined ? Number(distance.toFixed(1)) : null,
    summaryData: {
      violentPer100k,
      propertyPer100k,
      usViolentPer100k,
      usPropertyPer100k,
      safetyIndex0to100: safetyIndex,
      asOfYear: year,
      agencyOri: agency.ori,
      agencyName: agency.name,
      agencyType: agency.type,
      agencyDistanceMi: distance !== null && distance !== undefined ? Number(distance.toFixed(1)) : null,
    },
    dataSource: `FBI Crime Data Explorer (${agency.name}, ${year})`,
    sourceUrl: stripKey(violentUrl),
  };
}

function buildAgencyUrl(ori, offense, year, apiKey) {
  return `${CDE_BASE}/summarized/agency/${ori}/${offense}?from=01-${year}&to=12-${year}&api_key=${encodeURIComponent(apiKey)}`;
}

function buildNationalUrl(offense, year, apiKey) {
  return `${CDE_BASE}/summarized/national/${offense}?from=01-${year}&to=12-${year}&api_key=${encodeURIComponent(apiKey)}`;
}

// CDE returns monthly per-100k rates keyed by lines like
//   { offenses: { rates: { "<Agency> Offenses": { "01-2022": 32.6, ... } } } }
// Plus state and U.S. context lines we ignore here. Annualised rate is
// the sum of the 12 monthly per-100k rates (verified against published
// BJS state-level annual rates).
export function annualizeAgencyRate(body, agencyName) {
  if (!body || !agencyName) return null;
  const lineKey = `${agencyName} Offenses`;
  return sumMonthlyRates(body?.offenses?.rates?.[lineKey]);
}

export function annualizeNationalRate(body) {
  if (!body) return null;
  const rates = body?.offenses?.rates ?? {};
  const usKey = Object.keys(rates).find((key) => key.startsWith("United States"));
  if (!usKey) return null;
  return sumMonthlyRates(rates[usKey]);
}

function sumMonthlyRates(monthly) {
  if (!monthly || typeof monthly !== "object") return null;
  let total = 0;
  let count = 0;
  for (const value of Object.values(monthly)) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      total += parsed;
      count += 1;
    }
  }
  if (count === 0) return null;
  // Scale partial-year reporting up to a 12-month rate so a station with
  // only 6 reported months isn't artificially low.
  const annualised = (total / count) * 12;
  return Number(annualised.toFixed(1));
}

export function computeSafetyIndex(violent, property, usViolent, usProperty) {
  if (violent === null || property === null || !usViolent || !usProperty) return null;
  const violentRatio = violent / usViolent;
  const propertyRatio = property / usProperty;
  const avgRatio = (violentRatio + propertyRatio) / 2;
  const score = 100 - Math.min(100, Math.max(0, avgRatio * 50));
  return Math.round(score);
}

function stripKey(url) {
  const u = new URL(url);
  u.searchParams.delete("api_key");
  return u.toString();
}
