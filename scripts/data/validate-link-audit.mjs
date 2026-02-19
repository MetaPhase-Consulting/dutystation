import fs from "fs";
import path from "path";
import { parseArgs } from "./parse-duty-stations.mjs";

const options = parseArgs();
const reportPath = path.resolve(process.cwd(), options.report ?? "docs/progress/link-audit-latest.json");
const maxUnknownRate = Number(options.maxUnknownRate ?? 0.35);

const FALLBACK_CATEGORIES = new Set([
  "movingTips",
  "weather",
  "transit",
  "schools",
  "crime",
  "costOfLiving",
  "realEstate",
]);

function isHardFailure(failure) {
  if (failure?.isValid === false) {
    return true;
  }

  const statusCode = failure?.statusCode;
  if (typeof statusCode === "number") {
    return statusCode >= 400 && ![403, 405, 429].includes(statusCode);
  }

  return false;
}

function run() {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Link audit report not found: ${reportPath}`);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const totals = report?.totals ?? {};
  const failures = Array.isArray(report?.failures) ? report.failures : [];

  const unresolvedHardFailures = failures.filter(
    (failure) => FALLBACK_CATEGORIES.has(failure?.category) && isHardFailure(failure)
  );

  const checkedLinks = Number(totals.checkedLinks ?? 0);
  const unknownLinks = Number(totals.unknown ?? 0);
  const unknownRate = checkedLinks > 0 ? unknownLinks / checkedLinks : 0;

  const summary = {
    reportPath,
    checkedLinks,
    unknownLinks,
    unknownRate,
    maxUnknownRate,
    unresolvedHardFailures: unresolvedHardFailures.length,
    unresolvedHardFailureCategories: [...new Set(unresolvedHardFailures.map((failure) => failure.category))],
  };

  if (unknownRate > maxUnknownRate) {
    console.warn(
      `Warning: unknown link rate ${(unknownRate * 100).toFixed(2)}% exceeds ${(maxUnknownRate * 100).toFixed(2)}%.`
    );
  }

  if (unresolvedHardFailures.length) {
    console.error(
      JSON.stringify(
        {
          ...summary,
          examples: unresolvedHardFailures.slice(0, 10).map((failure) => ({
            stationId: failure.stationId,
            stationName: failure.stationName,
            category: failure.category,
            url: failure.url,
            statusCode: failure.statusCode ?? null,
          })),
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify(summary, null, 2));
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
