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
    const politeFetch = vi.fn().mockResolvedValue(
      beaRows([
        { GeoFips: "38060", GeoName: "Phoenix-Mesa-Chandler, AZ", Code: "RPPALL", TimePeriod: "2022", DataValue: "103.9" },
        { GeoFips: "38060", Code: "RPPGOOD", TimePeriod: "2022", DataValue: "100.2" },
        { GeoFips: "38060", Code: "RPPRENT", TimePeriod: "2022", DataValue: "108.1" },
        { GeoFips: "38060", Code: "RPPSER", TimePeriod: "2022", DataValue: "102.4" },
      ])
    );

    const result = await fetchForStation(PHOENIX_METRO, { politeFetch });

    expect(politeFetch).toHaveBeenCalledTimes(1);
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
    const politeFetch = vi.fn().mockResolvedValue(
      beaRows([
        { GeoFips: "04", GeoName: "Arizona", Code: "RPPALL", TimePeriod: "2022", DataValue: "97.2" },
        { GeoFips: "04", Code: "RPPRENT", TimePeriod: "2022", DataValue: "95.8" },
      ])
    );

    const result = await fetchForStation(NON_METRO, { politeFetch });
    expect(politeFetch.mock.calls[0][0]).toContain("TableName=SARPP");
    expect(politeFetch.mock.calls[0][0]).toContain("GeoFips=04");
    expect(result?.areaScope).toBe("custom");
    expect(result?.areaKey).toBe("04");
    expect(result?.summaryData.overallIndexUs100).toBe(97.2);
    expect(result?.dataSource).toContain("state");
  });

  it("falls back to the prior year when the most recent has no data", async () => {
    process.env.BEA_API_KEY = "test-key";
    const politeFetch = vi
      .fn()
      .mockResolvedValueOnce(beaRows([]))
      .mockResolvedValueOnce(
        beaRows([
          { GeoFips: "38060", Code: "RPPALL", TimePeriod: "2021", DataValue: "102.1" },
          { GeoFips: "38060", Code: "RPPRENT", TimePeriod: "2021", DataValue: "104.5" },
        ])
      );

    const result = await fetchForStation(PHOENIX_METRO, { politeFetch });
    expect(politeFetch).toHaveBeenCalledTimes(2);
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
    expect(buildSummary(beaRows([]))).toBeNull();
    expect(
      buildSummary(beaRows([{ Code: "UNKNOWN", DataValue: "100" }]))
    ).toBeNull();
  });
});
