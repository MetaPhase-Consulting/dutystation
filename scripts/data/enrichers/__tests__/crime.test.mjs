import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchForStation,
  annualizeAgencyRate,
  annualizeNationalRate,
  computeSafetyIndex,
} from "../crime.mjs";
import { clearAgencyCache } from "../../lib/cde-agency.mjs";

let originalKey;

beforeEach(() => {
  originalKey = process.env.DATA_GOV_API_KEY;
  clearAgencyCache();
});

afterEach(() => {
  if (originalKey === undefined) delete process.env.DATA_GOV_API_KEY;
  else process.env.DATA_GOV_API_KEY = originalKey;
});

const PRIMARY_YEAR = new Date().getUTCFullYear() - 1;

const GLOBE = {
  legacyId: "cbp-globe-az",
  state: "AZ",
  preciseLat: 33.395,
  preciseLng: -110.788,
};

function monthlyRates(annualSum) {
  // Spread an annual rate across 12 equal monthly entries so
  // sumMonthlyRates × (12/12) reproduces it exactly.
  const monthly = annualSum / 12;
  const out = {};
  for (let m = 1; m <= 12; m += 1) {
    out[`${String(m).padStart(2, "0")}-${PRIMARY_YEAR}`] = monthly;
  }
  return out;
}

function agencyResponse({ agencyName, agencyAnnualRate, stateName, stateRate, usRate }) {
  return {
    offenses: {
      rates: {
        [`${agencyName} Offenses`]: monthlyRates(agencyAnnualRate),
        [`${stateName} Offenses`]: monthlyRates(stateRate),
        "United States Offenses": monthlyRates(usRate),
      },
    },
    populations: { population: {} },
  };
}

function nationalResponse(rate) {
  return {
    offenses: {
      rates: {
        "United States Offenses": monthlyRates(rate),
      },
    },
  };
}

function agencyListing() {
  return {
    GILA: [
      {
        ori: "AZ0040100",
        agency_name: "Globe Police Department",
        agency_type_name: "City",
        counties: "GILA",
        latitude: 33.395485,
        longitude: -110.788,
        state_abbr: "AZ",
        state_name: "Arizona",
        is_nibrs: true,
        nibrs_start_date: "2023-01-01",
      },
      {
        ori: "AZ0040000",
        agency_name: "Gila County Sheriff",
        agency_type_name: "County",
        counties: "GILA",
        latitude: 33.789,
        longitude: -110.811,
        state_abbr: "AZ",
        state_name: "Arizona",
        is_nibrs: true,
      },
    ],
  };
}

