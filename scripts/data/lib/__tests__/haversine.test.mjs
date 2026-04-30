import { describe, expect, it } from "vitest";
import { haversineMiles } from "../haversine.mjs";

describe("haversineMiles", () => {
  it("returns ~0 for the same point", () => {
    expect(haversineMiles(33.7, -84.4, 33.7, -84.4)).toBeCloseTo(0, 5);
  });

  it("matches a known city pair (LAX → JFK ≈ 2475 mi)", () => {
    const distance = haversineMiles(33.9425, -118.4081, 40.6413, -73.7781);
    expect(distance).toBeGreaterThan(2400);
    expect(distance).toBeLessThan(2500);
  });

  it("matches a short pair (SFO → OAK ≈ 11 mi)", () => {
    const distance = haversineMiles(37.6213, -122.379, 37.7213, -122.2208);
    expect(distance).toBeGreaterThan(8);
    expect(distance).toBeLessThan(15);
  });

  it("returns null when any coordinate is non-finite", () => {
    expect(haversineMiles(NaN, 0, 0, 0)).toBeNull();
    expect(haversineMiles(0, undefined, 0, 0)).toBeNull();
  });
});
