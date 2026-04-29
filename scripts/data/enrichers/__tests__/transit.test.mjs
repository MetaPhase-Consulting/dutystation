import { describe, expect, it, vi } from "vitest";
import { fetchForStation } from "../transit.mjs";

describe("transit enricher", () => {
  it("identifies the nearest airport by haversine distance", async () => {
    // Point near downtown Atlanta — should pick ATL.
    const result = await fetchForStation(
      { preciseLat: 33.7490, preciseLng: -84.3880 },
      { politeFetch: vi.fn() }
    );
    expect(result?.summaryData.nearestAirportIata).toBe("ATL");
    expect(result?.summaryData.airportDistanceMi).toBeLessThan(15);
    expect(result?.areaScope).toBe("radius");
  });

  it("picks SEA for a station near Seattle", async () => {
    const result = await fetchForStation(
      { preciseLat: 47.6, preciseLng: -122.3 },
      { politeFetch: vi.fn() }
    );
    expect(result?.summaryData.nearestAirportIata).toBe("SEA");
  });

  it("works for remote southwestern stations (e.g., southern AZ near TUS)", async () => {
    const result = await fetchForStation(
      { preciseLat: 32.0, preciseLng: -110.5 },
      { politeFetch: vi.fn() }
    );
    expect(result?.summaryData.nearestAirportIata).toBe("TUS");
  });

  it("returns null without coordinates", async () => {
    expect(
      await fetchForStation({ preciseLat: null, preciseLng: null }, { politeFetch: vi.fn() })
    ).toBeNull();
  });

  it("does not call politeFetch (entirely local)", async () => {
    const politeFetch = vi.fn();
    await fetchForStation({ preciseLat: 40, preciseLng: -74 }, { politeFetch });
    expect(politeFetch).not.toHaveBeenCalled();
  });
});
