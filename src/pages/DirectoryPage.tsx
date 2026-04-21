import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { List, Map as MapIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { StationsList } from "@/components/directory/StationsList";
import StationMap from "@/components/StationMap";
import { useStationsQuery } from "@/lib/data/queryHooks";
import { filterStations, sanitizeSearchTerm, uniqueSorted } from "@/lib/data/stationFilters";
import { ComponentType, PositionType } from "@/types/station";
import { trackUsageEvent } from "@/lib/data/usageTracking";

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

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A4A0A]">Duty Station Directory</h1>
          <p className="text-muted-foreground">
            Browse and search duty stations across USBP, OFO (ports and field offices), and AMO.
          </p>
        </div>

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

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "map" | "list")}>
          <TabsList className="grid w-full max-w-sm grid-cols-2 text-slate-700">
            <TabsTrigger value="map">
              <MapIcon className="h-4 w-4 mr-2" />
              Map
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6">
            {isLoading ? (
              <div className="aspect-[16/10] flex items-center justify-center text-muted-foreground border rounded-lg">
                Loading map data...
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border shadow-sm">
                <StationMap locations={filteredStations} className="h-[70vh]" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <div className="rounded-md border p-8 text-center text-muted-foreground">
                Loading duty stations…
              </div>
            ) : (
              <StationsList
                stations={filteredStations}
                setSelectedSector={setSelectedSector}
                setSelectedState={setSelectedState}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
