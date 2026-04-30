import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSummary, fetchForStation } from "../real-estate.mjs";

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

describe("real-estate enricher", () => {
  it("returns median home price + 2br rent at place scope", async () => {
    process.env.CENSUS_API_KEY = "test-key";
    const politeFetch = vi.fn().mockResolvedValue([
      ["NAME", "B25077_001E", "B25031_004E", "B25064_001E", "state", "place"],
      ["Atlanta city, Georgia", "428000", "1820", "1650", "13", "04000"],
    ]);

    const result = await fetchForStation(ATLANTA, { politeFetch });
    expect(result?.summaryData).toEqual({
      medianHomePrice: 428000,
      medianRent2br: 1820,
      pricePerSqft: null,
      yoyChangePct: null,
      asOfMonth: "2022-12",
    });
    expect(result?.areaScope).toBe("place");
  });

  it("falls back to overall median rent when 2br is suppressed", () => {
    const summary = buildSummary({ B25077_001E: 300000, B25031_004E: null, B25064_001E: 1500 });
    expect(summary?.medianRent2br).toBe(1500);
  });

  it("returns null when both home price and rent are missing", () => {
    expect(buildSummary({ B25077_001E: null, B25031_004E: null, B25064_001E: null })).toBeNull();
  });
});
