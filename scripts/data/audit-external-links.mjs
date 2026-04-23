import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { parseLegacyDutyStations, parseArgs } from "./parse-duty-stations.mjs";

// category prefix used for URLs pulled from station_category_summaries.source_url.
// Keeps the audit report + validator gate one-track while staying distinguishable
// from station_links.category (which has a CHECK constraint that would reject
// these values anyway, so the sync step filters them out).
const SUMMARY_CATEGORY_PREFIX = "summary:";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = parseArgs();
const concurrency = Number(options.concurrency ?? 12);
const timeoutMs = Number(options.timeoutMs ?? 12000);
const shouldSync = options.sync === "true" || options.sync === true;
const outputPath = options.out
  ? path.resolve(process.cwd(), options.out)
  : path.resolve(__dirname, "../../docs/progress/link-audit-latest.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const supabase = hasSupabaseEnv
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  : null;

function classifyStatus(statusCode) {
  if (!statusCode) {
    return null;
  }

  if (statusCode >= 200 && statusCode < 400) {
    return true;
  }

  if ([403, 405, 429].includes(statusCode)) {
    return null;
  }

  return false;
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const request = async (method) =>
    fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "dutystation-link-audit/1.0",
      },
    });

  const startedAt = Date.now();

  try {
    let response;
    try {
      response = await request("HEAD");
    } catch {
      response = await request("GET");
    }

    clearTimeout(timeoutId);

    return {
      url,
      statusCode: response.status,
      resolvedUrl: response.url,
      isValid: classifyStatus(response.status),
      responseTimeMs: Date.now() - startedAt,
      errorMessage: null,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    return {
      url,
      statusCode: null,
      resolvedUrl: null,
      isValid: null,
      responseTimeMs: Date.now() - startedAt,
      errorMessage: String(error?.message ?? error),
    };
  }
}

function loadAlphaSummarySourceEntries(stations) {
  // Walk the bundled alpha seed (source of truth when Supabase is unavailable)
  // and surface every non-empty source_url so it participates in the audit.
  try {
    const seedPath = path.resolve(__dirname, "../../supabase/seed/summary-alpha.json");
    if (!fs.existsSync(seedPath)) {
      return [];
    }
    const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
    const stationById = new Map(stations.map((station) => [station.id, station]));
    const entries = [];
    for (const entry of seed.stations ?? []) {
      const station = stationById.get(entry.stationId);
      for (const [category, summary] of Object.entries(entry.summaries ?? {})) {
        const url = summary?.sourceUrl;
        if (!url) continue;
        entries.push({
          stationId: entry.stationId,
          stationName: station?.name ?? entry.stationId,
          city: station?.city ?? "",
          state: station?.state ?? "",
          category: `${SUMMARY_CATEGORY_PREFIX}${category}`,
          url,
          stationDbId: null,
          source: "summary",
        });
      }
    }
    return entries;
  } catch (error) {
    console.warn(`Could not load alpha summary sources: ${error.message}`);
    return [];
  }
}

