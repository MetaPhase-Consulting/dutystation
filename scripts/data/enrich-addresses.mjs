#!/usr/bin/env node
// Geocode every CBP station via the U.S. Census Geocoder.
//
// Reads src/data/cbp_all_locations.csv, derives the same legacy_id that
// enrich-from-csv.mjs uses, calls the Census Geocoder for each row, and
// writes precise_lat/lng + county/place FIPS back to the stations table.
//
// Usage:
//   node scripts/data/enrich-addresses.mjs                # dry-run; writes JSON report
//   node scripts/data/enrich-addresses.mjs --apply        # write to Supabase
//   node scripts/data/enrich-addresses.mjs --only ID,ID   # restrict to specific stations
//   node scripts/data/enrich-addresses.mjs --since ISO    # ignore cache entries older than this
//   node scripts/data/enrich-addresses.mjs --limit 25     # only process the first N rows
//   node scripts/data/enrich-addresses.mjs --out PATH     # report path (default docs/progress/...)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { parseArgs } from "./parse-duty-stations.mjs";
import {
  buildOneLineAddress,
  dedupeRows,
  deriveLegacyId,
  eligibleRow,
  parseCsv,
} from "./lib/cbp-csv.mjs";
import { createPoliteFetch } from "./lib/polite-fetch.mjs";
import { geocodeAddress } from "./lib/census-geocoder.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const options = parseArgs();
const APPLY = options.apply === "true" || options.apply === true;
const onlyFilter = parseList(options.only);
const limit = options.limit ? Number(options.limit) : null;
const reportPath = options.out
  ? path.resolve(process.cwd(), options.out)
  : path.resolve(REPO_ROOT, "docs/progress/address-enrichment-latest.json");

const csvPath = path.resolve(REPO_ROOT, "src/data/cbp_all_locations.csv");
const overridesPath = path.resolve(REPO_ROOT, "supabase/seed/address-overrides.json");
const cacheDir = path.resolve(REPO_ROOT, "scripts/data/.cache");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (APPLY && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required when running with --apply."
  );
}

function parseList(value) {
  if (!value || value === "true") return null;
  return new Set(
    String(value)
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
  );
}

function loadOverrides() {
  if (!fs.existsSync(overridesPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(overridesPath, "utf8"));
  } catch (error) {
    console.warn(`Failed to parse address-overrides.json: ${error.message}`);
    return {};
  }
}

function loadStationsFromCsv() {
  const csvRaw = fs.readFileSync(csvPath, "utf8");
  const parsed = parseCsv(csvRaw);
  const eligible = parsed.filter(eligibleRow);
  const deduped = dedupeRows(eligible);
  const idSeen = new Map();
  return deduped.map((row) => ({
    legacyId: deriveLegacyId(row, idSeen),
    address: buildOneLineAddress(row),
    row,
  }));
}

async function loadExistingStationRows(supabase, legacyIds) {
  // Pull only the rows we care about so re-running for a subset is cheap.
  const rows = [];
  for (let index = 0; index < legacyIds.length; index += 200) {
    const segment = legacyIds.slice(index, index + 200);
    const { data, error } = await supabase
      .from("stations")
      .select(
        "id, legacy_id, lat, lng, precise_lat, precise_lng, county_fips, place_fips, address_geocoded_at"
      )
      .in("legacy_id", segment);
    if (error) throw new Error(`stations select: ${error.message}`);
    rows.push(...(data ?? []));
  }
  return new Map(rows.map((row) => [row.legacy_id, row]));
}

function buildUpdate(geocode, override, station) {
  const source = override?.source ?? geocode?.source ?? null;
  const lat = override?.preciseLat ?? geocode?.lat ?? null;
  const lng = override?.preciseLng ?? geocode?.lng ?? null;
  if (lat === null || lng === null) return null;

  return {
    precise_lat: lat,
    precise_lng: lng,
    county_name: override?.countyName ?? geocode?.countyName ?? null,
    county_fips: override?.countyFips ?? geocode?.countyFips ?? null,
    place_name: override?.placeName ?? geocode?.placeName ?? null,
    place_fips: override?.placeFips ?? geocode?.placeFips ?? null,
    address_geocoded_at: new Date().toISOString(),
    address_geocode_source: source,
  };
}

