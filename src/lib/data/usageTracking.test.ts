import { beforeEach, describe, expect, it, vi } from "vitest";

const getSupabaseClientMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient: () => getSupabaseClientMock(),
}));

describe("trackUsageEvent", () => {
  beforeEach(() => {
    getSupabaseClientMock.mockReset();
  });

  it("is a no-op when the supabase client is unavailable", async () => {
    getSupabaseClientMock.mockReturnValue(null);

    const { trackUsageEvent } = await import("./usageTracking");
    await expect(
      trackUsageEvent({ eventName: "page_view" })
    ).resolves.toBeUndefined();
  });

  it("inserts the expected payload when a client is available", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    getSupabaseClientMock.mockReturnValue({ from });

    const { trackUsageEvent } = await import("./usageTracking");
    await trackUsageEvent({
      eventName: "station_detail_view",
      stationId: "presidio-station",
      eventMetadata: { source: "map" },
    });

    expect(from).toHaveBeenCalledWith("usage_events");
    expect(insert).toHaveBeenCalledWith({
      event_name: "station_detail_view",
      station_id: "presidio-station",
      event_metadata: { source: "map" },
    });
  });

  it("defaults event_metadata to an empty object when not provided", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    getSupabaseClientMock.mockReturnValue({ from });

    const { trackUsageEvent } = await import("./usageTracking");
    await trackUsageEvent({ eventName: "link_click" });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ event_metadata: {} })
    );
  });

  it("does not throw when the insert returns an error", async () => {
    const insert = vi.fn().mockResolvedValue({ error: new Error("boom") });
    const from = vi.fn().mockReturnValue({ insert });
    getSupabaseClientMock.mockReturnValue({ from });

    const { trackUsageEvent } = await import("./usageTracking");
    await expect(
      trackUsageEvent({ eventName: "search" })
    ).resolves.toBeUndefined();
  });
});