async function loadEntries() {
  if (!supabase) {
    const stations = parseLegacyDutyStations();
    const linkEntries = stations.flatMap((station) =>
      Object.entries(station.links).map(([category, url]) => ({
        stationId: station.id,
        stationName: station.name,
        city: station.city,
        state: station.state,
        category,
        url,
        stationDbId: null,
        source: "station_link",
      }))
    );
    const summaryEntries = loadAlphaSummarySourceEntries(stations);
    return [...linkEntries, ...summaryEntries];
  }

  const fetchAll = async (table, selectColumns) => {
    const pageSize = 1000;
    let from = 0;
    let done = false;
    const allRows = [];

    while (!done) {
      const to = from + pageSize - 1;
      const { data, error } = await supabase.from(table).select(selectColumns).range(from, to);
      if (error) {
        throw error;
      }
      const rows = data ?? [];
      allRows.push(...rows);
      if (rows.length < pageSize) {
        done = true;
      }
      from += pageSize;
    }

    return allRows;
  };

  let stations;
  let links;
  let summaries;

  try {
    [stations, links, summaries] = await Promise.all([
      fetchAll("stations", "id,legacy_id,name,city,state"),
      fetchAll("station_links", "station_id,category,url"),
      fetchAll("station_category_summaries", "station_id,category,source_url"),
    ]);
  } catch (error) {
    throw new Error(`Failed to load station links from Supabase: ${error?.message ?? error}`);
  }

  if (!stations || !links) {
    throw new Error("Failed to load station links from Supabase: missing rows");
  }

  const stationMap = new Map(stations.map((station) => [station.id, station]));

  const linkEntries = links.map((link) => {
    const station = stationMap.get(link.station_id);
    return {
      stationId: station?.legacy_id ?? "unknown",
      stationName: station?.name ?? "Unknown Station",
      city: station?.city ?? "",
      state: station?.state ?? "",
      category: link.category,
      url: link.url,
      stationDbId: link.station_id,
      source: "station_link",
    };
  });

  // Summary source_urls live on a separate table but the same audit gate
  // protects them — they're user-facing outbound links on the dashboard.
  const summaryEntries = (summaries ?? [])
    .filter((row) => Boolean(row?.source_url))
    .map((row) => {
      const station = stationMap.get(row.station_id);
      return {
        stationId: station?.legacy_id ?? "unknown",
        stationName: station?.name ?? "Unknown Station",
        city: station?.city ?? "",
        state: station?.state ?? "",
        category: `${SUMMARY_CATEGORY_PREFIX}${row.category}`,
        url: row.source_url,
        stationDbId: null,
        source: "summary",
      };
    });

  return [...linkEntries, ...summaryEntries];
}

function chunkArray(values, chunkSize) {
  const chunks = [];
  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize));
  }
  return chunks;
}

async function run() {
  const entries = await loadEntries();
  const uniqueUrls = [...new Set(entries.map((entry) => entry.url).filter(Boolean))];
  const urlLookup = new Map();

  let cursor = 0;

  async function worker() {
    while (cursor < uniqueUrls.length) {
      const current = uniqueUrls[cursor];
      cursor += 1;
      const result = await checkUrl(current);
      urlLookup.set(current, result);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const checkedAt = new Date().toISOString();
  const records = entries.map((entry) => {
    const result = urlLookup.get(entry.url);

    return {
      ...entry,
      checkedAt,
      statusCode: result?.statusCode ?? null,
      resolvedUrl: result?.resolvedUrl ?? null,
      isValid: result?.isValid ?? null,
      responseTimeMs: result?.responseTimeMs ?? null,
      errorMessage: result?.errorMessage ?? null,
    };
  });

  const totals = {
    checkedLinks: records.length,
    uniqueUrls: uniqueUrls.length,
    valid: records.filter((record) => record.isValid === true).length,
    invalid: records.filter((record) => record.isValid === false).length,
    unknown: records.filter((record) => record.isValid === null).length,
  };

  const failures = records.filter((record) => record.isValid === false || record.errorMessage);

  const report = {
    generatedAt: checkedAt,
    totals,
    failures,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  if (shouldSync && supabase) {
    const auditRows = records
      .filter((record) => record.stationDbId)
      .map((record) => ({
        station_id: record.stationDbId,
        category: record.category,
        url: record.url,
        status_code: record.statusCode,
        is_valid: record.isValid,
        response_time_ms: record.responseTimeMs,
        resolved_url: record.resolvedUrl,
        checked_at: record.checkedAt,
        error_message: record.errorMessage,
        source: "script",
      }));

    for (const chunk of chunkArray(auditRows, 200)) {
      const { error } = await supabase.from("link_audit_results").insert(chunk);
      if (error) {
        throw new Error(`Failed to insert link_audit_results: ${error.message}`);
      }
    }

    // station_links has a CHECK constraint on category that only allows the
    // station-link set — summary:* entries never belong here.
    const stationLinkRows = records
      .filter((record) => record.stationDbId && record.source === "station_link")
      .map((record) => ({
        station_id: record.stationDbId,
        category: record.category,
        url: record.url,
        is_valid: record.isValid,
        http_status: record.statusCode,
        resolved_url: record.resolvedUrl,
        last_checked_at: record.checkedAt,
      }));

    for (const chunk of chunkArray(stationLinkRows, 200)) {
      const { error } = await supabase.from("station_links").upsert(chunk, {
        onConflict: "station_id,category",
      });

      if (error) {
        throw new Error(`Failed to upsert station_links: ${error.message}`);
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        outputPath,
        totals,
        syncedToSupabase: shouldSync && Boolean(supabase),
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
