#!/usr/bin/env node
// Seed the alpha summary data set (first 10 alphabetical Border Patrol stations)
// into Supabase. Reads supabase/seed/summary-alpha.json.
//
// Usage:
//   node scripts/data/seed-summary-alpha.mjs          # dry-run (prints plan, no writes)
//   node scripts/data/seed-summary-alpha.mjs --apply  # write to Supabase

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, "..", "..", "supabase", "seed", "summary-alpha.json");
const APPLY = process.argv.includes("--apply");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (APPLY && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required when running with --apply."
  );
}

const seed = JSON.parse(readFileSync(SEED_PATH, "utf-8"));
const stations = seed.stations;

console.log(`Loaded ${stations.length} alpha stations from summary-alpha.json`);
if (!APPLY) {
  console.log("[dry-run] pass --apply to write to Supabase.\n");
}

if (!APPLY) {
  for (const entry of stations) {
    const summaryCount = Object.keys(entry.summaries).length;
    console.log(`  ${entry.stationId}: address + ${summaryCount} summaries`);
  }
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

let stationUpdates = 0;
let summaryUpserts = 0;
const errors = [];

for (const entry of stations) {
  const { stationId, address, summaries } = entry;

  // Find the Supabase row. legacy_id is the canonical join key.
  const { data: stationRow, error: lookupError } = await supabase
    .from("stations")
    .select("id")
    .eq("legacy_id", stationId)
    .maybeSingle();

  if (lookupError) {
    errors.push({ stationId, stage: "lookup", error: lookupError.message });
    continue;
  }
  if (!stationRow?.id) {
    errors.push({ stationId, stage: "lookup", error: "no matching row in stations" });
    continue;
  }

  // Update address columns.
  const { error: addrError } = await supabase
    .from("stations")
    .update({
      street_address: address.streetAddress,
      precise_lat: address.preciseLat,
      precise_lng: address.preciseLng,
      county_name: address.countyName,
      county_fips: address.countyFips,
      place_name: address.placeName,
      place_fips: address.placeFips,
      zip_code: address.zip ?? null,
      address_geocoded_at: new Date().toISOString(),
      address_geocode_source: address.source ?? "manual:2026-04",
    })
    .eq("id", stationRow.id);

  if (addrError) {
    errors.push({ stationId, stage: "update-address", error: addrError.message });
    continue;
  }
  stationUpdates++;

  // Upsert one row per (station, category).
  const rows = Object.entries(summaries).map(([category, summary]) => ({
    station_id: stationRow.id,
    category,
    area_scope: summary.areaScope,
    area_value: summary.areaValue,
    area_key: summary.areaKey,
    radius_miles: summary.radiusMiles ?? null,
    summary_data: summary.summaryData,
    data_source: summary.dataSource,
    source_url: summary.sourceUrl ?? null,
    fetched_at: new Date().toISOString(),
  }));

  const { error: upsertError } = await supabase
    .from("station_category_summaries")
    .upsert(rows, { onConflict: "station_id,category" });

  if (upsertError) {
    errors.push({ stationId, stage: "upsert-summaries", error: upsertError.message });
    continue;
  }
  summaryUpserts += rows.length;
}

console.log(`\nDone. station address updates: ${stationUpdates}; summary upserts: ${summaryUpserts}`);
if (errors.length) {
  console.error(`${errors.length} error(s):`);
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
