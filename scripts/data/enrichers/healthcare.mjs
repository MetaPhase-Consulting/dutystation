// Healthcare enricher — counts hospitals within 25mi and finds the
// nearest by great-circle distance, using the HIFLD open hospitals
// dataset (Homeland Infrastructure Foundation-Level Data, FEMA).
//
// Source:
//   https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/
//     Hospitals/FeatureServer/0/query
//
// HIFLD aggregates state license rolls + Medicare provider data into a
// single geocoded feature class; coverage is the entire United States
// and territories. We pull every OPEN U.S. hospital once per run
// (cached on disk by polite-fetch with a 90-day TTL) and run the
// haversine math in-memory per station.
//
// nearestVaMi is left null until a follow-up — VA's Facilities API
// requires a developer key from developer.va.gov.

import { haversineMiles } from "../lib/haversine.mjs";

const HIFLD_URL =
  "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Hospitals/FeatureServer/0/query?" +
  new URLSearchParams({
    where: "COUNTRY = 'USA' AND STATUS = 'OPEN'",
    outFields: "ID,NAME,LATITUDE,LONGITUDE,STATE,TYPE",
    f: "json",
    resultRecordCount: "10000",
  }).toString();

const HOSPITAL_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const RADIUS_MI = 25;

// Module-level memoization: the orchestrator calls fetchForStation
// hundreds of times, but the hospitals dataset only needs to be
// loaded once per process.
let hospitalsPromise = null;

export const category = "healthcare";

export async function fetchForStation(station, ctx) {
  if (!Number.isFinite(station.preciseLat) || !Number.isFinite(station.preciseLng)) return null;

  const hospitals = await loadHospitals(ctx.politeFetch);
  if (!hospitals.length) return null;

  const nearby = [];
  let nearest = null;
  for (const hospital of hospitals) {
    const distance = haversineMiles(
      station.preciseLat,
      station.preciseLng,
      hospital.lat,
      hospital.lng
    );
    if (distance === null) continue;
    if (distance <= RADIUS_MI) nearby.push({ hospital, distance });
    if (!nearest || distance < nearest.distance) nearest = { hospital, distance };
  }

  if (!nearest) return null;

  return {
    areaScope: "radius",
    areaValue: `${RADIUS_MI}mi`,
    areaKey: null,
    radiusMiles: RADIUS_MI,
    summaryData: {
      hospitalsWithin25mi: nearby.length,
      nearestHospitalName: nearest.hospital.name,
      nearestHospitalMi: Number(nearest.distance.toFixed(1)),
      nearestVaMi: null,
    },
    dataSource: "HIFLD U.S. Hospitals",
    sourceUrl: HIFLD_URL,
  };
}

async function loadHospitals(politeFetch) {
  if (!hospitalsPromise) {
    hospitalsPromise = (async () => {
      const body = await politeFetch(HIFLD_URL, { ttlMs: HOSPITAL_TTL_MS });
      return parseHifld(body);
    })();
  }
  return hospitalsPromise;
}

export function parseHifld(body) {
  const features = body?.features ?? [];
  const out = [];
  for (const feature of features) {
    const attrs = feature?.attributes ?? {};
    const lat = Number(attrs.LATITUDE);
    const lng = Number(attrs.LONGITUDE);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    if (Math.abs(lat) < 0.01 && Math.abs(lng) < 0.01) continue; // null-island sentinels
    out.push({
      id: attrs.ID,
      name: cleanName(attrs.NAME),
      state: attrs.STATE,
      type: attrs.TYPE,
      lat,
      lng,
    });
  }
  return out;
}

function cleanName(name) {
  if (!name) return null;
  return String(name).replace(/\s+/g, " ").trim();
}

// Test helper. Lets unit tests run independent of one another.
export function _resetHospitalCache() {
  hospitalsPromise = null;
}
