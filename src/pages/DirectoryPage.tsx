import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DutyStation, searchDutyStations } from "@/data/dutyStations";
import { MapPin, Map, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StationMap from "@/components/StationMap";

const sectors = [
  "All Sectors",
  "Big Bend",
  "Del Rio",
  "El Centro",
  "El Paso",
  "Grand Forks",
  "Havre",
  "Houlton",
  "Laredo",
  "Miami",
  "New Orleans",
  "Rio Grande Valley",
  "San Diego",
  "Spokane",
  "Swanton",
  "Tucson",
  "Yuma"
];

const states = [
  "All States",
  "Arizona",
  "California",
  "Florida",
  "Idaho",
  "Louisiana",
  "Maine",
  "Michigan",
  "Minnesota",
  "Montana",
  "New Hampshire",
  "New Mexico",
  "New York",
  "North Dakota",
  "Texas",
  "Vermont",
  "Washington"
];

export default function DirectoryPage() {
  const [stations, setStations] = useState<DutyStation[]>([]);
  const [activeView, setActiveView] = useState("list");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedState, setSelectedState] = useState("All States");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("search") || "";
    let filteredStations = searchDutyStations(queryParam);

    // Apply sector filter
    if (selectedSector !== "All Sectors") {
      filteredStations = filteredStations.filter(
        station => station.region === selectedSector
      );
    }

    // Apply state filter
    if (selectedState !== "All States") {
      filteredStations = filteredStations.filter(
        station => station.state === selectedState
      );
    }

    // Apply sorting
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
            <div className="flex flex-wrap gap-4 mb-6">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="gap-2"
              >
                {sortOrder === "asc" ? (
                  <>
                    <ArrowDownAZ className="h-4 w-4" />
                    A to Z
                  </>
                ) : (
                  <>
                    <ArrowUpAZ className="h-4 w-4" />
                    Z to A
                  </>
                )}
              </Button>
            </div>

            {stations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                <p className="text-muted-foreground">No duty stations found matching your search.</p>
                <Button variant="link" onClick={() => navigate("/directory")}>
                  Clear search and show all
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stations.map((station) => (
                  <Card key={station.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{station.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {station.city}, {station.state}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>{station.description}</p>
                      <div className="mt-2 text-xs font-medium">Region: {station.region}</div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/station/${station.id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
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
