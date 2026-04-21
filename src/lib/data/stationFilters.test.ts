import { describe, expect, it } from "vitest";
import { filterStations, sanitizeSearchTerm } from "@/lib/data/stationFilters";
import { legacyStations } from "@/lib/data/legacyStationData";

describe("stationFilters", () => {
  it("sanitizes dangerous search characters", () => {
    expect(sanitizeSearchTerm(`<script>alert('x')</script>`)).toBe("scriptalert(x)/script");
  });

  it("filters by query", () => {
    const results = filterStations(legacyStations, { query: "Ajo" });

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((station) =>
        station.name.toLowerCase().includes("ajo") ||
        station.city.toLowerCase().includes("ajo")
      )
    ).toBe(true);
  });

  it("filters by selected position type", () => {
    const results = filterStations(legacyStations, {
      positionTypes: ["AMO"],
    });

    // Local fallback defaults to BPA only until official position mapping is loaded.
    expect(results).toEqual([]);
  });

  it("filters by component type", () => {
    const usbpResults = filterStations(legacyStations, {
      componentTypes: ["USBP"],
    });

    const ofoResults = filterStations(legacyStations, {
      componentTypes: ["OFO"],
    });

    expect(usbpResults.length).toBe(legacyStations.length);
    expect(ofoResults).toEqual([]);
  });

  it("filters by facility type", () => {
    const results = filterStations(legacyStations, {
      facilityTypes: ["Station"],
    });

    expect(results.length).toBe(legacyStations.length);
    expect(results.every((station) => station.facilityType === "Station")).toBe(true);
  });

  it("sorts descending when requested", () => {
    const results = filterStations(legacyStations, {
      sortOrder: "desc",
    });

    expect(results[0].name.localeCompare(results[results.length - 1].name)).toBeGreaterThanOrEqual(0);
  });
});
