import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { List, Map as MapIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { MapLegend } from "@/components/directory/MapLegend";
import { SortControl } from "@/components/directory/SortControl";
import { StationsList } from "@/components/directory/StationsList";
import StationMap from "@/components/StationMap";
import { useStationsQuery } from "@/lib/data/queryHooks";
import { filterStations, sanitizeSearchTerm, uniqueSorted } from "@/lib/data/stationFilters";
import { ComponentType } from "@/types/station";
import { trackUsageEvent } from "@/lib/data/usageTracking";

export default function DirectoryPage() {
  const [activeView, setActiveView] = useState<"map" | "list">("map");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedFacilityType, setSelectedFacilityType] = useState("All Facility Types");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>([]);
  const { data: stations = [], isLoading } = useStationsQuery();
  const location = useLocation();

  const queryParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return sanitizeSearchTerm(params.get("search") ?? "");
  }, [location.search]);

  // Map of raw sector string -> componentType so we can label sectors with
  // their component (e.g. "Laredo Sector (USBP)") and filter the dropdown
  // to sectors belonging to the currently selected components.
  const sectorComponents = useMemo(() => {
    const map = new Map<string, ComponentType>();
    stations.forEach((station) => {
      if (!map.has(station.sector)) {
        map.set(station.sector, station.componentType);
      }
    });
    return map;
  }, [stations]);

  const sectorOptions = useMemo(() => {
    const raw = Array.from(sectorComponents.entries());
    const filtered =
      selectedComponents.length === 0
        ? raw
        : raw.filter(([, component]) => selectedComponents.includes(component));
    return [
      { value: "All Sectors", label: "All Sectors" },
      ...filtered
        .map(([sector, component]) => {
          // "Laredo Sector Texas" -> "Laredo Sector"; keep everything up to
          // and including the first " Sector " token.
          const cleaned = sector.split(" Sector ")[0] + " Sector";
          return { value: sector, label: `${cleaned} (${component})` };
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [sectorComponents, selectedComponents]);

  // If the currently selected sector isn't available for the active
  // component filter (e.g. switched from USBP to OFO-only), reset.
  useEffect(() => {
    if (
      selectedSector !== "All Sectors" &&
      !sectorOptions.some((option) => option.value === selectedSector)
    ) {
      setSelectedSector("All Sectors");
    }
  }, [sectorOptions, selectedSector]);

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
        positionTypes: [],
        sortOrder,
      }),
    [
      queryParam,
      selectedComponents,
      selectedFacilityType,
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
        sortOrder,
      },
    });
  }, [
    queryParam,
    selectedComponents,
    selectedFacilityType,
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
            Browse and search duty stations, including ports, field offices, and stations across USBP, OFO, and AMO.
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
          sectorOptions={sectorOptions}
          regions={regions}
          states={states}
          selectedComponents={selectedComponents}
          setSelectedComponents={setSelectedComponents}
        />

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "map" | "list")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
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

            {activeView === "map" ? (
              <MapLegend />
            ) : (
              <SortControl sortOrder={sortOrder} setSortOrder={setSortOrder} />
            )}
          </div>

          <TabsContent value="map" className="mt-4">
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

          <TabsContent value="list" className="mt-4">
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
