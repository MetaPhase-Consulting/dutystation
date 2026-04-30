import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSummary, fetchForStation } from "../jobs.mjs";

let originalKey;

beforeEach(() => {
  originalKey = process.env.BLS_API_KEY;
});

afterEach(() => {
  if (originalKey === undefined) delete process.env.BLS_API_KEY;
  else process.env.BLS_API_KEY = originalKey;
});

const FULTON = {
  legacyId: "cbp-atlanta-ga-30344",
  countyFips: "13121",
  countyName: "Fulton",
};

function blsResponse(seriesIdToValue) {
  return {
    status: "REQUEST_SUCCEEDED",
    Results: {
      series: Object.entries(seriesIdToValue).map(([id, data]) => ({
        seriesID: id,
        data,
      })),
    },
  };
}

describe("jobs enricher", () => {
  it("returns unemploymentRate + laborForce from BLS LAUS", async () => {
    process.env.BLS_API_KEY = "test-key";
    const politeFetch = vi.fn().mockResolvedValue(
      blsResponse({
        LAUCN131210000000003: [
          { year: "2024", period: "M03", periodName: "March", value: "3.6" },
        ],
        LAUCN131210000000006: [
          { year: "2024", period: "M03", periodName: "March", value: "612345" },
        ],
      })
    );

    const result = await fetchForStation(FULTON, { politeFetch });

    expect(politeFetch).toHaveBeenCalledTimes(1);
    expect(politeFetch.mock.calls[0][0]).toContain("api.bls.gov");
    const opts = politeFetch.mock.calls[0][1];
    expect(opts.method).toBe("POST");
    const body = JSON.parse(opts.body);
    expect(body.seriesid).toEqual([
      "LAUCN131210000000003",
      "LAUCN131210000000006",
    ]);

    expect(result?.summaryData).toEqual({
      unemploymentRate: 3.6,
      laborForce: 612345,
      topIndustries: null,
      medianWageAll: null,
    });
    expect(result?.areaScope).toBe("county");
    expect(result?.areaKey).toBe("13121");
  });

  it("returns null when countyFips is missing or malformed", async () => {
    process.env.BLS_API_KEY = "test-key";
    const politeFetch = vi.fn();
    expect(await fetchForStation({ countyFips: null }, { politeFetch })).toBeNull();
    expect(await fetchForStation({ countyFips: "12" }, { politeFetch })).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("throws when BLS_API_KEY is unset", async () => {
    delete process.env.BLS_API_KEY;
    await expect(
      fetchForStation(FULTON, { politeFetch: vi.fn() })
    ).rejects.toThrow(/BLS_API_KEY/);
  });

  it("returns null when both series have no data", () => {
    expect(
      buildSummary(
        [
          { seriesID: "LAUCN131210000000003", data: [] },
          { seriesID: "LAUCN131210000000006", data: [] },
        ],
        ["LAUCN131210000000003", "LAUCN131210000000006"]
      )
    ).toBeNull();
  });

  it("succeeds when only unemployment is reported", () => {
    const summary = buildSummary(
      [
        {
          seriesID: "LAUCN131210000000003",
          data: [{ year: "2024", period: "M02", periodName: "February", value: "4.1" }],
        },
        { seriesID: "LAUCN131210000000006", data: [] },
      ],
      ["LAUCN131210000000003", "LAUCN131210000000006"]
    );
    expect(summary?.unemploymentRate).toBe(4.1);
    expect(summary?.laborForce).toBeNull();
  });
});
