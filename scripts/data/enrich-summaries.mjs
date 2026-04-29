#!/usr/bin/env node
// Orchestrates per-category enrichment for every station and writes
// docs/progress/summary-enrichment-latest.json. With --apply, upserts
// to station_category_summaries.
//
// Usage:
//   node scripts/data/enrich-summaries.mjs                          # dry-run
//   node scripts/data/enrich-summaries.mjs --apply                  # write to Supabase
//   node scripts/data/enrich-summaries.mjs --category weather,crime # subset
//   node scripts/data/enrich-summaries.mjs --only ID1,ID2           # restrict to stations
//   node scripts/data/enrich-summaries.mjs --since ISO              # cache bypass cutoff
//   node scripts/data/enrich-summaries.mjs --out PATH               # report path
//
// Each enricher exports `fetchForStation(station, ctx)` returning
// { areaScope, areaValue, areaKey, radiusMiles, summaryData, dataSource, sourceUrl }
// or null. The orchestrator handles batching, error capture, and the
// JSON report shape consumed by validate-summary-coverage.mjs.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { parseArgs } from "./parse-duty-stations.mjs";
import { createPoliteFetch } from "./lib/polite-fetch.mjs";
import * as weather from "./enrichers/weather.mjs";
import * as schools from "./enrichers/schools.mjs";
import * as crime from "./enrichers/crime.mjs";
import * as costOfLiving from "./enrichers/cost-of-living.mjs";
import * as realEstate from "./enrichers/real-estate.mjs";
import * as transit from "./enrichers/transit.mjs";
import * as demographics from "./enrichers/demographics.mjs";
import * as healthcare from "./enrichers/healthcare.mjs";
import * as jobs from "./enrichers/jobs.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

export const ENRICHERS = {
  weather,
  schools,
  crime,
  costOfLiving,
  realEstate,
  transit,
  demographics,
  healthcare,
  jobs,
};

const ALL_CATEGORIES = Object.keys(ENRICHERS);

const options = parseArgs();
const APPLY = options.apply === "true" || options.apply === true;
const sinceCutoff = options.since ? new Date(options.since).getTime() : null;
const onlyFilter = parseList(options.only);
const categoryFilter = parseList(options.category);
const limit = options.limit ? Number(options.limit) : null;
const reportPath = options.out
  ? path.resolve(process.cwd(), options.out)
  : path.resolve(REPO_ROOT, "docs/progress/summary-enrichment-latest.json");

const cacheDir = path.resolve(REPO_ROOT, "scripts/data/.cache");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (set in .env.local for local runs)."
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

function selectedCategories() {
  if (!categoryFilter) return ALL_CATEGORIES;
  const unknown = [...categoryFilter].filter((cat) => !ALL_CATEGORIES.includes(cat));
  if (unknown.length) {
    throw new Error(`Unknown --category values: ${unknown.join(", ")}`);
  }
  return ALL_CATEGORIES.filter((cat) => categoryFilter.has(cat));
}

async function loadStations(supabase) {
  const stations = [];
  let offset = 0;
  const pageSize = 1000;
  for (;;) {
    const { data, error } = await supabase
      .from("stations")
      .select(
        "id, legacy_id, name, city, state, zip_code, precise_lat, precise_lng, lat, lng, county_name, county_fips, place_name, place_fips, cbsa_code, cbsa_title"
      )
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error(`stations select: ${error.message}`);
    if (!data?.length) break;
    stations.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return stations;
}

function toEnricherStation(row) {
  return {
    id: row.id,
    legacyId: row.legacy_id,
    name: row.name,
    city: row.city,
    state: row.state,
    zip: row.zip_code,
    preciseLat: row.precise_lat ?? row.lat ?? null,
    preciseLng: row.precise_lng ?? row.lng ?? null,
    countyFips: row.county_fips ?? null,
    countyName: row.county_name ?? null,
    placeFips: row.place_fips ?? null,
    placeName: row.place_name ?? null,
    cbsaCode: row.cbsa_code ?? null,
    cbsaTitle: row.cbsa_title ?? null,
  };
}

function summaryRow(station, category, result) {
  return {
    station_id: station.id,
    category,
    area_scope: result.areaScope,
    area_value: result.areaValue,
    area_key: result.areaKey,
    radius_miles: result.radiusMiles ?? null,
    summary_data: result.summaryData,
    data_source: result.dataSource,
    source_url: result.sourceUrl ?? null,
    fetched_at: new Date().toISOString(),
  };
}

async function upsertChunk(supabase, rows) {
  for (let index = 0; index < rows.length; index += 200) {
    const segment = rows.slice(index, index + 200);
    const { error } = await supabase
      .from("station_category_summaries")
      .upsert(segment, { onConflict: "station_id,category" });
    if (error) {
      throw new Error(`station_category_summaries upsert: ${error.message}`);
    }
  }
}

async function run() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const categories = selectedCategories();
  const allRows = await loadStations(supabase);
  const eligible = allRows
    .filter((row) => row.precise_lat !== null && row.precise_lng !== null)
    .filter((row) => !onlyFilter || onlyFilter.has(row.legacy_id));
  const stationsRows = limit ? eligible.slice(0, limit) : eligible;

  console.log(
    `Enrichment plan: ${stationsRows.length} stations × ${categories.length} categories = ${stationsRows.length * categories.length} cells.`
  );
  if (sinceCutoff) console.log(`  --since cutoff: ${new Date(sinceCutoff).toISOString()}`);
  if (!APPLY) console.log("  [dry-run] pass --apply to write to Supabase.\n");

  const politeFetch = createPoliteFetch({
    cacheDir,
    log: (info) => {
      if (info.error) console.warn(`polite-fetch retry: ${info.url} → ${info.error}`);
    },
  });

  const ctx = { politeFetch, log: (...args) => console.log(...args) };

  const byCategory = Object.fromEntries(
    categories.map((cat) => [cat, { attempted: 0, succeeded: 0, nullResults: 0, errors: 0 }])
  );
  const errors = [];
  const upsertRows = [];

  for (const category of categories) {
    const enricher = ENRICHERS[category];
    if (!enricher?.fetchForStation) {
      throw new Error(`enricher ${category} missing fetchForStation export`);
    }

    for (const row of stationsRows) {
      const station = toEnricherStation(row);
      byCategory[category].attempted += 1;

      try {
        const result = await enricher.fetchForStation(station, ctx);
        if (!result) {
          byCategory[category].nullResults += 1;
          continue;
        }
        byCategory[category].succeeded += 1;
        upsertRows.push(summaryRow(station, category, result));
      } catch (error) {
        byCategory[category].errors += 1;
        errors.push({
          stationId: station.legacyId,
          category,
          stage: "fetch",
          error: String(error?.message ?? error),
        });
      }
    }

    const stat = byCategory[category];
    stat.coverage = stat.attempted ? stat.succeeded / stat.attempted : 0;
    console.log(
      `  ${category}: ${stat.succeeded}/${stat.attempted} succeeded (coverage ${(stat.coverage * 100).toFixed(1)}%, ${stat.errors} errors)`
    );
  }

  if (APPLY && upsertRows.length) {
    console.log(`\nUpserting ${upsertRows.length} rows to station_category_summaries...`);
    await upsertChunk(supabase, upsertRows);
    console.log("Upsert complete.");
  }

  const report = {
    generatedAt: new Date().toISOString(),
    applied: APPLY,
    stations: stationsRows.length,
    categories,
    byCategory,
    errors,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${path.relative(process.cwd(), reportPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
