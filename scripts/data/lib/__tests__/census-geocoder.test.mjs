import { describe, expect, it, vi } from "vitest";
import { geocodeAddress } from "../census-geocoder.mjs";

function fixtureMatch() {
  return {
    result: {
      addressMatches: [
        {
          matchedAddress: "1500 CENTRE PKWY, ATLANTA, GA, 30344",
          coordinates: { x: -84.4279, y: 33.6529 },
          geographies: {
            Counties: [{ GEOID: "13121", NAME: "Fulton County" }],
            "Incorporated Places": [{ GEOID: "1304000", NAME: "Atlanta city" }],
          },
        },
      ],
    },
  };
}

describe("geocodeAddress", () => {
  it("returns lat/lng + county/place FIPS on a primary match", async () => {
    const politeFetch = vi.fn().mockResolvedValue(fixtureMatch());
    const result = await geocodeAddress({
      politeFetch,
      address: "1500 Centre Parkway, Atlanta, GA 30344",
    });

    expect(politeFetch).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      lat: 33.6529,
      lng: -84.4279,
      countyFips: "13121",
      countyName: "Fulton",
      placeFips: "1304000",
      placeName: "Atlanta",
      source: "census-geocoder:Public_AR_Current/Current_Current",
    });
  });

  it("falls back to Census2020 benchmark when primary returns no match", async () => {
    const politeFetch = vi
      .fn()
      .mockResolvedValueOnce({ result: { addressMatches: [] } })
      .mockResolvedValueOnce(fixtureMatch());

    const result = await geocodeAddress({
      politeFetch,
      address: "1500 Centre Parkway, Atlanta, GA 30344",
    });

    expect(politeFetch).toHaveBeenCalledTimes(2);
    expect(result?.source).toBe("census-geocoder:Public_AR_Census2020/Census2020_Current");
  });

  it("returns null when both benchmarks find nothing", async () => {
    const politeFetch = vi.fn().mockResolvedValue({ result: { addressMatches: [] } });
    const result = await geocodeAddress({ politeFetch, address: "Nowhere" });
    expect(result).toBeNull();
  });

  it("falls back to a CDP when no incorporated place exists", async () => {
    const politeFetch = vi.fn().mockResolvedValue({
      result: {
        addressMatches: [
          {
            matchedAddress: "x",
            coordinates: { x: -100, y: 30 },
            geographies: {
              Counties: [{ GEOID: "48000", NAME: "Cameron County" }],
              "Census Designated Places": [{ GEOID: "4855555", NAME: "Brownsville CDP" }],
            },
          },
        ],
      },
    });

    const result = await geocodeAddress({ politeFetch, address: "x" });
    expect(result?.placeFips).toBe("4855555");
    expect(result?.placeName).toBe("Brownsville");
  });

  it("returns null on politeFetch errors instead of throwing", async () => {
    const politeFetch = vi.fn().mockRejectedValue(new Error("boom"));
    const result = await geocodeAddress({ politeFetch, address: "anywhere" });
    expect(result).toBeNull();
  });

  it("ignores empty addresses without calling politeFetch", async () => {
    const politeFetch = vi.fn();
    expect(await geocodeAddress({ politeFetch, address: "" })).toBeNull();
    expect(await geocodeAddress({ politeFetch, address: null })).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });
});
