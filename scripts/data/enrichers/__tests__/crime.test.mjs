import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSummary, fetchForStation } from "../crime.mjs";

let originalKey;

beforeEach(() => {
  originalKey = process.env.DATA_GOV_API_KEY;
});

afterEach(() => {
  if (originalKey === undefined) delete process.env.DATA_GOV_API_KEY;
  else process.env.DATA_GOV_API_KEY = originalKey;
});

const ATLANTA = {
  legacyId: "cbp-atlanta-ga-30344",
  state: "GA",
};

function fbiResponse(rows) {
  return { results: rows };
}

const PRIMARY_YEAR = new Date().getUTCFullYear() - 1;
const FALLBACK_YEAR = new Date().getUTCFullYear() - 2;

describe("crime enricher", () => {
  it("computes per-100k rates from state + national totals", async () => {
    process.env.DATA_GOV_API_KEY = "test-key";
    const politeFetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/state/GA")) {
        return Promise.resolve(
          fbiResponse([
            {
              year: PRIMARY_YEAR,
              state_abbr: "GA",
              population: 10_000_000,
              violent_crime: 30000,
              property_crime: 200000,
            },
          ])
        );
      }
      return Promise.resolve(
        fbiResponse([
          {
            year: PRIMARY_YEAR,
            population: 332_000_000,
            violent_crime: 1_200_000,
            property_crime: 6_500_000,
          },
        ])
      );
    });

    const result = await fetchForStation(ATLANTA, { politeFetch });

    expect(result?.summaryData).toMatchObject({
      violentPer100k: 300,
      propertyPer100k: 2000,
      usViolentPer100k: 361.4,
      usPropertyPer100k: 1957.8,
      asOfYear: PRIMARY_YEAR,
    });
    // 300 / 361.4 ≈ 0.83 ; 2000 / 1957.8 ≈ 1.02 ; avg ≈ 0.925 → score ~54.
    expect(result?.summaryData.safetyIndex0to100).toBeGreaterThan(50);
    expect(result?.summaryData.safetyIndex0to100).toBeLessThan(60);
    expect(result?.areaKey).toBe("GA");
    expect(result?.sourceUrl).not.toContain("api_key=");
  });

  it("falls back to the prior year when the most recent has no data", async () => {
    process.env.DATA_GOV_API_KEY = "test-key";
    let call = 0;
    const politeFetch = vi.fn().mockImplementation(() => {
      call += 1;
      if (call <= 2) return Promise.resolve(fbiResponse([]));
      const isState = call === 3;
      return Promise.resolve(
        fbiResponse([
          {
            year: FALLBACK_YEAR,
            state_abbr: "GA",
            population: isState ? 10_000_000 : 332_000_000,
            violent_crime: isState ? 30000 : 1_200_000,
            property_crime: isState ? 200000 : 6_500_000,
          },
        ])
      );
    });

    const result = await fetchForStation(ATLANTA, { politeFetch });
    expect(result?.summaryData.asOfYear).toBe(FALLBACK_YEAR);
  });

  it("returns null when state code is invalid", async () => {
    process.env.DATA_GOV_API_KEY = "test-key";
    const politeFetch = vi.fn();
    expect(
      await fetchForStation({ state: "INVALID" }, { politeFetch })
    ).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("throws when DATA_GOV_API_KEY is unset", async () => {
    delete process.env.DATA_GOV_API_KEY;
    await expect(
      fetchForStation(ATLANTA, { politeFetch: vi.fn() })
    ).rejects.toThrow(/DATA_GOV_API_KEY/);
  });

  it("returns null when state estimate is missing entirely", () => {
    expect(buildSummary(fbiResponse([]), fbiResponse([]), PRIMARY_YEAR)).toBeNull();
  });

  it("computes per-100k even when the national row is missing", () => {
    const summary = buildSummary(
      fbiResponse([{ year: PRIMARY_YEAR, population: 10_000_000, violent_crime: 30000, property_crime: 200000 }]),
      fbiResponse([]),
      PRIMARY_YEAR
    );
    expect(summary?.violentPer100k).toBe(300);
    expect(summary?.usViolentPer100k).toBeNull();
    expect(summary?.safetyIndex0to100).toBeNull(); // can't compute without national baseline
  });
});
