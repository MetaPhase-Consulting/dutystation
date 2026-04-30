#!/usr/bin/env node
// Backfill county_fips / place_fips on every station that has lat/lng but
// no county identifier — typically border-crossing addresses, ports of
// entry on water, and DB rows that pre-date the CSV import.
//
// Strategy: query the Census Geocoder *coordinates* endpoint (reverse
// geocoding) for every row with `precise_lat IS NOT NULL AND county_fips
// IS NULL`. Writes back county_name, county_fips, place_name, place_fips,
// address_geocoded_at, and tags the source as
// `census-geocoder-coords:<benchmark>/<vintage>`.
//
// Usage:
//   node scripts/data/backfill-station-geo.mjs           # dry-run
//   node scripts/data/backfill-station-geo.mjs --apply   # write to Supabase
//   node scripts/data/backfill-station-geo.mjs --out PATH

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { parseArgs } from "./parse-duty-stations.mjs";
import { createPoliteFetch } from "./lib/polite-fetch.mjs";
import { geocodeCoordinates } from "./lib/census-geocoder.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const options = parseArgs();
const APPLY = options.apply === "true" || options.apply === true;
const reportPath = options.out
  ? path.resolve(process.cwd(), options.out)
  : path.resolve(REPO_ROOT, "docs/progress/station-geo-backfill-latest.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const cacheDir = path.resolve(REPO_ROOT, "scripts/data/.cache");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

async function loadGapStations(supabase) {
  const rows = [];
  let offset = 0;
  const pageSize = 1000;
  for (;;) {
    const { data, error } = await supabase
      .from("stations")
      .select("id, legacy_id, name, state, precise_lat, precise_lng, county_fips")
      .is("county_fips", null)
      .not("precise_lat", "is", null)
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error(`stations select: ${error.message}`);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return rows;
}

async function run() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const stations = await loadGapStations(supabase);
  console.log(`Found ${stations.length} stations with precise_lat but no county_fips.`);
  if (!APPLY) console.log("[dry-run] pass --apply to write to Supabase.\n");

  const politeFetch = createPoliteFetch({
    cacheDir,
    perHostThrottleMs: { "geocoding.geo.census.gov": 250 },
    log: (info) => {
      if (info.error) console.warn(`polite-fetch retry: ${info.url} → ${info.error}`);
    },
  });

  let matched = 0;
  let unmatched = 0;
  const results = [];

  for (let i = 0; i < stations.length; i += 1) {
    const station = stations[i];
    if ((i + 1) % 25 === 0) console.log(`  …processed ${i + 1}/${stations.length}`);

    const geo = await geocodeCoordinates({
      politeFetch,
      lat: Number(station.precise_lat),
      lng: Number(station.precise_lng),
    });

    if (!geo) {
      unmatched += 1;
      results.push({ legacyId: station.legacy_id, status: "unmatched" });
      continue;
    }

    matched += 1;
    results.push({
      legacyId: station.legacy_id,
      countyFips: geo.countyFips,
      placeFips: geo.placeFips,
    });

    if (APPLY) {
      const { error } = await supabase
        .from("stations")
        .update({
          county_fips: geo.countyFips,
          county_name: geo.countyName,
          place_fips: geo.placeFips,
          place_name: geo.placeName,
          address_geocoded_at: new Date().toISOString(),
          address_geocode_source: geo.source,
        })
        .eq("id", station.id);
      if (error) {
        console.error(`update ${station.legacy_id}: ${error.message}`);
        results[results.length - 1].applyError = error.message;
      }
    }
  }

  console.log(`\nMatched: ${matched}, unmatched: ${unmatched}`);

  const report = {
    generatedAt: new Date().toISOString(),
    applied: APPLY,
    totals: { attempted: stations.length, matched, unmatched },
    results,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report: ${path.relative(process.cwd(), reportPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
