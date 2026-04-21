import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StationDetailPage from "@/pages/StationDetailPage";

vi.mock("@/components/StationDetailMap", () => ({
  default: () => <div data-testid="station-detail-map" />,
}));

vi.mock("@/lib/data/queryHooks", () => ({
  useStationByIdQuery: () => ({
    isLoading: false,
    data: {
      id: "test-station",
      name: "Test Station",
      city: "Test City",
      state: "TX",
      zipCode: "75001",
      sector: "Test Sector",
      lat: 30,
      lng: -98,
      region: "Southwest",
      description: "A test station.",
      componentType: "USBP",
      facilityType: "Station",
      sourceType: "Station",
      sourceParent: "Test Sector",
      sourceUrl: null,
      positionTypes: ["BPA"],
      attributes: {
        incentiveEligible: true,
        incentiveLabel: "Incentive Eligible",
        disclaimerApplies: true,
      },
      links: {
        realEstate: { category: "realEstate", url: "https://example.com/realestate", originalUrl: "https://example.com/realestate", isRemediated: false, remediationReason: null, remediatedAt: null, isValid: true, lastCheckedAt: null, statusCode: 200, resolvedUrl: null },
        schools: { category: "schools", url: "https://example.com/schools", originalUrl: "https://example.com/schools", isRemediated: false, remediationReason: null, remediatedAt: null, isValid: true, lastCheckedAt: null, statusCode: 200, resolvedUrl: null },
        crime: { category: "crime", url: "https://example.com/crime", originalUrl: "https://example.com/crime", isRemediated: false, remediationReason: null, remediatedAt: null, isValid: true, lastCheckedAt: null, statusCode: 200, resolvedUrl: null },
        costOfLiving: { category: "costOfLiving", url: "https://example.com/cost", originalUrl: "https://example.com/cost", isRemediated: false, remediationReason: null, remediatedAt: null, isValid: true, lastCheckedAt: null, statusCode: 200, resolvedUrl: null },
        weather: { category: "weather", url: "https://example.com/weather", originalUrl: "https://example.com/weather", isRemediated: false, remediationReason: null, remediatedAt: null, isValid: true, lastCheckedAt: null, statusCode: 200, resolvedUrl: null },
        transit: { category: "transit", url: "https://example.com/transit", originalUrl: "https://example.com/transit", isRemediated: true, remediationReason: "Updated source", remediatedAt: "2026-02-12T00:00:00.000Z", isValid: false, lastCheckedAt: null, statusCode: 404, resolvedUrl: null },
        movingTips: { category: "movingTips", url: "https://example.com/moving", originalUrl: "https://example.com/moving", isRemediated: false, remediationReason: null, remediatedAt: null, isValid: true, lastCheckedAt: null, statusCode: 200, resolvedUrl: null },
      },
      recreation: [
        {
          id: "rec-1",
          category: "Outdoor",
          name: "Trail",
          description: "A nearby trail.",
          url: "https://example.com/trail",
          distanceMiles: 12,
        },
      ],
    },
  }),
  useTravelResourcesQuery: () => ({
    data: [
      {
        id: "travel",
        category: "trip-planner",
        name: "Travel",
        description: "Compare flights, hotels, and rental cars for relocation planning.",
        url: "https://www.kayak.com/",
        displayOrder: 1,
      },
    ],
  }),
}));

describe("StationDetailPage", () => {
  it("renders disclaimer, travel resources, and recreation", () => {
    render(
      <MemoryRouter initialEntries={["/station/test-station"]}>
        <Routes>
          <Route path="/station/:id" element={<StationDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Disclaimer appears at the bottom of the station page (footer has no
    // site-wide one; it lives here instead).
    expect(
      screen.getByText(/CBP is not responsible for relocation costs/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText("Travel").length).toBeGreaterThan(0);
    expect(screen.getByText("Recreation")).toBeInTheDocument();
    // Source attribution (derived from URL hostname) now shows under each link.
    expect(screen.getAllByText(/Source:/).length).toBeGreaterThan(0);

    // The removed "Link may be unavailable" / "Updated source" UI should no
    // longer render — bad links are remediated in the data pipeline, not
    // flagged in the UI.
    expect(screen.queryByText("Link may be unavailable")).toBeNull();
    expect(screen.queryByText("Link quality unverified")).toBeNull();
    expect(screen.queryByText("Updated source")).toBeNull();
  });
});
