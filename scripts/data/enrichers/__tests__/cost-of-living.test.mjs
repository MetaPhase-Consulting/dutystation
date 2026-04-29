import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSummary, fetchForStation } from "../cost-of-living.mjs";

let originalKey;

beforeEach(() => {
  originalKey = process.env.BEA_API_KEY;
});

afterEach(() => {
  if (originalKey === undefined) delete process.env.BEA_API_KEY;
  else process.env.BEA_API_KEY = originalKey;
});

const ATLANTA = {
  legacyId: "cbp-atlanta-ga-30344",
  countyFips: "13121",
  countyName: "Fulton",
};

function beaRows(rows) {
  return { BEAAPI: { Results: { Data: rows } } };
}

describe("cost-of-living enricher", () => {
  it("derives overall and housing indexes from BEA SARPP rows", async () => {
    process.env.BEA_API_KEY = "test-key";
    const politeFetch = vi.fn().mockResolvedValue(
      beaRows([
        { GeoFips: "13", GeoName: "Georgia", Code: "RPPALL", TimePeriod: "2022", DataValue: "96.6" },
        { GeoFips: "13", GeoName: "Georgia", Code: "RPPGOOD", TimePeriod: "2022", DataValue: "98.5" },
        { GeoFips: "13", GeoName: "Georgia", Code: "RPPRENT", TimePeriod: "2022", DataValue: "94.2" },
        { GeoFips: "13", GeoName: "Georgia", Code: "RPPSER", TimePeriod: "2022", DataValue: "97.0" },
      ])
    );

    const result = await fetchForStation(ATLANTA, { politeFetch });

    expect(politeFetch).toHaveBeenCalledTimes(1);
    expect(politeFetch.mock.calls[0][0]).toContain("GeoFips=13");
    expect(result?.summaryData).toEqual({
      overallIndexUs100: 96.6,
      housingIndex: 94.2,
      groceriesIndex: null,
      utilitiesIndex: null,
      transportIndex: null,
      asOf: expect.stringMatching(/^\d{4}$/),
    });
    expect(result?.areaScope).toBe("custom");
    expect(result?.areaKey).toBe("13");
    expect(result?.sourceUrl).not.toContain("UserID=");
  });

  it("falls back to the prior year when the most recent has no data", async () => {
    process.env.BEA_API_KEY = "test-key";
    const politeFetch = vi
      .fn()
      .mockResolvedValueOnce(beaRows([]))
      .mockResolvedValueOnce(
        beaRows([
          { GeoFips: "13", Code: "RPPALL", TimePeriod: "2021", DataValue: "95.8" },
          { GeoFips: "13", Code: "RPPRENT", TimePeriod: "2021", DataValue: "92.0" },
        ])
      );

    const result = await fetchForStation(ATLANTA, { politeFetch });
    expect(politeFetch).toHaveBeenCalledTimes(2);
    expect(result?.summaryData.overallIndexUs100).toBe(95.8);
  });

  it("returns null when the station has no FIPS info", async () => {
    process.env.BEA_API_KEY = "test-key";
    const politeFetch = vi.fn();
    expect(
      await fetchForStation({ countyFips: null, placeFips: null }, { politeFetch })
    ).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("throws when BEA_API_KEY is unset", async () => {
    delete process.env.BEA_API_KEY;
    await expect(fetchForStation(ATLANTA, { politeFetch: vi.fn() })).rejects.toThrow(/BEA_API_KEY/);
  });

  it("returns null when neither overall nor housing values are present", () => {
    expect(buildSummary(beaRows([]))).toBeNull();
    expect(
      buildSummary(beaRows([{ Code: "RPPGOOD", DataValue: "98.5" }]))
    ).toBeNull();
  });
});
