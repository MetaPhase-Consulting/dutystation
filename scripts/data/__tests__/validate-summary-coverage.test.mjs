// Validates the coverage gate by running the script as a subprocess with a
// fixture report. Exit code is the gate; we assert it directly.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const SCRIPT = path.resolve(import.meta.dirname, "../validate-summary-coverage.mjs");

let tmpDir;
let reportPath;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "validate-summary-coverage-"));
  reportPath = path.join(tmpDir, "report.json");
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function writeReport(byCategory) {
  fs.writeFileSync(
    reportPath,
    JSON.stringify({
      generatedAt: "2026-04-28T00:00:00Z",
      stations: 100,
      byCategory,
    })
  );
}

function runValidator(args = []) {
  try {
    const output = execFileSync(
      "node",
      [SCRIPT, "--report", reportPath, ...args],
      { encoding: "utf8" }
    );
    return { code: 0, output };
  } catch (error) {
    return { code: error.status ?? 1, output: error.stdout ?? "", stderr: error.stderr ?? "" };
  }
}

describe("validate-summary-coverage", () => {
  it("passes when every category meets the threshold", () => {
    writeReport({
      weather: { attempted: 100, succeeded: 95 },
      crime: { attempted: 100, succeeded: 80 },
    });
    const result = runValidator(["--minCoverage", "0.8"]);
    expect(result.code).toBe(0);
    expect(JSON.parse(result.output).pass).toBe(true);
  });

  it("fails when any category is below the threshold", () => {
    writeReport({
      weather: { attempted: 100, succeeded: 95 },
      crime: { attempted: 100, succeeded: 50 },
    });
    const result = runValidator(["--minCoverage", "0.8"]);
    expect(result.code).toBe(1);
    const summary = JSON.parse(result.output);
    expect(summary.pass).toBe(false);
    const crime = summary.breakdown.find((entry) => entry.category === "crime");
    expect(crime.pass).toBe(false);
  });

  it("treats zero attempted as zero coverage (fails)", () => {
    writeReport({ weather: { attempted: 0, succeeded: 0 } });
    const result = runValidator(["--minCoverage", "0.5"]);
    expect(result.code).toBe(1);
    const summary = JSON.parse(result.output);
    expect(summary.breakdown[0].coverage).toBe(0);
  });

  it("respects an explicitly raised threshold", () => {
    writeReport({ weather: { attempted: 100, succeeded: 89 } });
    expect(runValidator(["--minCoverage", "0.8"]).code).toBe(0);
    expect(runValidator(["--minCoverage", "0.9"]).code).toBe(1);
  });
});
