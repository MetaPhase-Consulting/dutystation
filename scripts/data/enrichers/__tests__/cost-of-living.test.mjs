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

const PHOENIX_METRO = {
  legacyId: "cbp-phoenix-az",
  countyFips: "04013",
  countyName: "Maricopa",
  cbsaCode: "38060",
  cbsaTitle: "Phoenix-Mesa-Chandler, AZ",
};

const NON_METRO = {
  legacyId: "cbp-douglas-az",
  countyFips: "04003",
  countyName: "Cochise",
  // No cbsaCode — Douglas, AZ is non-metro.
};

function beaRows(rows) {
  return { BEAAPI: { Results: { Data: rows } } };
}

describe("cost-of-living enricher", () => {
  it("uses BEA MARPP at MSA granularity when the station has a CBSA code", async () => {
    process.env.BEA_API_KEY = "test-key";
    // BEA MARPP only allows one LineCode per request, so the enricher
    // issues four parallel requests and the mock has to satisfy each.
    const politeFetch = vi.fn().mockImplementation((url) => {
      if (url.includes("LineCode=1")) {
        return Promise.resolve(beaRows([
          { GeoFips: "38060", GeoName: "Phoenix-Mesa-Chandler, AZ", Code: "RPPALL", TimePeriod: "2022", DataValue: "103.9" },
        ]));
      }
      if (url.includes("LineCode=2")) {
        return Promise.resolve(beaRows([
          { GeoFips: "38060", Code: "RPPGOOD", TimePeriod: "2022", DataValue: "100.2" },
        ]));
      }
      if (url.includes("LineCode=3")) {
        return Promise.resolve(beaRows([
          { GeoFips: "38060", Code: "RPPRENT", TimePeriod: "2022", DataValue: "108.1" },
        ]));
      }
      if (url.includes("LineCode=4")) {
        return Promise.resolve(beaRows([
          { GeoFips: "38060", Code: "RPPSER", TimePeriod: "2022", DataValue: "102.4" },
        ]));
      }
      throw new Error(`unexpected url: ${url}`);
    });

    const result = await fetchForStation(PHOENIX_METRO, { politeFetch });

    expect(politeFetch).toHaveBeenCalledTimes(4);
    expect(politeFetch.mock.calls[0][0]).toContain("TableName=MARPP");
    expect(politeFetch.mock.calls[0][0]).toContain("GeoFips=38060");
    expect(result?.areaScope).toBe("msa");
    expect(result?.areaKey).toBe("38060");
    expect(result?.summaryData).toMatchObject({
      overallIndexUs100: 103.9,
      housingIndex: 108.1,
      goodsIndex: 100.2,
      servicesIndex: 102.4,
      groceriesIndex: null,
      utilitiesIndex: null,
      transportIndex: null,
      areaLabel: "Phoenix-Mesa-Chandler, AZ",
    });
    expect(result?.dataSource).toContain("MSA");
    expect(result?.sourceUrl).not.toContain("UserID=");
  });

  it("falls back to BEA SARPP at state granularity for non-metro stations", async () => {
    process.env.BEA_API_KEY = "test-key";
    const politeFetch = vi.fn().mockImplementation((url) => {
      if (url.includes("LineCode=1")) {
        return Promise.resolve(beaRows([
          { GeoFips: "04", GeoName: "Arizona", Code: "RPPALL", TimePeriod: "2022", DataValue: "97.2" },
        ]));
      }
      if (url.includes("LineCode=3")) {
        return Promise.resolve(beaRows([
          { GeoFips: "04", Code: "RPPRENT", TimePeriod: "2022", DataValue: "95.8" },
        ]));
      }
      return Promise.resolve(beaRows([]));
    });

    const result = await fetchForStation(NON_METRO, { politeFetch });
    expect(politeFetch.mock.calls[0][0]).toContain("TableName=SARPP");
    expect(politeFetch.mock.calls[0][0]).toContain("GeoFips=04000");
    expect(result?.areaScope).toBe("custom");
    expect(result?.areaKey).toBe("04");
    expect(result?.summaryData.overallIndexUs100).toBe(97.2);
    expect(result?.dataSource).toContain("state");
  });

  it("falls back to the prior year when the most recent has no data", async () => {
    process.env.BEA_API_KEY = "test-key";
    let calls = 0;
    const politeFetch = vi.fn().mockImplementation((url) => {
      calls += 1;
      // First 4 calls (Year=primary): empty
      if (calls <= 4) return Promise.resolve(beaRows([]));
      // Next 4 calls (Year=fallback): partial data
      if (url.includes("LineCode=1")) {
        return Promise.resolve(beaRows([
          { GeoFips: "38060", Code: "RPPALL", TimePeriod: "2021", DataValue: "102.1" },
        ]));
      }
      if (url.includes("LineCode=3")) {
        return Promise.resolve(beaRows([
          { GeoFips: "38060", Code: "RPPRENT", TimePeriod: "2021", DataValue: "104.5" },
        ]));
      }
      return Promise.resolve(beaRows([]));
    });

    const result = await fetchForStation(PHOENIX_METRO, { politeFetch });
    expect(politeFetch).toHaveBeenCalledTimes(8);
    expect(result?.summaryData.overallIndexUs100).toBe(102.1);
  });

  it("returns null when the station has neither cbsa nor state FIPS", async () => {
    process.env.BEA_API_KEY = "test-key";
    const politeFetch = vi.fn();
    expect(
      await fetchForStation({ countyFips: null, placeFips: null, cbsaCode: null }, { politeFetch })
    ).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("throws when BEA_API_KEY is unset", async () => {
    delete process.env.BEA_API_KEY;
    await expect(fetchForStation(PHOENIX_METRO, { politeFetch: vi.fn() })).rejects.toThrow(/BEA_API_KEY/);
  });

  it("returns null when none of the rate codes have values", () => {
    expect(buildSummary(null)).toBeNull();
    expect(buildSummary({})).toBeNull();
    expect(buildSummary({ "1": null, "2": null, "3": null, "4": null })).toBeNull();
  });

  it("buildSummary maps LineCodes to canonical fields", () => {
    expect(buildSummary({ "1": 103.9, "2": 100.2, "3": 108.1, "4": 102.4 })).toEqual({
      overallIndexUs100: 103.9,
      housingIndex: 108.1,
      goodsIndex: 100.2,
      servicesIndex: 102.4,
      groceriesIndex: null,
      utilitiesIndex: null,
      transportIndex: null,
    });
  });
});
