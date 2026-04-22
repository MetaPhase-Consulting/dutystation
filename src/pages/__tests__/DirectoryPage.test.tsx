import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DirectoryPage from "@/pages/DirectoryPage";
import { DutyStation, StationLinkCategory } from "@/types/station";
import { renderWithRouterAndQueryClient } from "@/test/test-utils";
import { useStationsQuery } from "@/lib/data/queryHooks";

vi.mock("@/lib/data/queryHooks", () => ({
  useStationsQuery: vi.fn(),
}));

vi.mock("@/lib/data/usageTracking", () => ({
  trackUsageEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/components/StationMap", () => ({
  default: ({ locations = [] }: { locations?: DutyStation[] }) => (
    <div data-testid="station-map-mock">Map count: {locations.length}</div>
  ),
}));

const mockedUseStationsQuery = vi.mocked(useStationsQuery);

const categories: StationLinkCategory[] = [
  "realEstate",
  "schools",
  "crime",
  "costOfLiving",
  "weather",
  "transit",
  "movingTips",
  "demographics",
  "healthcare",
  "jobs",
];

function createStation(overrides: Partial<DutyStation>): DutyStation {
  const links = Object.fromEntries(
    categories.map((category) => [
      category,
      {
        category,
        url: `https://example.com/${category}`,
        originalUrl: `https://example.com/${category}`,
        isRemediated: false,
        remediationReason: null,
        remediatedAt: null,
        isValid: true,
        lastCheckedAt: null,
        statusCode: 200,
        resolvedUrl: null,
      },
    ])
  ) as DutyStation["links"];

  return {
    id: "station-default",
    name: "Default Station",
    city: "City",
    state: "TX",
    zipCode: "75001",
    sector: "Default Sector",
    lat: 31,
    lng: -100,
    region: "Southwest",
    description: "Default station description",
    componentType: "USBP",
    facilityType: "Station",
    sourceType: "Station",
    sourceParent: "Default Sector",
    sourceUrl: null,
    positionTypes: ["BPA"],
    attributes: {
      incentiveEligible: false,
      incentiveLabel: null,
      disclaimerApplies: true,
    },
    links,
    recreation: [],
    streetAddress: null,
    streetAddress2: null,
    preciseLat: null,
    preciseLng: null,
    countyName: null,
    countyFips: null,
    placeName: null,
    placeFips: null,
    addressGeocodedAt: null,
    addressGeocodeSource: null,
    summaries: {},
    ...overrides,
  };
}

describe("DirectoryPage", () => {
  const stations: DutyStation[] = [
    createStation({ id: "usbp-1", name: "USBP Example", componentType: "USBP", facilityType: "Station" }),
    createStation({
      id: "ofo-1",
      name: "OFO Port Example",
      componentType: "OFO",
      facilityType: "Port of Entry",
      positionTypes: ["CBPO"],
    }),
    createStation({
      id: "amo-1",
      name: "AMO Air Example",
      componentType: "AMO",
      facilityType: "Field Office",
      positionTypes: ["AMO"],
    }),
  ];

  it("defaults to map-first rendering", () => {
    mockedUseStationsQuery.mockReturnValue({
      data: stations,
      isLoading: false,
    } as ReturnType<typeof useStationsQuery>);

    renderWithRouterAndQueryClient(<DirectoryPage />);

    expect(screen.getByTestId("station-map-mock")).toHaveTextContent("Map count: 3");
  });

  it("updates map and list results when component filter is applied", async () => {
    mockedUseStationsQuery.mockReturnValue({
      data: stations,
      isLoading: false,
    } as ReturnType<typeof useStationsQuery>);

    const user = userEvent.setup();
    renderWithRouterAndQueryClient(<DirectoryPage />);

    await user.click(screen.getByRole("button", { name: "OFO" }));

    // Map view is default: verify filter narrowed the marker count.
    expect(screen.getByTestId("station-map-mock")).toHaveTextContent("Map count: 1");

    // Switch to List tab and verify the same filter applied there too.
    await user.click(screen.getByRole("tab", { name: /List/i }));

    expect(screen.getByText("OFO Port Example")).toBeInTheDocument();
    expect(screen.queryByText("USBP Example")).not.toBeInTheDocument();
    expect(screen.queryByText("AMO Air Example")).not.toBeInTheDocument();
  });
});
