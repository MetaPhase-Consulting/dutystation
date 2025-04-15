
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DutyStation, searchDutyStations } from "@/data/dutyStations";
import { Map, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { StationsList } from "@/components/directory/StationsList";
import StationMap from "@/components/StationMap";

// Get unique sectors from the data to ensure we're using correct values
const allStations = searchDutyStations("");
const uniqueSectors = ["All Sectors", ...new Set(allStations.map(station => station.sector))].sort();

// Get unique states from the data
const uniqueStates = ["All States", ...new Set(allStations.map(station => station.state))].sort();

export default function DirectoryPage() {
  const [stations, setStations] = useState<DutyStation[]>([]);
  const [activeView, setActiveView] = useState("list");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedState, setSelectedState] = useState("All States");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const location = useLocation();

  // For debugging
  useEffect(() => {
    console.info("Selected sector:", selectedSector);
    console.info("Selected state:", selectedState);
  }, [selectedSector, selectedState]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("search") || "";
    
    const allStations = searchDutyStations(queryParam);
    console.info("Initial stations count:", allStations.length);
    
    let filteredStations = [...allStations];
    
    // Apply sector filter if not "All Sectors"
    if (selectedSector !== "All Sectors") {
      filteredStations = filteredStations.filter(
        station => station.sector === selectedSector
      );
      console.info("After sector filter, stations count:", filteredStations.length);
    }

    // Apply state filter if not "All States"
    if (selectedState !== "All States") {
      filteredStations = filteredStations.filter(
        station => station.state === selectedState
      );
      console.info("After state filter, stations count:", filteredStations.length);
    }

    // Sort stations by name
    filteredStations.sort((a, b) => {
      const compareResult = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });

    setStations(filteredStations);
  }, [location.search, selectedSector, selectedState, sortOrder]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CBP Duty Station Directory</h1>
          <p className="text-muted-foreground">
            Browse and search CBP duty stations across the United States.
          </p>
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
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sectors={uniqueSectors}
              states={uniqueStates}
            />
            <StationsList
              stations={stations}
              setSelectedSector={setSelectedSector}
              setSelectedState={setSelectedState}
            />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <div className="aspect-[16/10] rounded-lg overflow-hidden border">
              <StationMap locations={stations} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