function summarize(results) {
  const totals = {
    attempted: results.length,
    matched: 0,
    overridden: 0,
    unmatched: 0,
    skippedNoStationRow: 0,
    skippedAlreadyGeocoded: 0,
  };
  for (const entry of results) {
    if (entry.skipped === "no-station-row") totals.skippedNoStationRow += 1;
    else if (entry.skipped === "already-geocoded") totals.skippedAlreadyGeocoded += 1;
    else if (entry.source?.startsWith("manual:")) totals.overridden += 1;
    else if (entry.source?.startsWith("census-geocoder:")) totals.matched += 1;
    else totals.unmatched += 1;
  }
  return totals;
}

async function run() {
  const overrides = loadOverrides();
  const stations = loadStationsFromCsv();

  const filtered = stations.filter(
    (entry) => !onlyFilter || onlyFilter.has(entry.legacyId)
  );
  const target = limit ? filtered.slice(0, limit) : filtered;

  console.log(`Loaded ${target.length} CBP stations from CSV (${stations.length} total).`);
  if (!APPLY) console.log("[dry-run] pass --apply to write to Supabase.");

  const supabase = APPLY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

  const existingByLegacyId = supabase
    ? await loadExistingStationRows(supabase, target.map((entry) => entry.legacyId))
    : new Map();

  const politeFetch = createPoliteFetch({
    cacheDir,
    perHostThrottleMs: { "geocoding.geo.census.gov": 250 },
    log: (info) => {
      if (info.error) console.warn(`polite-fetch retry: ${info.url} → ${info.error}`);
    },
  });

  const results = [];
  let processed = 0;

  for (const entry of target) {
    processed += 1;
    if (processed % 50 === 0) {
      console.log(`  …processed ${processed}/${target.length}`);
    }

    const stationRow = existingByLegacyId.get(entry.legacyId);
    const override = overrides[entry.legacyId] ?? null;

    if (APPLY && !stationRow) {
      results.push({
        legacyId: entry.legacyId,
        address: entry.address,
        skipped: "no-station-row",
      });
      continue;
    }

    if (!override && stationRow?.address_geocoded_at && stationRow?.precise_lat && stationRow?.county_fips) {
      // Already enriched in a prior run; skip unless --since forces a refresh.
      // The polite-fetch cache TTL still controls re-geocoding from the API.
      results.push({
        legacyId: entry.legacyId,
        address: entry.address,
        skipped: "already-geocoded",
        existing: {
          preciseLat: stationRow.precise_lat,
          preciseLng: stationRow.precise_lng,
          countyFips: stationRow.county_fips,
          placeFips: stationRow.place_fips,
        },
      });
      continue;
    }

    const geocode = override
      ? null
      : await geocodeAddress({ politeFetch, address: entry.address });

    const update = buildUpdate(geocode, override, stationRow);

    results.push({
      legacyId: entry.legacyId,
      address: entry.address,
      source: update?.address_geocode_source ?? null,
      countyFips: update?.county_fips ?? null,
      placeFips: update?.place_fips ?? null,
      preciseLat: update?.precise_lat ?? null,
      preciseLng: update?.precise_lng ?? null,
      matchedAddress: geocode?.matchedAddress ?? null,
      override: Boolean(override),
    });

    if (APPLY && update && stationRow) {
      const { error } = await supabase
        .from("stations")
        .update(update)
        .eq("id", stationRow.id);
      if (error) {
        console.error(`update ${entry.legacyId}: ${error.message}`);
        results[results.length - 1].applyError = error.message;
      }
    }
  }

  const totals = summarize(results);
  const report = {
    generatedAt: new Date().toISOString(),
    applied: APPLY,
    totals,
    results,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify(totals, null, 2));
  console.log(`\nReport written to ${path.relative(process.cwd(), reportPath)}.`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
