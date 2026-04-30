// Weather enricher — NOAA NCEI Climate Normals (1991–2020, monthly).
//
// Two-step pipeline:
//   1. Find the nearest weather station that publishes monthly normals
//      via /cdo-web/api/v2/stations?extent=..&datasetid=NORMAL_MLY
//   2. Fetch monthly normal datatypes for that station via
//      /cdo-web/api/v2/data?datasetid=NORMAL_MLY&stationid=..&datatypeid=..
//
// Authoritative U.S.-government source. Tokenized — free signup at
// https://www.ncdc.noaa.gov/cdo-web/token.
//
// Datatype IDs we pull:
//   MLY-TMAX-NORMAL   monthly max temp   (tenths of °F)
//   MLY-TMIN-NORMAL   monthly min temp   (tenths of °F)
//   MLY-PRCP-NORMAL   monthly precipitation (hundredths of inches)
//   MLY-SNOW-NORMAL   monthly snowfall   (tenths of inches)
//
// summerHighF = max(MLY-TMAX) across 12 months (typically Jul/Aug).
// winterLowF  = min(MLY-TMIN) across 12 months (typically Jan).
// annualPrecipIn = sum(MLY-PRCP) / 100.
// annualSnowIn   = sum(MLY-SNOW) / 10.
// sunnyDays — NCEI does not publish this in NORMAL_MLY; left null.

import { haversineMiles } from "../lib/haversine.mjs";

const NCEI_BASE = "https://www.ncei.noaa.gov/cdo-web/api/v2";
const NORMALS_DATASET = "NORMAL_MLY";
const STATIONS_TTL_MS = 365 * 24 * 60 * 60 * 1000;
const NORMALS_TTL_MS = 365 * 24 * 60 * 60 * 1000;
const SEARCH_RADIUS_DEG = 0.5;
const NORMALS_DATATYPES = [
  "MLY-TMAX-NORMAL",
  "MLY-TMIN-NORMAL",
  "MLY-PRCP-NORMAL",
  "MLY-SNOW-NORMAL",
];

export const category = "weather";

export async function fetchForStation(station, ctx) {
  const token = process.env.NOAA_CDO_TOKEN;
  if (!token) {
    throw new Error(
      "NOAA_CDO_TOKEN env var required (free signup at https://www.ncdc.noaa.gov/cdo-web/token)"
    );
  }
  if (!Number.isFinite(station.preciseLat) || !Number.isFinite(station.preciseLng)) return null;

  const nearest = await findNearestStation({
    politeFetch: ctx.politeFetch,
    token,
    lat: station.preciseLat,
    lng: station.preciseLng,
  });
  if (!nearest) return null;

  const normals = await fetchNormals({
    politeFetch: ctx.politeFetch,
    token,
    stationId: nearest.id,
  });
  const summary = buildSummary(normals);
  if (!summary) return null;

  return {
    areaScope: "radius",
    areaValue: nearest.name ?? nearest.id,
    areaKey: nearest.id,
    radiusMiles: nearest.distance !== null ? Number(nearest.distance.toFixed(1)) : null,
    summaryData: summary,
    dataSource: `NOAA NCEI Climate Normals 1991-2020 (station ${nearest.id})`,
    sourceUrl: `https://www.ncei.noaa.gov/access/us-climate-normals/`,
  };
}

async function findNearestStation({ politeFetch, token, lat, lng }) {
  // NCEI's stations endpoint accepts an `extent=south,west,north,east` box.
  // Search a 1-degree square around the station — that's roughly 70 miles
  // square at temperate latitudes, plenty for finding a normal-publishing
  // station. If the first search returns nothing, expand once.
  for (const padding of [SEARCH_RADIUS_DEG, SEARCH_RADIUS_DEG * 2]) {
    const south = lat - padding;
    const west = lng - padding;
    const north = lat + padding;
    const east = lng + padding;
    const url = `${NCEI_BASE}/stations?datasetid=${NORMALS_DATASET}&extent=${south},${west},${north},${east}&limit=1000`;
    const body = await politeFetch(url, {
      ttlMs: STATIONS_TTL_MS,
      headers: { token },
    });
    const candidates = pickStationCandidates(body, lat, lng);
    if (candidates.length) return candidates[0];
  }
  return null;
}

