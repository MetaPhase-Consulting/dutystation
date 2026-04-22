import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { parseArgs } from "./parse-duty-stations.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = parseArgs();
const shouldSync = options.sync === "true" || options.sync === true;
const limit = options.limit ? Number(options.limit) : null;
const delayMs = options.delayMs ? Number(options.delayMs) : 150;
const outPath = options.out
  ? path.resolve(process.cwd(), options.out)
  : path.resolve(process.cwd(), "supabase/seed/enriched_stations.json");

const csvPath = path.resolve(process.cwd(), "src/data/cbp_all_locations.csv");
const cacheDir = path.resolve(process.cwd(), "scripts/data/.cache");
const geocodeCachePath = path.resolve(cacheDir, "openmeteo-geocode-cache.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const STATE_NAME_BY_ABBR = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california", CO: "colorado",
  CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia", HI: "hawaii", ID: "idaho",
  IL: "illinois", IN: "indiana", IA: "iowa", KS: "kansas", KY: "kentucky", LA: "louisiana",
  ME: "maine", MD: "maryland", MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi",
  MO: "missouri", MT: "montana", NE: "nebraska", NV: "nevada", NH: "new-hampshire", NJ: "new-jersey",
  NM: "new-mexico", NY: "new-york", NC: "north-carolina", ND: "north-dakota", OH: "ohio", OK: "oklahoma",
  OR: "oregon", PA: "pennsylvania", RI: "rhode-island", SC: "south-carolina", SD: "south-dakota", TN: "tennessee",
  TX: "texas", UT: "utah", VT: "vermont", VA: "virginia", WA: "washington", WV: "west-virginia",
  WI: "wisconsin", WY: "wyoming", PR: "puerto-rico", DC: "district-of-columbia",
};

const REGION_BY_STATE = {
  AZ: "Southwest", CA: "Southwest", CO: "Southwest", NM: "Southwest", NV: "Southwest", OK: "Southwest", TX: "Southwest", UT: "Southwest",
  WA: "Northwest", OR: "Northwest", ID: "Northwest", MT: "Northwest", WY: "Northwest", AK: "Northwest",
  ND: "Midwest", SD: "Midwest", NE: "Midwest", KS: "Midwest", MN: "Midwest", IA: "Midwest", MO: "Midwest", WI: "Midwest", IL: "Midwest", IN: "Midwest", MI: "Midwest", OH: "Midwest",
  ME: "Northeast", NH: "Northeast", VT: "Northeast", MA: "Northeast", RI: "Northeast", CT: "Northeast", NY: "Northeast", NJ: "Northeast", PA: "Northeast", DE: "Northeast", MD: "Northeast", DC: "Northeast",
  VA: "Southeast", WV: "Southeast", NC: "Southeast", SC: "Southeast", GA: "Southeast", FL: "Southeast", KY: "Southeast", TN: "Southeast", AL: "Southeast", MS: "Southeast", AR: "Southeast", LA: "Southeast", PR: "Southeast",
};

