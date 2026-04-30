#!/usr/bin/env node
// Coverage gate for the summary enrichment report.
//
// Reads docs/progress/summary-enrichment-latest.json and exits 1 if any
// category falls below --minCoverage (default 0.80). Mirrors
// validate-link-audit.mjs so CI can wire it into the same pattern.
//
// Usage:
//   node scripts/data/validate-summary-coverage.mjs
//   node scripts/data/validate-summary-coverage.mjs --report PATH
//   node scripts/data/validate-summary-coverage.mjs --minCoverage 0.85

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./parse-duty-stations.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const options = parseArgs();
const reportPath = options.report
  ? path.resolve(process.cwd(), options.report)
  : path.resolve(REPO_ROOT, "docs/progress/summary-enrichment-latest.json");
const minCoverage = options.minCoverage ? Number(options.minCoverage) : 0.8;

if (!Number.isFinite(minCoverage) || minCoverage < 0 || minCoverage > 1) {
  throw new Error(`--minCoverage must be between 0 and 1 (got ${options.minCoverage}).`);
}

if (!fs.existsSync(reportPath)) {
  throw new Error(`Report not found at ${reportPath}. Run data:enrich:summaries first.`);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const breakdown = [];
let failed = false;

for (const [category, stat] of Object.entries(report.byCategory ?? {})) {
  const attempted = Number(stat?.attempted ?? 0);
  const succeeded = Number(stat?.succeeded ?? 0);
  const coverage = attempted ? succeeded / attempted : 0;
  const pass = coverage >= minCoverage;
  if (!pass) failed = true;
  breakdown.push({
    category,
    attempted,
    succeeded,
    coverage: Number(coverage.toFixed(4)),
    pass,
  });
}

const summary = {
  reportPath: path.relative(process.cwd(), reportPath),
  minCoverage,
  generatedAt: report.generatedAt ?? null,
  stations: report.stations ?? null,
  breakdown,
  pass: !failed,
};

console.log(JSON.stringify(summary, null, 2));

if (failed) {
  console.error(
    `\nSummary coverage gate failed: at least one category below ${(minCoverage * 100).toFixed(0)}%.`
  );
  process.exit(1);
}
