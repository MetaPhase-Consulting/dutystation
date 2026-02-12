import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { parseArgs } from "./parse-duty-stations.mjs";

const options = parseArgs();
const shouldApply = options.apply === "true" || options.apply === true;
const outputPath = options.out
  ? path.resolve(process.cwd(), options.out)
  : path.resolve(process.cwd(), "docs/progress/link-remediation-latest.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function stableReplacement(category, station) {
  const city = station?.city ?? "";
  const state = station?.state ?? "";
  const location = `${city}, ${state}`.trim();

  switch (category) {
    case "movingTips":
      return {
        url: "https://www.usa.gov/moving",
        reason: "Moving.com and similar moving links returned hard failures.",
      };
    case "weather":
      return {
        url: "https://www.weather.gov/",
        reason: "Normalized weather links to a stable federal weather source.",
      };
    case "transit":
      return {
        url: `https://www.google.com/maps/search/public+transit+${encodeURIComponent(location)}`,
        reason: "Replaced broken transit links with location-based transit search.",
      };
    case "schools":
      return {
        url: "https://nces.ed.gov/ccd/schoolsearch/",
        reason: "Replaced broken school links with NCES public school search.",
      };
    case "crime":
      return {
        url: "https://www.city-data.com/crime/",
        reason: "Replaced broken crime links with stable public crime resource.",
      };
    case "costOfLiving":
      return {
        url: "https://www.bestplaces.net/cost_of_living/",
        reason: "Replaced broken cost-of-living links with stable provider root.",
      };
    case "realEstate":
      return {
        url: "https://www.realtor.com/",
        reason: "Replaced broken real-estate links with stable provider root.",
      };
    default:
      return null;
  }
}

function isHardFail(link) {
  if (link.is_valid === false) {
    return true;
  }

  return typeof link.http_status === "number" && link.http_status >= 400;
}

async function fetchAllStationLinks() {
  const rows = [];
  const pageSize = 1000;
  let from = 0;
  let done = false;

  while (!done) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("station_links")
      .select(
        `
        id,
        station_id,
        category,
        url,
        original_url,
        is_remediated,
        remediation_reason,
        remediated_at,
        is_valid,
        http_status,
        resolved_url,
        stations(name,city,state)
      `
      )
      .range(from, to);

    if (error) {
      throw new Error(`Failed to read station links: ${error.message}`);
    }

    const page = data ?? [];
    rows.push(...page);

    if (page.length < pageSize) {
      done = true;
    }

    from += pageSize;
  }

  return rows;
}

async function run() {
  const links = await fetchAllStationLinks();
  const now = new Date().toISOString();

  const candidates = links.filter((link) => isHardFail(link));

  const updates = [];
  for (const link of candidates) {
    const replacement = stableReplacement(link.category, link.stations);
    if (!replacement || !replacement.url || replacement.url === link.url) {
      continue;
    }

    updates.push({
      id: link.id,
      stationId: link.station_id,
      stationName: link.stations?.name ?? "Unknown Station",
      category: link.category,
      fromUrl: link.url,
      toUrl: replacement.url,
      reason: replacement.reason,
      updatePayload: {
        url: replacement.url,
        original_url: link.original_url ?? link.url,
        is_remediated: true,
        remediation_reason: replacement.reason,
        remediated_at: now,
        is_valid: null,
        http_status: null,
        resolved_url: null,
        last_checked_at: null,
      },
    });
  }

  let applied = 0;
  if (shouldApply && updates.length) {
    for (const item of updates) {
      const { error } = await supabase
        .from("station_links")
        .update(item.updatePayload)
        .eq("id", item.id);

      if (error) {
        throw new Error(`Failed to remediate link ${item.id}: ${error.message}`);
      }
      applied += 1;
    }
  }

  const report = {
    generatedAt: now,
    applied: shouldApply,
    totalLinks: links.length,
    hardFailCandidates: candidates.length,
    remediationsPlanned: updates.length,
    remediationsApplied: applied,
    updates: updates.map((item) => ({
      stationId: item.stationId,
      stationName: item.stationName,
      category: item.category,
      fromUrl: item.fromUrl,
      toUrl: item.toUrl,
      reason: item.reason,
    })),
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log(
    JSON.stringify(
      {
        outputPath,
        applied: shouldApply,
        remediationsPlanned: updates.length,
        remediationsApplied: applied,
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