const STATE_CENTROIDS = {
  AL: { lat: 32.806671, lng: -86.791130 }, AK: { lat: 61.370716, lng: -152.404419 }, AZ: { lat: 33.729759, lng: -111.431221 },
  AR: { lat: 34.969704, lng: -92.373123 }, CA: { lat: 36.116203, lng: -119.681564 }, CO: { lat: 39.059811, lng: -105.311104 },
  CT: { lat: 41.597782, lng: -72.755371 }, DE: { lat: 39.318523, lng: -75.507141 }, FL: { lat: 27.766279, lng: -81.686783 },
  GA: { lat: 33.040619, lng: -83.643074 }, HI: { lat: 21.094318, lng: -157.498337 }, ID: { lat: 44.240459, lng: -114.478828 },
  IL: { lat: 40.349457, lng: -88.986137 }, IN: { lat: 39.849426, lng: -86.258278 }, IA: { lat: 42.011539, lng: -93.210526 },
  KS: { lat: 38.526600, lng: -96.726486 }, KY: { lat: 37.668140, lng: -84.670067 }, LA: { lat: 31.169546, lng: -91.867805 },
  ME: { lat: 44.693947, lng: -69.381927 }, MD: { lat: 39.063946, lng: -76.802101 }, MA: { lat: 42.230171, lng: -71.530106 },
  MI: { lat: 43.326618, lng: -84.536095 }, MN: { lat: 45.694454, lng: -93.900192 }, MS: { lat: 32.741646, lng: -89.678696 },
  MO: { lat: 38.456085, lng: -92.288368 }, MT: { lat: 46.921925, lng: -110.454353 }, NE: { lat: 41.125370, lng: -98.268082 },
  NV: { lat: 38.313515, lng: -117.055374 }, NH: { lat: 43.452492, lng: -71.563896 }, NJ: { lat: 40.298904, lng: -74.521011 },
  NM: { lat: 34.840515, lng: -106.248482 }, NY: { lat: 42.165726, lng: -74.948051 }, NC: { lat: 35.630066, lng: -79.806419 },
  ND: { lat: 47.528912, lng: -99.784012 }, OH: { lat: 40.388783, lng: -82.764915 }, OK: { lat: 35.565342, lng: -96.928917 },
  OR: { lat: 44.572021, lng: -122.070938 }, PA: { lat: 40.590752, lng: -77.209755 }, RI: { lat: 41.680893, lng: -71.511780 },
  SC: { lat: 33.856892, lng: -80.945007 }, SD: { lat: 44.299782, lng: -99.438828 }, TN: { lat: 35.747845, lng: -86.692345 },
  TX: { lat: 31.054487, lng: -97.563461 }, UT: { lat: 40.150032, lng: -111.862434 }, VT: { lat: 44.045876, lng: -72.710686 },
  VA: { lat: 37.769337, lng: -78.169968 }, WA: { lat: 47.400902, lng: -121.490494 }, WV: { lat: 38.491226, lng: -80.954453 },
  WI: { lat: 44.268543, lng: -89.616508 }, WY: { lat: 42.755966, lng: -107.302490 }, PR: { lat: 18.220833, lng: -66.590149 },
};

const REGION_RECREATION = {
  Southwest: [
    { category: "Outdoor", name: "National Parks & Hiking", description: "Public lands, trails, and scenic overlooks near station communities.", url: "https://www.nps.gov/index.htm", distanceMiles: 35 },
    { category: "Fishing", name: "State Fishing Access", description: "State-by-state fishing locations, licenses, and species guides.", url: "https://www.takeemfishing.org/", distanceMiles: 22 },
  ],
  Northwest: [
    { category: "Outdoor", name: "US Forest Service Recreation", description: "Camping, hiking, off-road, and wilderness resources.", url: "https://www.fs.usda.gov/recreation", distanceMiles: 28 },
  ],
  Midwest: [
    { category: "Outdoor", name: "State Parks Directory", description: "Locate parks, trails, and campground options nearby.", url: "https://www.stateparks.com/", distanceMiles: 30 },
  ],
  Northeast: [
    { category: "Outdoor", name: "Scenic Byways and Trails", description: "Regional trail and recreation resources for weekends and family trips.", url: "https://www.recreation.gov/", distanceMiles: 26 },
  ],
  Southeast: [
    { category: "Outdoor", name: "US Fish & Wildlife Refuges", description: "Refuge maps and recreation resources.", url: "https://www.fws.gov/refuges", distanceMiles: 24 },
  ],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, task, maxAttempts = 4) {
  let attempt = 0;
  let lastError = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts) {
        break;
      }
      await sleep(500 * attempt);
    }
  }

  throw new Error(`${label} failed after ${maxAttempts} attempts: ${lastError?.message ?? lastError}`);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCsv(content) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  const pushField = () => {
    row.push(current);
    current = "";
  };

  const pushRow = () => {
    if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
      rows.push(row);
    }
    row = [];
  };

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      pushField();
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      pushField();
      pushRow();
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    pushField();
    pushRow();
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => {
    const obj = {};
    headers.forEach((header, headerIndex) => {
      obj[header] = (values[headerIndex] ?? "").trim();
    });
    return obj;
  });
}

