#!/usr/bin/env node
// Backfill cbsa_code / cbsa_title on every station whose county_fips falls in
// a Metropolitan Statistical Area, using the static crosswalk derived from
// the U.S. Census OMB delineation file.
//
// Stations whose county is non-metro (Micropolitan or unaffiliated) keep
// cbsa_code null; downstream enrichers fall back to state-level data.
//
// Usage:
//   node scripts/data/backfill-cbsa.mjs            # dry-run; reports counts
//   node scripts/data/backfill-cbsa.mjs --apply    # write to Supabase
//   node scripts/data/backfill-cbsa.mjs --out PATH # report path

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { parseArgs } from "./parse-duty-stations.mjs";
import { COUNTY_FIPS_TO_CBSA } from "./static/county-cbsa.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const options = parseArgs();
const APPLY = options.apply === "true" || options.apply === true;
const reportPath = options.out
  ? path.resolve(process.cwd(), options.out)
  : path.resolve(REPO_ROOT, "docs/progress/cbsa-backfill-latest.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

async function loadStations(supabase) {
  const rows = [];
  let offset = 0;
  const pageSize = 1000;
  for (;;) {
    const { data, error } = await supabase
      .from("stations")
      .select("id, legacy_id, name, state, county_fips, county_name, cbsa_code, cbsa_title")
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

  const stations = await loadStations(supabase);
  console.log(`Loaded ${stations.length} stations.`);
  if (!APPLY) console.log("[dry-run] pass --apply to write to Supabase.\n");

  let metro = 0;
  let nonMetro = 0;
  let noCounty = 0;
  let unchanged = 0;
  const updates = [];

  for (const station of stations) {
    if (!station.county_fips) {
      noCounty += 1;
      continue;
    }
    const match = COUNTY_FIPS_TO_CBSA[station.county_fips] ?? null;
    if (!match) {
      nonMetro += 1;
      if (station.cbsa_code !== null && APPLY) {
        // station was previously tagged metro but the crosswalk no longer
        // shows it — clear the stale tag.
        updates.push({ id: station.id, cbsa_code: null, cbsa_title: null });
      }
      continue;
    }
    metro += 1;
    if (station.cbsa_code === match.cbsa && station.cbsa_title === match.title) {
      unchanged += 1;
      continue;
    }
    updates.push({ id: station.id, cbsa_code: match.cbsa, cbsa_title: match.title });
  }

  console.log(`Metro counties: ${metro} (${unchanged} unchanged, ${updates.length} to write)`);
  console.log(`Non-metro counties: ${nonMetro}`);
  console.log(`No county_fips on row: ${noCounty}`);

  if (APPLY && updates.length) {
    console.log(`\nWriting ${updates.length} updates...`);
    for (let index = 0; index < updates.length; index += 200) {
      const segment = updates.slice(index, index + 200);
      for (const update of segment) {
        const { error } = await supabase
          .from("stations")
          .update({ cbsa_code: update.cbsa_code, cbsa_title: update.cbsa_title })
          .eq("id", update.id);
        if (error) {
          console.error(`update ${update.id}: ${error.message}`);
        }
      }
    }
    console.log("Done.");
  }

  const report = {
    generatedAt: new Date().toISOString(),
    applied: APPLY,
    totals: { metro, nonMetro, noCounty, unchanged, written: APPLY ? updates.length : 0 },
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${path.relative(process.cwd(), reportPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
