import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { PageMeta } from "@/components/PageMeta";

type MapView = { lng: number; lat: number; zoom: number };

const isComponentType = (value: string): value is ComponentType =>
  value === "USBP" || value === "OFO" || value === "AMO";

export default function DirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial state is hydrated from the URL once, on mount. Subsequent state
  // changes flow the other direction (state -> URL), see the sync effect
  // below. This keeps the URL as the durable "share-this-view" link without
  // binding every state read through useSearchParams.
  const initialQuery = useMemo(
    () => sanitizeSearchTerm(searchParams.get("search") ?? ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [activeView, setActiveView] = useState<"map" | "list">(
    () => (searchParams.get("view") === "list" ? "list" : "map")
  );
  const [selectedSector, setSelectedSector] = useState(
    () => searchParams.get("sector") ?? "All Sectors"
  );
  const [selectedRegion, setSelectedRegion] = useState(
    () => searchParams.get("region") ?? "All Regions"
  );
  const [selectedState, setSelectedState] = useState(
    () => searchParams.get("state") ?? "All States"
  );
  const [selectedFacilityType, setSelectedFacilityType] = useState(
    () => searchParams.get("facility") ?? "All Facility Types"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    () => (searchParams.get("sort") === "desc" ? "desc" : "asc")
  );
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>(
    () => {
      const raw = searchParams.get("component");
      if (!raw) return [];
      return raw.split(",").filter(isComponentType) as ComponentType[];
    }
  );
  const [mapView, setMapView] = useState<MapView | null>(() => {
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const zoom = Number(searchParams.get("zoom"));
    return Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(zoom)
      ? { lat, lng, zoom }
      : null;
  });
  // Captured once on mount — used to seed StationMap's initial viewport so
  // the map doesn't reset on every filter re-render.
  const [initialMapView] = useState<MapView | null>(() => mapView);

  const { data: stations = [], isLoading } = useStationsQuery();

  // queryParam stays read-through on `?search` so NavBar search still flows
  // into the directory.
  const queryParam = useMemo(
    () => sanitizeSearchTerm(searchParams.get("search") ?? initialQuery),
    [searchParams, initialQuery]
  );

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
          const cleaned = sector.split(" Sector ")[0] + " Sector";
          return { value: sector, label: `${cleaned} (${component})` };
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [sectorComponents, selectedComponents]);

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

  // Build the canonical search string from current state. Keeps URL tidy by
  // omitting default values ("All X", "asc", "map"). Map viewport lives on
  // separate keys so the same builder can be used for filter-only pushes
  // and map-only replaces.
  const buildParams = useCallback(
    (view: MapView | null): URLSearchParams => {
      const next = new URLSearchParams();
      if (queryParam) next.set("search", queryParam);
      if (selectedComponents.length) next.set("component", selectedComponents.join(","));
      if (selectedRegion !== "All Regions") next.set("region", selectedRegion);
      if (selectedSector !== "All Sectors") next.set("sector", selectedSector);
      if (selectedState !== "All States") next.set("state", selectedState);
      if (selectedFacilityType !== "All Facility Types") next.set("facility", selectedFacilityType);
      if (sortOrder !== "asc") next.set("sort", sortOrder);
      if (activeView !== "map") next.set("view", activeView);
      if (view) {
        next.set("lat", view.lat.toFixed(4));
        next.set("lng", view.lng.toFixed(4));
        next.set("zoom", view.zoom.toFixed(2));
      }
      return next;
    },
    [
      activeView,
      queryParam,
      selectedComponents,
      selectedFacilityType,
      selectedRegion,
      selectedSector,
      selectedState,
      sortOrder,
    ]
  );

  // Filter/sort/view sync — push history so the back button walks through
  // filter changes. Keeps the map viewport in sync too (same params), but
  // the map-specific effect below (replace: true) handles the frequent
  // pan/zoom case so we don't spam history.
  useEffect(() => {
    const next = buildParams(mapView);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: false });
    }
  }, [buildParams, mapView, searchParams, setSearchParams]);

  // Map viewport callback from StationMap. Replace history so the back
  // button doesn't step through every pan.
  const handleMapViewChange = useCallback(
    (view: MapView) => {
      setMapView((prev) => {
        if (
          prev &&
          Math.abs(prev.lat - view.lat) < 0.0001 &&
          Math.abs(prev.lng - view.lng) < 0.0001 &&
          Math.abs(prev.zoom - view.zoom) < 0.01
        ) {
          return prev;
        }
        const next = buildParams(view);
        if (next.toString() !== searchParams.toString()) {
          setSearchParams(next, { replace: true });
        }
        return view;
      });
    },
    [buildParams, searchParams, setSearchParams]
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
      <PageMeta
        title="Duty Station Directory"
        description="Map and list of every U.S. Customs and Border Protection duty station across USBP, OFO, and AMO. Filter by component, region, sector, state, or facility type."
        path="/directory"
      />
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
                <StationMap
                  locations={filteredStations}
                  className="h-[70vh]"
                  initialView={initialMapView}
                  onViewChange={handleMapViewChange}
                />
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