function getRegion(state) {
  return REGION_BY_STATE[state] ?? "Northeast";
}

function inferPositionTypes(row) {
  const text = `${row.duty_station} ${row.type} ${row.parent} ${row.address}`.toLowerCase();
  if (text.includes("air") || text.includes("marine")) {
    return ["CBPO", "AMO"];
  }
  return ["CBPO"];
}

function classifyComponent(row) {
  const text = `${row.duty_station} ${row.type} ${row.parent} ${row.address}`.toLowerCase();

  if (text.includes("air") || text.includes("marine") || text.includes("amo")) {
    return "AMO";
  }

  if (row.type === "Port of Entry" || row.type === "Field Office") {
    return "OFO";
  }

  if (row.type === "Station" && String(row.parent || "").toLowerCase().includes("sector")) {
    return "USBP";
  }

  if (row.type === "Sector") {
    return "USBP";
  }

  return "OFO";
}

function classifyFacilityType(row) {
  if (row.type === "Port of Entry") return "Port of Entry";
  if (row.type === "Field Office") return "Field Office";
  if (row.type === "Station") return "Station";
  if (row.type === "Sector") return "Sector";
  return "Other";
}

function generatedLinks(city, state) {
  const citySlug = city.replace(/\./g, "").replace(/\s+/g, "-");
  const cityUnderscore = city.replace(/\./g, "").replace(/\s+/g, "_");
  const stateLong = STATE_NAME_BY_ABBR[state] ?? state.toLowerCase();

  return {
    realEstate: `https://www.realtor.com/realestateandhomes-search/${citySlug}_${state}`,
    schools: `https://www.greatschools.org/${stateLong}/${slugify(city)}/`,
    crime: `https://www.neighborhoodscout.com/${state.toLowerCase()}/${slugify(city)}/crime`,
    costOfLiving: `https://www.bestplaces.net/cost_of_living/city/${stateLong.replace(/-/g, "_")}/${cityUnderscore.toLowerCase()}`,
    weather: `https://www.weather.gov/`,
    transit: `https://www.google.com/maps/search/public+transit+${encodeURIComponent(`${city}, ${state}`)}`,
    movingTips: "https://www.usa.gov/moving",
  };
}

function hostIs(url, host) {
  try {
    const h = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return h === host.toLowerCase();
  } catch {
    return false;
  }
}

