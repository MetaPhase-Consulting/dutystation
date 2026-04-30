import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSummary, fetchForStation, pickStationCandidates } from "../weather.mjs";

let originalToken;

beforeEach(() => {
  originalToken = process.env.NOAA_CDO_TOKEN;
});

afterEach(() => {
  if (originalToken === undefined) delete process.env.NOAA_CDO_TOKEN;
  else process.env.NOAA_CDO_TOKEN = originalToken;
});

const ATLANTA_STATION = {
  legacyId: "cbp-atlanta-ga-30344",
  preciseLat: 33.6529,
  preciseLng: -84.4279,
};

function stationsResponse(rows) {
  return { results: rows };
}

function normalsRecords(values) {
  // values: { datatype: [m1, m2, ..., m12] (raw NCEI values, in tenths/hundredths) }
  const out = [];
  for (const [datatype, monthly] of Object.entries(values)) {
    monthly.forEach((value, index) => {
      out.push({
        datatype,
        value,
        date: `2010-${String(index + 1).padStart(2, "0")}-01T00:00:00`,
      });
    });
  }
  return { results: out };
}

describe("weather enricher", () => {
  it("finds the nearest normals station then aggregates monthly normals", async () => {
    process.env.NOAA_CDO_TOKEN = "test-token";
    let stationsCalled = false;
    const politeFetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/stations")) {
        stationsCalled = true;
        return Promise.resolve(
          stationsResponse([
            { id: "GHCND:USW00013874", name: "ATLANTA HARTSFIELD INTL AP, GA US", latitude: "33.6300", longitude: "-84.4400" },
            { id: "GHCND:USC00090435", name: "ATLANTA BLVD, GA US", latitude: "33.7500", longitude: "-84.4000" },
          ])
        );
      }
      return Promise.resolve(
        normalsRecords({
          "MLY-TMAX-NORMAL": [521, 565, 645, 730, 810, 880, 901, 891, 832, 727, 631, 545],
          "MLY-TMIN-NORMAL": [330, 365, 432, 510, 600, 690, 720, 712, 651, 547, 432, 358],
          "MLY-PRCP-NORMAL": [410, 425, 480, 350, 380, 420, 460, 410, 350, 320, 380, 405],
          "MLY-SNOW-NORMAL": [10, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 5],
        })
      );
    });

    const result = await fetchForStation(ATLANTA_STATION, { politeFetch });

    expect(stationsCalled).toBe(true);
    expect(result?.summaryData).toMatchObject({
      summerHighF: 90.1,
      winterLowF: 33.0,
      annualPrecipIn: expect.any(Number),
      annualSnowIn: expect.any(Number),
      climateLabel: expect.any(String),
    });
    expect(result?.summaryData.avgHighF).toBeGreaterThan(60);
    expect(result?.summaryData.avgHighF).toBeLessThan(80);
    expect(result?.areaScope).toBe("radius");
    expect(result?.areaKey).toBe("GHCND:USW00013874");

    // Confirm the Authorization header (token) is forwarded.
    const stationsCall = politeFetch.mock.calls.find(([url]) => url.includes("/stations"));
    expect(stationsCall?.[1]?.headers?.token).toBe("test-token");
  });

  it("expands the search box when the first attempt finds nothing", async () => {
    process.env.NOAA_CDO_TOKEN = "test-token";
    const politeFetch = vi
      .fn()
      .mockImplementationOnce(() => Promise.resolve(stationsResponse([])))
      .mockImplementationOnce(() =>
        Promise.resolve(
          stationsResponse([
            { id: "GHCND:US1", name: "Some Station", latitude: "33.6", longitude: "-84.5" },
          ])
        )
      )
      .mockImplementationOnce(() =>
        Promise.resolve(
          normalsRecords({
            "MLY-TMAX-NORMAL": [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
            "MLY-TMIN-NORMAL": [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300],
            "MLY-PRCP-NORMAL": [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
            "MLY-SNOW-NORMAL": [],
          })
        )
      );

    const result = await fetchForStation(ATLANTA_STATION, { politeFetch });
    expect(result?.areaKey).toBe("GHCND:US1");
    expect(politeFetch).toHaveBeenCalledTimes(3);
  });

  it("returns null when no station is within the expanded box", async () => {
    process.env.NOAA_CDO_TOKEN = "test-token";
    const politeFetch = vi
      .fn()
      .mockResolvedValue(stationsResponse([]));
    const result = await fetchForStation(ATLANTA_STATION, { politeFetch });
    expect(result).toBeNull();
  });

  it("returns null when station has no precise coordinates", async () => {
    process.env.NOAA_CDO_TOKEN = "test-token";
    const politeFetch = vi.fn();
    expect(
      await fetchForStation({ preciseLat: null, preciseLng: null }, { politeFetch })
    ).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("throws when NOAA_CDO_TOKEN is unset", async () => {
    delete process.env.NOAA_CDO_TOKEN;
    await expect(
      fetchForStation(ATLANTA_STATION, { politeFetch: vi.fn() })
    ).rejects.toThrow(/NOAA_CDO_TOKEN/);
  });
});

describe("pickStationCandidates", () => {
  it("sorts stations by distance from the target", () => {
    const ranked = pickStationCandidates(
      stationsResponse([
        { id: "far", latitude: "34.6", longitude: "-84.4" },
        { id: "near", latitude: "33.7", longitude: "-84.4" },
        { id: "mid", latitude: "33.9", longitude: "-84.4" },
      ]),
      33.65,
      -84.4
    );
    expect(ranked.map((s) => s.id)).toEqual(["near", "mid", "far"]);
  });

  it("returns empty array when input is malformed", () => {
    expect(pickStationCandidates({}, 33, -84)).toEqual([]);
    expect(pickStationCandidates(null, 33, -84)).toEqual([]);
  });
});

describe("buildSummary", () => {
  it("computes annual sums and seasonal extremes", () => {
    const summary = buildSummary(
      normalsRecords({
        "MLY-TMAX-NORMAL": [500, 500, 500, 500, 500, 500, 950, 500, 500, 500, 500, 500],
        "MLY-TMIN-NORMAL": [50, 100, 150, 200, 250, 300, 350, 350, 300, 250, 150, 100],
        "MLY-PRCP-NORMAL": [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
        "MLY-SNOW-NORMAL": [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10],
      }).results
    );
    expect(summary?.summerHighF).toBe(95.0);
    expect(summary?.winterLowF).toBe(5.0);
    expect(summary?.annualPrecipIn).toBe(24.0); // 12 * 2.0 in
    expect(summary?.annualSnowIn).toBe(3.0); // (20 + 10) / 10
  });

  it("returns null when records are empty", () => {
    expect(buildSummary([])).toBeNull();
    expect(buildSummary(null)).toBeNull();
  });
});