describe("crime enricher (agency-level)", () => {
  it("picks the nearest NIBRS-reporting city PD and reports per-100k rates", async () => {
    process.env.DATA_GOV_API_KEY = "test-key";

    const politeFetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/agency/byStateAbbr/AZ")) {
        return Promise.resolve(agencyListing());
      }
      if (url.includes("/summarized/agency/AZ0040100/violent-crime")) {
        return Promise.resolve(
          agencyResponse({
            agencyName: "Globe Police Department",
            agencyAnnualRate: 240,
            stateName: "Arizona",
            stateRate: 480,
            usRate: 360,
          })
        );
      }
      if (url.includes("/summarized/agency/AZ0040100/property-crime")) {
        return Promise.resolve(
          agencyResponse({
            agencyName: "Globe Police Department",
            agencyAnnualRate: 1800,
            stateName: "Arizona",
            stateRate: 2400,
            usRate: 1900,
          })
        );
      }
      if (url.includes("/summarized/national/violent-crime")) {
        return Promise.resolve(nationalResponse(360));
      }
      if (url.includes("/summarized/national/property-crime")) {
        return Promise.resolve(nationalResponse(1900));
      }
      throw new Error(`unexpected url: ${url}`);
    });

    const result = await fetchForStation(GLOBE, { politeFetch });

    expect(result?.areaScope).toBe("custom");
    expect(result?.areaKey).toBe("AZ0040100");
    expect(result?.summaryData).toMatchObject({
      agencyOri: "AZ0040100",
      agencyName: "Globe Police Department",
      agencyType: "City",
      violentPer100k: 240,
      propertyPer100k: 1800,
      usViolentPer100k: 360,
      usPropertyPer100k: 1900,
      asOfYear: PRIMARY_YEAR,
    });
    // (240/360 + 1800/1900) / 2 ≈ 0.81 → 100 - 40.5 ≈ 59-60.
    expect(result?.summaryData.safetyIndex0to100).toBeGreaterThan(55);
    expect(result?.summaryData.safetyIndex0to100).toBeLessThan(65);
    expect(result?.sourceUrl).not.toContain("api_key=");
  });

  it("falls back to the next nearest agency when the first returns empty rates", async () => {
    process.env.DATA_GOV_API_KEY = "test-key";

    const politeFetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/agency/byStateAbbr/AZ")) {
        return Promise.resolve(agencyListing());
      }
      // Globe PD: empty rates for both offenses
      if (url.includes("/summarized/agency/AZ0040100/")) {
        return Promise.resolve({ offenses: { rates: {} } });
      }
      // Gila County Sheriff: returns data
      if (url.includes("/summarized/agency/AZ0040000/violent-crime")) {
        return Promise.resolve(
          agencyResponse({
            agencyName: "Gila County Sheriff",
            agencyAnnualRate: 180,
            stateName: "Arizona",
            stateRate: 480,
            usRate: 360,
          })
        );
      }
      if (url.includes("/summarized/agency/AZ0040000/property-crime")) {
        return Promise.resolve(
          agencyResponse({
            agencyName: "Gila County Sheriff",
            agencyAnnualRate: 1500,
            stateName: "Arizona",
            stateRate: 2400,
            usRate: 1900,
          })
        );
      }
      if (url.includes("/summarized/national/violent-crime")) {
        return Promise.resolve(nationalResponse(360));
      }
      if (url.includes("/summarized/national/property-crime")) {
        return Promise.resolve(nationalResponse(1900));
      }
      throw new Error(`unexpected url: ${url}`);
    });

    const result = await fetchForStation(GLOBE, { politeFetch });
    expect(result?.summaryData.agencyOri).toBe("AZ0040000");
    expect(result?.summaryData.agencyType).toBe("County");
  });

  it("returns null when no agencies are within range", async () => {
    process.env.DATA_GOV_API_KEY = "test-key";
    const politeFetch = vi.fn().mockResolvedValue({});
    const result = await fetchForStation(GLOBE, { politeFetch });
    expect(result).toBeNull();
  });

  it("returns null when state code is invalid", async () => {
    process.env.DATA_GOV_API_KEY = "test-key";
    const politeFetch = vi.fn();
    expect(
      await fetchForStation({ state: "INVALID", preciseLat: 0, preciseLng: 0 }, { politeFetch })
    ).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("returns null when station has no precise coordinates", async () => {
    process.env.DATA_GOV_API_KEY = "test-key";
    const politeFetch = vi.fn();
    expect(
      await fetchForStation({ state: "AZ" }, { politeFetch })
    ).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("throws when DATA_GOV_API_KEY is unset", async () => {
    delete process.env.DATA_GOV_API_KEY;
    await expect(
      fetchForStation(GLOBE, { politeFetch: vi.fn() })
    ).rejects.toThrow(/DATA_GOV_API_KEY/);
  });

  it("annualizes by scaling the monthly average to 12 months", () => {
    const body = {
      offenses: {
        rates: {
          "Globe Police Department Offenses": {
            "01-2024": 30,
            "02-2024": 30,
            "03-2024": 30,
            // partial year (only 3 months reported) — should still annualise to ~360
          },
        },
      },
    };
    expect(annualizeAgencyRate(body, "Globe Police Department")).toBe(360);
  });

  it("computes the safety index symmetrically", () => {
    expect(computeSafetyIndex(180, 950, 360, 1900)).toBe(75); // half the U.S. rate → 75
    expect(computeSafetyIndex(360, 1900, 360, 1900)).toBe(50); // exactly U.S. baseline
    expect(computeSafetyIndex(720, 3800, 360, 1900)).toBe(0); // double the rate → clamped 0
  });

  it("annualizeNationalRate finds the United States line in mixed responses", () => {
    const body = {
      offenses: {
        rates: {
          "United States Offenses": monthlyRates(360),
          "Arizona Offenses": monthlyRates(480),
        },
      },
    };
    expect(annualizeNationalRate(body)).toBe(360);
  });
});