function inferLinkStatus(url) {
  if (!url) return { is_valid: false, http_status: 0 };
  // Hostname match avoids CodeQL's js/incomplete-url-substring-sanitization
  // pattern (substring check can match attacker-controlled paths).
  if (
    hostIs(url, "weather.gov") ||
    (hostIs(url, "google.com") && url.includes("/maps/search")) ||
    (hostIs(url, "maps.google.com") && url.includes("/maps/search"))
  ) {
    return { is_valid: true, http_status: 200 };
  }
  return { is_valid: null, http_status: null };
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(geocodeCachePath, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(geocodeCachePath, JSON.stringify(cache, null, 2));
}

async function geocodeCityState(city, state, cache) {
  const key = `${city}|${state}`;
  if (cache[key]) {
    return cache[key];
  }

  const query = encodeURIComponent(city);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=25&language=en&format=json`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": "dutystation-enrichment/1.0" },
    });
    const json = await response.json();
    const targetState = STATE_NAME_BY_ABBR[state]?.replace(/-/g, " ") ?? "";

    const results = json?.results ?? [];
    const result = results.find((candidate) => {
      const isUs = candidate.country_code === "US";
      const admin = String(candidate.admin1 || "").toLowerCase();
      const adminMatch = !targetState || admin.includes(targetState.toLowerCase());
      return isUs && adminMatch;
    }) ?? results.find((candidate) => candidate.country_code === "US") ?? results[0];

    if (result?.latitude && result?.longitude) {
      cache[key] = { lat: result.latitude, lng: result.longitude };
    } else {
      cache[key] = STATE_CENTROIDS[state] ?? { lat: 39.8283, lng: -98.5795 };
    }
  } catch {
    cache[key] = STATE_CENTROIDS[state] ?? { lat: 39.8283, lng: -98.5795 };
  }

  await sleep(delayMs);
  return cache[key];
}

function dedupeRows(rows) {
  const seen = new Set();
  const deduped = [];

  for (const row of rows) {
    const key = `${row.duty_station}|${row.city}|${row.state}|${row.zip}`.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(row);
  }

  return deduped;
}

async function buildEnrichedStations() {
  const csvRaw = fs.readFileSync(csvPath, "utf8");
  const parsed = parseCsv(csvRaw);

  const eligibleRows = parsed.filter((row) => row.duty_station && row.city && row.state && row.zip);
  const dedupedRows = dedupeRows(eligibleRows);
  const rows = limit ? dedupedRows.slice(0, limit) : dedupedRows;

  const cache = loadCache();
  const idSeen = new Map();

  const stations = [];

  for (const row of rows) {
    const city = row.city.replace(/\s+/g, " ").trim();
    const state = row.state.trim().toUpperCase();
    const zipCode = String(row.zip).replace(/[^0-9]/g, "").slice(0, 5) || "00000";
    const region = getRegion(state);

    const coords = await geocodeCityState(city, state, cache);

    const baseId = `cbp-${slugify(row.duty_station)}-${state.toLowerCase()}-${zipCode}`;
    const count = (idSeen.get(baseId) ?? 0) + 1;
    idSeen.set(baseId, count);
    const legacyId = count > 1 ? `${baseId}-${count}` : baseId;

    const links = generatedLinks(city, state);
    const linkMap = Object.entries(links).reduce((acc, [category, url]) => {
      const status = inferLinkStatus(url);
      acc[category] = {
        category,
        url,
        originalUrl: url,
        isRemediated: false,
        remediationReason: null,
        remediatedAt: null,
        isValid: status.is_valid,
        statusCode: status.http_status,
        lastCheckedAt: null,
        resolvedUrl: null,
      };
      return acc;
    }, {});

    const recreation = (REGION_RECREATION[region] ?? []).map((item, index) => ({
      id: `${legacyId}-recreation-${index + 1}`,
      category: item.category,
      name: item.name,
      description: item.description,
      url: item.url,
      distanceMiles: item.distanceMiles,
    }));

    stations.push({
      id: legacyId,
      name: row.duty_station,
      city,
      state,
      zipCode,
      sector: row.parent || row.type || "CBP",
      lat: coords.lat,
      lng: coords.lng,
      region,
      description: `${row.duty_station} is listed by CBP as a ${String(row.type || "duty location").toLowerCase()}${row.parent ? ` under ${row.parent}` : ""}.`,
      componentType: classifyComponent(row),
      facilityType: classifyFacilityType(row),
      sourceType: row.type || null,
      sourceParent: row.parent || null,
      sourceUrl: row.url || null,
      positionTypes: inferPositionTypes(row),
      attributes: {
        incentiveEligible: false,
        incentiveLabel: null,
        disclaimerApplies: true,
      },
      links: linkMap,
      recreation,
      source: {
        type: row.type,
        parent: row.parent,
        address: row.address,
        phone: row.phone,
        cbpUrl: row.url,
      },
    });
  }

  saveCache(cache);
  return stations;
}

async function syncToSupabase(stations) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for --sync");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const chunk = async (table, rows, onConflict) => {
    for (let index = 0; index < rows.length; index += 200) {
      const segment = rows.slice(index, index + 200);
      const { error } = await withRetry(`${table} upsert chunk`, () =>
        supabase.from(table).upsert(segment, { onConflict })
      );
      if (error) {
        throw new Error(`Failed upsert ${table}: ${error.message}`);
      }
    }
  };

  const stationRows = stations.map((station) => ({
    legacy_id: station.id,
    name: station.name,
    city: station.city,
    state: station.state,
    zip_code: station.zipCode,
    sector: station.sector,
    lat: station.lat,
    lng: station.lng,
    region: station.region,
    description: station.description,
    component_type: station.componentType,
    facility_type: station.facilityType,
    source_type: station.sourceType,
    source_parent: station.sourceParent,
    source_url: station.sourceUrl,
  }));

  await chunk("stations", stationRows, "legacy_id");

  const { data: dbStations, error: stationError } = await withRetry(
    "fetch synced station ids",
    () =>
      supabase
        .from("stations")
        .select("id,legacy_id")
  );

  if (stationError || !dbStations) {
    throw new Error(`Failed to retrieve synced station ids: ${stationError?.message}`);
  }

  const syncedIdSet = new Set(stations.map((station) => station.id));
  const idMap = new Map(
    dbStations.filter((row) => syncedIdSet.has(row.legacy_id)).map((row) => [row.legacy_id, row.id])
  );

  const attributeRows = stations.map((station) => ({
    station_id: idMap.get(station.id),
    incentive_eligible: station.attributes.incentiveEligible,
    incentive_label: station.attributes.incentiveLabel,
    disclaimer_applies: station.attributes.disclaimerApplies,
  }));
  await chunk("station_attributes", attributeRows, "station_id");

  const stationIds = attributeRows.map((row) => row.station_id).filter(Boolean);
  await withRetry("delete station_positions for station ids", () =>
    supabase.from("station_positions").delete().in("station_id", stationIds)
  );
  await withRetry("delete recreation_resources for station ids", () =>
    supabase.from("recreation_resources").delete().in("station_id", stationIds)
  );

  const positionRows = stations.flatMap((station) =>
    station.positionTypes.map((positionType) => ({
      station_id: idMap.get(station.id),
      position_type: positionType,
    }))
  );
  await chunk("station_positions", positionRows, "station_id,position_type");

  const linkRows = stations.flatMap((station) =>
    Object.entries(station.links).map(([category, link]) => ({
      station_id: idMap.get(station.id),
      category,
      url: link.url,
      original_url: link.originalUrl ?? link.url,
      is_remediated: link.isRemediated,
      remediation_reason: link.remediationReason,
      remediated_at: link.remediatedAt,
      is_valid: link.isValid,
      http_status: link.statusCode,
      last_checked_at: null,
      resolved_url: link.resolvedUrl,
    }))
  );
  await chunk("station_links", linkRows, "station_id,category");

  const recreationRows = stations.flatMap((station) =>
    station.recreation.map((resource) => ({
      station_id: idMap.get(station.id),
      category: resource.category,
      name: resource.name,
      description: resource.description,
      url: resource.url,
      distance_miles: resource.distanceMiles,
    }))
  );

  for (let index = 0; index < recreationRows.length; index += 200) {
    const segment = recreationRows.slice(index, index + 200);
    const { error } = await withRetry("insert recreation_resources chunk", () =>
      supabase.from("recreation_resources").insert(segment)
    );
    if (error) {
      throw new Error(`Failed insert recreation_resources: ${error.message}`);
    }
  }

  return {
    stationsSynced: stationRows.length,
    attributesSynced: attributeRows.length,
    positionsSynced: positionRows.length,
    linksSynced: linkRows.length,
    recreationSynced: recreationRows.length,
  };
}

async function run() {
  const stations = await buildEnrichedStations();

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(stations, null, 2));

  const result = {
    outputPath: outPath,
    generated: stations.length,
    synced: false,
  };

  if (shouldSync) {
    result.syncSummary = await syncToSupabase(stations);
    result.synced = true;
  }

  console.log(JSON.stringify(result, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
