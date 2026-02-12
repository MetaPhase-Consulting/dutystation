import { createClient } from "@supabase/supabase-js";
import { normalizeCity, parseLegacyDutyStations } from "./parse-duty-stations.mjs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const INCENTIVE_STATIONS = new Set([
  "ajo-station",
  "douglas-station",
  "three-points-station",
  "rangeley-station",
  "warroad-station",
  "sanderson-station",
  "presidio-station",
  "sonoita-station",
  "houlton-station",
  "havre-station",
  "blythe-station",
  "fort-kent-station",
]);

const REGION_RECREATION = {
  Southwest: [
    {
      category: "Outdoor",
      name: "National Parks & Hiking",
      description: "Public lands, trails, and scenic overlooks near station communities.",
      url: "https://www.nps.gov/index.htm",
      distance_miles: 35,
    },
    {
      category: "Fishing",
      name: "State Fishing Access",
      description: "State-by-state fishing locations, licenses, and species guides.",
      url: "https://www.takeemfishing.org/",
      distance_miles: 22,
    },
  ],
  Northwest: [
    {
      category: "Outdoor",
      name: "US Forest Service Recreation",
      description: "Camping, hiking, off-road, and wilderness resources.",
      url: "https://www.fs.usda.gov/recreation",
      distance_miles: 28,
    },
    {
      category: "Fishing",
      name: "NOAA Fisheries Recreation",
      description: "Regional recreational fishing information and seasons.",
      url: "https://www.fisheries.noaa.gov/recreational-fishing",
      distance_miles: 18,
    },
  ],
  Midwest: [
    {
      category: "Outdoor",
      name: "State Parks Directory",
      description: "Locate parks, trails, and campground options nearby.",
      url: "https://www.stateparks.com/",
      distance_miles: 30,
    },
  ],
  Northeast: [
    {
      category: "Outdoor",
      name: "Scenic Byways and Trails",
      description: "Regional trail and recreation resources for weekends and family trips.",
      url: "https://www.recreation.gov/",
      distance_miles: 26,
    },
  ],
  Southeast: [
    {
      category: "Outdoor",
      name: "US Fish & Wildlife Refuges",
      description: "Refuge maps, hunting/fishing access, and wildlife recreation.",
      url: "https://www.fws.gov/refuges",
      distance_miles: 24,
    },
  ],
};

const TRAVEL_RESOURCES = [
  {
    category: "flight",
    name: "Expedia",
    description: "Flight search and booking options for pre-academy travel planning.",
    url: "https://www.expedia.com/",
    display_order: 1,
  },
  {
    category: "hotel",
    name: "Travelocity",
    description: "Hotel and lodging options for pre-academy relocation travel.",
    url: "https://www.travelocity.com/",
    display_order: 2,
  },
  {
    category: "car-rental",
    name: "Kayak",
    description: "Rental car and transportation comparison across carriers.",
    url: "https://www.kayak.com/",
    display_order: 3,
  },
];

function chunkArray(values, chunkSize) {
  const chunks = [];
  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize));
  }

  return chunks;
}

function inferLinkHealth(url) {
  if (!url) {
    return { is_valid: false, http_status: 0 };
  }

  if (url.includes("moving.com") || url.includes("/y/9999/")) {
    return { is_valid: false, http_status: 404 };
  }

  if (url.includes("rome2rio.com")) {
    return { is_valid: null, http_status: null };
  }

  return { is_valid: true, http_status: 200 };
}

async function upsertInChunks(table, rows, onConflict) {
  for (const chunk of chunkArray(rows, 200)) {
    const { error } = await supabase.from(table).upsert(chunk, { onConflict });
    if (error) {
      throw new Error(`Upsert failed for ${table}: ${error.message}`);
    }
  }
}

async function insertInChunks(table, rows) {
  for (const chunk of chunkArray(rows, 200)) {
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      throw new Error(`Insert failed for ${table}: ${error.message}`);
    }
  }
}

async function seed() {
  const legacyStations = parseLegacyDutyStations();

  const stations = legacyStations
    .filter((station) => station.lat !== null && station.lng !== null)
    .map((station) => ({
      legacy_id: station.id,
      name: station.name,
      city: normalizeCity(station.city),
      state: station.state,
      zip_code: station.zipCode,
      sector: station.sector,
      lat: station.lat,
      lng: station.lng,
      region: station.region,
      description: station.description,
      component_type: "USBP",
      facility_type: "Station",
      source_type: "Station",
      source_parent: station.sector,
      source_url: null,
    }));

  await upsertInChunks("stations", stations, "legacy_id");

  const { data: dbStations, error: stationSelectError } = await supabase
    .from("stations")
    .select("id,legacy_id,region");

  if (stationSelectError || !dbStations) {
    throw new Error(`Unable to query station IDs: ${stationSelectError?.message}`);
  }

  const stationIdByLegacy = new Map(dbStations.map((station) => [station.legacy_id, station.id]));
  const regionByLegacy = new Map(dbStations.map((station) => [station.legacy_id, station.region]));

  const attributes = stations.map((station) => ({
    station_id: stationIdByLegacy.get(station.legacy_id),
    incentive_eligible: INCENTIVE_STATIONS.has(station.legacy_id),
    incentive_label: INCENTIVE_STATIONS.has(station.legacy_id) ? "Incentive Eligible" : null,
    disclaimer_applies: true,
  }));

  await upsertInChunks("station_attributes", attributes, "station_id");

  await supabase.from("station_positions").delete().in("station_id", attributes.map((row) => row.station_id));

  const stationPositions = attributes.map((row) => ({
    station_id: row.station_id,
    position_type: "BPA",
  }));

  await upsertInChunks("station_positions", stationPositions, "station_id,position_type");
  await upsertInChunks("travel_resources", TRAVEL_RESOURCES, "name");

  const links = legacyStations.flatMap((station) => {
    const stationId = stationIdByLegacy.get(station.id);
    if (!stationId) {
      return [];
    }

    return Object.entries(station.links).map(([category, url]) => {
      const status = inferLinkHealth(url);
      return {
        station_id: stationId,
        category,
        url,
        original_url: url,
        is_remediated: false,
        remediation_reason: null,
        remediated_at: null,
        is_valid: status.is_valid,
        http_status: status.http_status,
        last_checked_at: null,
        resolved_url: null,
      };
    });
  });

  await upsertInChunks("station_links", links, "station_id,category");

  await supabase
    .from("recreation_resources")
    .delete()
    .in("station_id", attributes.map((row) => row.station_id));

  const recreation = [];
  for (const station of stations) {
    const stationId = stationIdByLegacy.get(station.legacy_id);
    if (!stationId) {
      continue;
    }

    const region = regionByLegacy.get(station.legacy_id);
    const resources = REGION_RECREATION[region] ?? [];

    for (const resource of resources) {
      recreation.push({
        station_id: stationId,
        ...resource,
      });
    }
  }

  if (recreation.length) {
    await insertInChunks("recreation_resources", recreation);
  }

  console.log(
    JSON.stringify(
      {
        stations: stations.length,
        attributes: attributes.length,
        stationPositions: stationPositions.length,
        links: links.length,
        recreation: recreation.length,
        travelResources: TRAVEL_RESOURCES.length,
      },
      null,
      2
    )
  );
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