export function pickStationCandidates(body, lat, lng) {
  const stations = body?.results ?? [];
  return stations
    .map((station) => ({
      id: station.id,
      name: station.name,
      lat: Number(station.latitude),
      lng: Number(station.longitude),
      distance: haversineMiles(lat, lng, Number(station.latitude), Number(station.longitude)),
    }))
    .filter((station) => station.distance !== null && Number.isFinite(station.distance))
    .sort((a, b) => a.distance - b.distance);
}

async function fetchNormals({ politeFetch, token, stationId }) {
  const url =
    `${NCEI_BASE}/data?datasetid=${NORMALS_DATASET}&stationid=${encodeURIComponent(stationId)}` +
    `&datatypeid=${NORMALS_DATATYPES.join(",")}` +
    `&startdate=2010-01-01&enddate=2010-12-01&limit=1000`;
  const body = await politeFetch(url, {
    ttlMs: NORMALS_TTL_MS,
    headers: { token },
  });
  return body?.results ?? [];
}

export function buildSummary(records) {
  if (!Array.isArray(records) || records.length === 0) return null;

  // Group by datatype.
  const buckets = { tmax: [], tmin: [], prcp: [], snow: [] };
  for (const record of records) {
    const value = Number(record.value);
    if (!Number.isFinite(value)) continue;
    if (record.datatype === "MLY-TMAX-NORMAL") buckets.tmax.push(value);
    else if (record.datatype === "MLY-TMIN-NORMAL") buckets.tmin.push(value);
    else if (record.datatype === "MLY-PRCP-NORMAL") buckets.prcp.push(value);
    else if (record.datatype === "MLY-SNOW-NORMAL") buckets.snow.push(value);
  }

  const tmaxF = buckets.tmax.map((v) => v / 10);
  const tminF = buckets.tmin.map((v) => v / 10);

  const avgHighF = avg(tmaxF);
  const avgLowF = avg(tminF);
  const summerHighF = tmaxF.length ? Number(Math.max(...tmaxF).toFixed(1)) : null;
  const winterLowF = tminF.length ? Number(Math.min(...tminF).toFixed(1)) : null;
  const annualPrecipIn =
    buckets.prcp.length === 12
      ? Number((buckets.prcp.reduce((sum, v) => sum + v, 0) / 100).toFixed(1))
      : null;
  const annualSnowIn =
    buckets.snow.length
      ? Number((buckets.snow.reduce((sum, v) => sum + v, 0) / 10).toFixed(1))
      : null;

  if (
    avgHighF === null &&
    avgLowF === null &&
    summerHighF === null &&
    winterLowF === null &&
    annualPrecipIn === null &&
    annualSnowIn === null
  ) {
    return null;
  }

  return {
    avgHighF,
    avgLowF,
    summerHighF,
    winterLowF,
    annualPrecipIn,
    annualSnowIn,
    sunnyDays: null,
    climateLabel: classifyClimate({ summerHighF, winterLowF, annualPrecipIn, annualSnowIn }),
  };
}

function avg(values) {
  if (!values.length) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Number((sum / values.length).toFixed(1));
}

// Köppen-light label. Not climatologically precise — purely a UX hint.
function classifyClimate({ summerHighF, winterLowF, annualPrecipIn, annualSnowIn }) {
  if (summerHighF === null && winterLowF === null && annualPrecipIn === null) return null;
  if (annualPrecipIn !== null && annualPrecipIn < 12) return "Arid";
  if (annualPrecipIn !== null && annualPrecipIn < 20) return "Semi-arid";
  if (winterLowF !== null && winterLowF < 10) return "Cold";
  if (summerHighF !== null && summerHighF > 95 && (annualPrecipIn ?? 0) < 25) return "Hot Desert";
  if (annualSnowIn !== null && annualSnowIn > 30) return "Snowy";
  if (summerHighF !== null && summerHighF > 90 && (annualPrecipIn ?? 0) > 40) return "Humid Subtropical";
  if (annualPrecipIn !== null && annualPrecipIn > 50) return "Wet";
  return "Temperate";
}
