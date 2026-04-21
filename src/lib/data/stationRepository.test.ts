import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getSupabaseClientMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient: () => getSupabaseClientMock(),
}));

function makeFromChain(response: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(response);
  const select = vi.fn().mockReturnValue({ order });
  const from = vi.fn().mockReturnValue({ select });
  return { from, select, order };
}

describe("stationRepository", () => {
  beforeEach(() => {
    vi.resetModules();
    getSupabaseClientMock.mockReset();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("falls back to legacy stations when supabase is unavailable", async () => {
    getSupabaseClientMock.mockReturnValue(null);

    const { stationRepository } = await import("./stationRepository");
    const { legacyStations } = await import("./legacyStationData");

    const stations = await stationRepository.getStations();
    expect(stations).toEqual(legacyStations);
  });

  it("falls back to default travel resources when supabase is unavailable", async () => {
    getSupabaseClientMock.mockReturnValue(null);

    const { stationRepository } = await import("./stationRepository");
    const { DEFAULT_TRAVEL_RESOURCES } = await import("./legacyStationData");

    const resources = await stationRepository.getTravelResources();
    expect(resources).toEqual(DEFAULT_TRAVEL_RESOURCES);
  });

  it("returns a station by id from the legacy fallback", async () => {
    getSupabaseClientMock.mockReturnValue(null);

    const { stationRepository } = await import("./stationRepository");
    const station = await stationRepository.getStationById("presidio-station");
    expect(station).not.toBeNull();
    expect(station?.id).toBe("presidio-station");
  });

  it("returns null for an unknown station id", async () => {
    getSupabaseClientMock.mockReturnValue(null);

    const { stationRepository } = await import("./stationRepository");
    expect(await stationRepository.getStationById("does-not-exist")).toBeNull();
  });

  it("falls back to legacy data when the supabase query returns an error", async () => {
    const chain = makeFromChain({ data: null, error: new Error("db offline") });
    getSupabaseClientMock.mockReturnValue({ from: chain.from });

    const { stationRepository } = await import("./stationRepository");
    const { legacyStations } = await import("./legacyStationData");

    const stations = await stationRepository.getStations();
    expect(stations).toEqual(legacyStations);
    expect(chain.from).toHaveBeenCalledWith("stations");
  });

  it("maps supabase rows into the DutyStation shape", async () => {
    const row = {
      legacy_id: "test-station",
      name: "Test Station",
      city: "Testville",
      state: "TX",
      zip_code: "79800",
      sector: "Big Bend Sector Texas",
      lat: 30.0,
      lng: -104.0,
      region: "South",
      description: "A station used for unit tests.",
      component_type: "USBP",
      facility_type: "Station",
      source_type: "seed",
      source_parent: null,
      source_url: null,
      station_attributes: [
        { incentive_eligible: true, incentive_label: "RI", disclaimer_applies: false },
      ],
      station_positions: [{ position_type: "BPA" }, { position_type: "CBPO" }],
      station_links: [
        {
          category: "realEstate",
          url: "https://example.com/real-estate",
          original_url: "https://example.com/real-estate-old",
          is_remediated: true,
          remediation_reason: "replaced dead link",
          remediated_at: "2026-01-01",
          is_valid: true,
          last_checked_at: "2026-04-01",
          http_status: 200,
          resolved_url: "https://example.com/real-estate",
        },
      ],
      recreation_resources: [
        {
          id: "rec-1",
          category: "park",
          name: "Local Park",
          description: "Green space near the station",
          url: "https://example.com/park",
          distance_miles: 2.5,
        },
      ],
    };

    const chain = makeFromChain({ data: [row], error: null });
    getSupabaseClientMock.mockReturnValue({ from: chain.from });

    const { stationRepository } = await import("./stationRepository");
    const stations = await stationRepository.getStations();

    expect(stations).toHaveLength(1);
    const mapped = stations[0];
    expect(mapped.id).toBe("test-station");
    expect(mapped.zipCode).toBe("79800");
    expect(mapped.componentType).toBe("USBP");
    expect(mapped.attributes.incentiveEligible).toBe(true);
    expect(mapped.attributes.incentiveLabel).toBe("RI");
    expect(mapped.attributes.disclaimerApplies).toBe(false);
    expect(mapped.positionTypes).toEqual(["BPA", "CBPO"]);
    expect(mapped.links.realEstate.url).toBe("https://example.com/real-estate");
    expect(mapped.links.realEstate.isRemediated).toBe(true);
    expect(mapped.recreation).toHaveLength(1);
    expect(mapped.recreation[0].distanceMiles).toBe(2.5);
  });

  it("ignores unknown link categories when mapping rows", async () => {
    const row = {
      legacy_id: "unknown-link-station",
      name: "Station",
      city: "City",
      state: "TX",
      zip_code: "79800",
      sector: "Sector",
      lat: 30,
      lng: -104,
      region: "South",
      description: "desc",
      component_type: "USBP",
      facility_type: "Station",
      source_type: null,
      source_parent: null,
      source_url: null,
      station_attributes: null,
      station_positions: null,
      station_links: [
        {
          category: "not-a-real-category",
          url: "https://example.com/ignored",
          original_url: null,
          is_remediated: false,
          remediation_reason: null,
          remediated_at: null,
          is_valid: null,
          last_checked_at: null,
          http_status: null,
          resolved_url: null,
        },
      ],
      recreation_resources: null,
    };

    const chain = makeFromChain({ data: [row], error: null });
    getSupabaseClientMock.mockReturnValue({ from: chain.from });

    const { stationRepository } = await import("./stationRepository");
    const [station] = await stationRepository.getStations();
    const allLinkUrls = Object.values(station.links).map((link) => link.url);
    expect(allLinkUrls).not.toContain("https://example.com/ignored");
    expect(station.positionTypes).toEqual(["BPA"]);
    expect(station.attributes.disclaimerApplies).toBe(true);
  });

  it("maps travel resources from supabase when present", async () => {
    const chain = makeFromChain({
      data: [
        {
          id: "tr-1",
          category: "airport",
          name: "El Paso International",
          description: "Nearest major airport",
          url: "https://example.com/elp",
          display_order: 1,
        },
      ],
      error: null,
    });
    getSupabaseClientMock.mockReturnValue({ from: chain.from });

    const { stationRepository } = await import("./stationRepository");
    const resources = await stationRepository.getTravelResources();
    expect(resources).toHaveLength(1);
    expect(resources[0].displayOrder).toBe(1);
    expect(resources[0].name).toBe("El Paso International");
  });

  it("falls back to default travel resources when supabase returns an empty array", async () => {
    const chain = makeFromChain({ data: [], error: null });
    getSupabaseClientMock.mockReturnValue({ from: chain.from });

    const { stationRepository } = await import("./stationRepository");
    const { DEFAULT_TRAVEL_RESOURCES } = await import("./legacyStationData");

    const resources = await stationRepository.getTravelResources();
    expect(resources).toEqual(DEFAULT_TRAVEL_RESOURCES);
  });
});
