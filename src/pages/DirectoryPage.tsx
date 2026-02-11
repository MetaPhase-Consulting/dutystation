import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Map, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { StationsList } from "@/components/directory/StationsList";
import StationMap from "@/components/StationMap";
import { useStationsQuery } from "@/lib/data/queryHooks";
import { filterStations, sanitizeSearchTerm, uniqueSorted } from "@/lib/data/stationFilters";
import { PositionType } from "@/types/station";
import { trackUsageEvent } from "@/lib/data/usageTracking";

export default function DirectoryPage() {
  const [activeView, setActiveView] = useState("list");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedState, setSelectedState] = useState("All States");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedPositions, setSelectedPositions] = useState<PositionType[]>([]);
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

  const filteredStations = useMemo(
    () =>
      filterStations(stations, {
        query: queryParam,
        sector: selectedSector,
        region: selectedRegion,
        state: selectedState,
        positionTypes: selectedPositions,
        incentiveOnly,
        sortOrder,
      }),
    [
      incentiveOnly,
      queryParam,
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
        selectedPositions,
        incentiveOnly,
        sortOrder,
      },
    });
  }, [incentiveOnly, queryParam, selectedPositions, selectedRegion, selectedSector, selectedState, sortOrder]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A4A0A]">Duty Station Directory</h1>
          <p className="text-muted-foreground">Browse and search CBP duty stations across the United States.</p>
        </div>

        <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">
              <MapPin className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" />
              Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <DirectoryFilters
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sectors={sectors}
              regions={regions}
              states={states}
              selectedPositions={selectedPositions}
              setSelectedPositions={setSelectedPositions}
              incentiveOnly={incentiveOnly}
              setIncentiveOnly={setIncentiveOnly}
            />
            {isLoading ? (
              <div className="rounded-md border p-8 text-center text-muted-foreground">Loading duty station directory...</div>
            ) : (
              <StationsList
                stations={filteredStations}
                setSelectedSector={setSelectedSector}
                setSelectedState={setSelectedState}
              />
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <div className="rounded-lg overflow-hidden border p-2">
              {isLoading ? (
                <div className="aspect-[16/10] flex items-center justify-center text-muted-foreground">
                  Loading map data...
                </div>
              ) : (
                <StationMap locations={filteredStations} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
