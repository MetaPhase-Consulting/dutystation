import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { LayoutPanelLeft, List, Map as MapIcon } from "lucide-react";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { StationsList } from "@/components/directory/StationsList";
import StationMap from "@/components/StationMap";
import { useStationsQuery } from "@/lib/data/queryHooks";
import { filterStations, sanitizeSearchTerm, uniqueSorted } from "@/lib/data/stationFilters";
import { ComponentType, PositionType } from "@/types/station";
import { trackUsageEvent } from "@/lib/data/usageTracking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DirectoryPage() {
  const [activeView, setActiveView] = useState<"map" | "list">("map");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedFacilityType, setSelectedFacilityType] = useState("All Facility Types");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedPositions, setSelectedPositions] = useState<PositionType[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>([]);
  const [incentiveOnly, setIncentiveOnly] = useState(false);
  const [showDesktopListPanel, setShowDesktopListPanel] = useState(true);
  const { data: stations = [], isLoading } = useStationsQuery();
  const location = useLocation();

  const queryParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return sanitizeSearchTerm(params.get("search") ?? "");
  }, [location.search]);

  const sectors = useMemo(
    () => uniqueSorted(stations.map((station) => station.sector), "All Sectors"),
    [stations]
  );
  const regions = useMemo(
    () => uniqueSorted(stations.map((station) => station.region), "All Regions"),
    [stations]
  );
  const states = useMemo(
    () => uniqueSorted(stations.map((station) => station.state), "All States"),
    [stations]
  );
  const facilityTypes = useMemo(
    () => uniqueSorted(stations.map((station) => station.facilityType), "All Facility Types"),
    [stations]
  );

  const filteredStations = useMemo(
    () =>
      filterStations(stations, {
        query: queryParam,
        sector: selectedSector,
        region: selectedRegion,
        state: selectedState,
        facilityTypes:
          selectedFacilityType === "All Facility Types"
            ? []
            : [selectedFacilityType as "Station" | "Port of Entry" | "Field Office" | "Sector" | "Other"],
        componentTypes: selectedComponents,
        positionTypes: selectedPositions,
        incentiveOnly,
        sortOrder,
      }),
    [
      incentiveOnly,
      queryParam,
      selectedComponents,
      selectedFacilityType,
      selectedPositions,
      selectedRegion,
      selectedSector,
      selectedState,
      sortOrder,
      stations,
    ]
  );

  useEffect(() => {
    trackUsageEvent({
      eventName: "directory_filter_change",
      eventMetadata: {
        queryParam,
        selectedSector,
        selectedRegion,
        selectedState,
        selectedFacilityType,
        selectedComponents,
        selectedPositions,
        incentiveOnly,
        sortOrder,
      },
    });
  }, [
    incentiveOnly,
    queryParam,
    selectedComponents,
    selectedFacilityType,
    selectedPositions,
    selectedRegion,
    selectedSector,
    selectedState,
    sortOrder,
  ]);

  const listContent = isLoading ? (
    <div className="rounded-md border p-8 text-center text-muted-foreground">Loading CBP duty location directory...</div>
  ) : (
    <StationsList
      stations={filteredStations}
      setSelectedSector={setSelectedSector}
      setSelectedState={setSelectedState}
    />
  );

  const mapContent = isLoading ? (
    <div className="aspect-[16/10] flex items-center justify-center text-muted-foreground">Loading map data...</div>
  ) : (
    <StationMap locations={filteredStations} className="min-h-[70vh]" />
  );

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A4A0A]">CBP Duty Location Directory</h1>
          <p className="text-muted-foreground">
            Explore CBP duty locations across USBP, OFO (ports and field offices), and AMO assignments.
          </p>
        </div>

        <div className="flex gap-2 lg:hidden">
          <Button
            variant={activeView === "map" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setActiveView("map")}
          >
            <MapIcon className="mr-2 h-4 w-4" />
            Map
          </Button>
          <Button
            variant={activeView === "list" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setActiveView("list")}
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[360px_1fr] lg:items-start">
          <div className="space-y-4">
            <DirectoryFilters
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedFacilityType={selectedFacilityType}
              setSelectedFacilityType={setSelectedFacilityType}
              facilityTypes={facilityTypes}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sectors={sectors}
              regions={regions}
              states={states}
              selectedPositions={selectedPositions}
              setSelectedPositions={setSelectedPositions}
              selectedComponents={selectedComponents}
              setSelectedComponents={setSelectedComponents}
              incentiveOnly={incentiveOnly}
              setIncentiveOnly={setIncentiveOnly}
            />

            <Card className="hidden lg:block">
              <CardContent className="p-3">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#0A4A0A]">Location List</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowDesktopListPanel((current) => !current)}
                  >
                    <LayoutPanelLeft className="mr-1 h-4 w-4" />
                    {showDesktopListPanel ? "Collapse" : "Expand"}
                  </Button>
                </div>
                {showDesktopListPanel ? (
                  <div className="max-h-[55vh] overflow-auto pr-1">{listContent}</div>
                ) : (
                  <p className="text-sm text-muted-foreground">List collapsed. Use map markers to explore locations.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {(activeView === "map" || typeof window === "undefined") && (
              <div className="rounded-lg overflow-hidden border p-2 shadow-sm">{mapContent}</div>
            )}
            {activeView === "list" && <div className="lg:hidden">{listContent}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
