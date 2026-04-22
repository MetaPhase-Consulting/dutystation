#!/usr/bin/env node
// Generate a static sitemap.xml covering every duty-station detail route
// plus the small set of top-level pages. Runs as a prebuild step so the
// output lands in public/ before Vite copies it into dist/.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DUTY_STATIONS_FILE = path.join(REPO_ROOT, "src", "data", "dutyStations.ts");
const OUTPUT_FILE = path.join(REPO_ROOT, "public", "sitemap.xml");
const SITE_ORIGIN = "https://dutystation.us";

function extractStationIds(source) {
  // Very lightweight parse: the file exports an array of objects that each
  // have `id: "some-id"`. Regex the ids without importing TS at runtime.
  const ids = [];
  const idPattern = /\bid:\s*["']([a-z0-9-]+)["']/gi;
  let match;
  while ((match = idPattern.exec(source)) !== null) {
    ids.push(match[1]);
  }
  return Array.from(new Set(ids));
}

function urlEntry(loc, { changefreq = "monthly", priority = 0.5 } = {}) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function main() {
  const source = fs.readFileSync(DUTY_STATIONS_FILE, "utf8");
  const stationIds = extractStationIds(source);
  if (stationIds.length === 0) {
    console.warn("[sitemap] no station ids extracted — is dutyStations.ts shape changed?");
  }

  const topLevel = [
    { path: "/", priority: 1.0, changefreq: "weekly" },
    { path: "/directory", priority: 0.9, changefreq: "weekly" },
    { path: "/compare", priority: 0.7, changefreq: "monthly" },
    { path: "/data-sources", priority: 0.5, changefreq: "monthly" },
    { path: "/disclaimer", priority: 0.3, changefreq: "yearly" },
    { path: "/privacy", priority: 0.3, changefreq: "yearly" },
    { path: "/accessibility", priority: 0.3, changefreq: "yearly" },
  ];

  const urls = [
    ...topLevel.map(({ path: p, priority, changefreq }) =>
      urlEntry(`${SITE_ORIGIN}${p}`, { priority, changefreq })
    ),
    ...stationIds.map((id) =>
      urlEntry(`${SITE_ORIGIN}/station/${id}`, { changefreq: "monthly", priority: 0.6 })
    ),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join("\n") +
    `\n</urlset>\n`;

  fs.writeFileSync(OUTPUT_FILE, xml);
  console.log(
    `[sitemap] wrote ${OUTPUT_FILE} with ${topLevel.length + stationIds.length} URLs (${stationIds.length} stations)`
  );
}

main();
