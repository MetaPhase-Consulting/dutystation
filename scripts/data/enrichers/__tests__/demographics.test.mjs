import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSummary, fetchForStation } from "../demographics.mjs";

let originalKey;

beforeEach(() => {
  originalKey = process.env.CENSUS_API_KEY;
});

afterEach(() => {
  if (originalKey === undefined) delete process.env.CENSUS_API_KEY;
  else process.env.CENSUS_API_KEY = originalKey;
});

const ATLANTA = {
  legacyId: "cbp-atlanta-ga-30344",
  placeFips: "1304000",
  placeName: "Atlanta",
  countyFips: "13121",
  countyName: "Fulton",
};

describe("demographics enricher", () => {
  it("queries by place when placeFips is present", async () => {
    process.env.CENSUS_API_KEY = "test-key";
    const politeFetch = vi.fn().mockResolvedValue([
      ["NAME", "B01003_001E", "B01002_001E", "B19013_001E", "B25010_001E", "B16001_001E", "B16001_002E", "state", "place"],
      ["Atlanta city, Georgia", "499171", "33.5", "77655", "2.36", "470000", "395000", "13", "04000"],
    ]);

    const result = await fetchForStation(ATLANTA, { politeFetch });

    const calledUrl = politeFetch.mock.calls[0][0];
    expect(calledUrl).toContain("for=place%3A04000");
    expect(calledUrl).toContain("in=state%3A13");

    expect(result).toMatchObject({
      areaScope: "place",
      areaKey: "1304000",
      areaValue: "Atlanta",
      summaryData: {
        population: 499171,
        medianAge: 33.5,
        medianHouseholdIncome: 77655,
        householdSize: 2.36,
        pctEnglishOnly: 84.0,
      },
      dataSource: expect.stringContaining("ACS"),
    });
    expect(result.sourceUrl).not.toContain("key=");
  });

  it("falls back to county when place is missing", async () => {
    process.env.CENSUS_API_KEY = "test-key";
    const politeFetch = vi.fn().mockResolvedValue([
      ["NAME", "B01003_001E", "B01002_001E", "B19013_001E", "B25010_001E", "B16001_001E", "B16001_002E", "state", "county"],
      ["Fulton County, Georgia", "1063937", "36.1", "78900", "2.5", "1000000", "780000", "13", "121"],
    ]);

    const station = { ...ATLANTA, placeFips: null, placeName: null };
    const result = await fetchForStation(station, { politeFetch });

    const calledUrl = politeFetch.mock.calls[0][0];
    expect(calledUrl).toContain("for=county%3A121");
    expect(result?.areaScope).toBe("county");
    expect(result?.summaryData.population).toBe(1063937);
  });

  it("returns null when neither placeFips nor countyFips is present", async () => {
    process.env.CENSUS_API_KEY = "test-key";
    const politeFetch = vi.fn();
    const result = await fetchForStation(
      { legacyId: "x", placeFips: null, countyFips: null },
      { politeFetch }
    );
    expect(result).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("throws when CENSUS_API_KEY is unset", async () => {
    delete process.env.CENSUS_API_KEY;
    await expect(
      fetchForStation(ATLANTA, { politeFetch: vi.fn() })
    ).rejects.toThrow(/CENSUS_API_KEY/);
  });
});

describe("demographics buildSummary", () => {
  it("computes pctEnglishOnly correctly", () => {
    const summary = buildSummary({
      B01003_001E: 1000,
      B01002_001E: 30,
      B19013_001E: 60000,
      B25010_001E: 2.5,
      B16001_001E: 200,
      B16001_002E: 150,
    });
    expect(summary?.pctEnglishOnly).toBe(75.0);
  });

  it("returns null when every metric is missing", () => {
    expect(
      buildSummary({
        B01003_001E: null,
        B01002_001E: null,
        B19013_001E: null,
        B25010_001E: null,
        B16001_001E: null,
        B16001_002E: null,
      })
    ).toBeNull();
  });
});
