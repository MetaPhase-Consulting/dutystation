import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { _resetHospitalCache, fetchForStation, parseHifld } from "../healthcare.mjs";

beforeEach(() => {
  _resetHospitalCache();
});

afterEach(() => {
  _resetHospitalCache();
});

const ATLANTA_STATION = {
  legacyId: "cbp-atlanta-ga-30344",
  preciseLat: 33.6529,
  preciseLng: -84.4279,
};

function hifldResponse(hospitals) {
  return {
    features: hospitals.map((h) => ({ attributes: h })),
  };
}

describe("healthcare enricher", () => {
  it("counts hospitals within 25mi and identifies the nearest", async () => {
    const politeFetch = vi.fn().mockResolvedValue(
      hifldResponse([
        { ID: "H1", NAME: "Grady Memorial", LATITUDE: 33.7491, LONGITUDE: -84.3877, STATE: "GA", TYPE: "GENERAL ACUTE CARE" },
        { ID: "H2", NAME: "Emory University Hospital", LATITUDE: 33.7912, LONGITUDE: -84.3232, STATE: "GA", TYPE: "GENERAL ACUTE CARE" },
        { ID: "H3", NAME: "Distant Hospital", LATITUDE: 40.7128, LONGITUDE: -74.0060, STATE: "NY", TYPE: "GENERAL ACUTE CARE" },
      ])
    );

    const result = await fetchForStation(ATLANTA_STATION, { politeFetch });

    expect(result?.summaryData.hospitalsWithin25mi).toBe(2);
    expect(result?.summaryData.nearestHospitalName).toBe("Grady Memorial");
    expect(result?.summaryData.nearestHospitalMi).toBeGreaterThan(5);
    expect(result?.summaryData.nearestHospitalMi).toBeLessThan(20);
    expect(result?.summaryData.nearestVaMi).toBeNull();
    expect(result?.areaScope).toBe("radius");
    expect(result?.radiusMiles).toBe(25);
  });

  it("loads the hospital dataset only once across many stations", async () => {
    const politeFetch = vi.fn().mockResolvedValue(
      hifldResponse([
        { ID: "H1", NAME: "Hosp", LATITUDE: 33.7, LONGITUDE: -84.4, STATE: "GA", TYPE: "GENERAL ACUTE CARE" },
      ])
    );

    await fetchForStation(ATLANTA_STATION, { politeFetch });
    await fetchForStation(ATLANTA_STATION, { politeFetch });
    await fetchForStation(ATLANTA_STATION, { politeFetch });

    expect(politeFetch).toHaveBeenCalledTimes(1);
  });

  it("returns null when station has no precise coordinates", async () => {
    const politeFetch = vi.fn();
    expect(
      await fetchForStation({ preciseLat: null, preciseLng: null }, { politeFetch })
    ).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("returns null when the dataset has no usable hospitals", async () => {
    const politeFetch = vi.fn().mockResolvedValue({ features: [] });
    expect(await fetchForStation(ATLANTA_STATION, { politeFetch })).toBeNull();
  });

  it("strips null-island sentinel rows", () => {
    const hospitals = parseHifld(
      hifldResponse([
        { ID: "good", NAME: "OK", LATITUDE: 33.7, LONGITUDE: -84.4 },
        { ID: "null", NAME: "Bad", LATITUDE: 0, LONGITUDE: 0 },
        { ID: "nan", NAME: "Bad2", LATITUDE: "abc", LONGITUDE: "def" },
      ])
    );
    expect(hospitals).toHaveLength(1);
    expect(hospitals[0].id).toBe("good");
  });
});
