
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DutyStation, searchDutyStations } from "@/data/dutyStations";
import { MapPin, Search, Building2, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stations, setStations] = useState<DutyStation[]>([]);
  const [activeView, setActiveView] = useState("list");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract search query from URL if present
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("search") || "";
    setSearchQuery(queryParam);
    
    // Filter stations based on search query
    setStations(searchDutyStations(queryParam));
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CBP Duty Station Directory</h1>
          <p className="text-muted-foreground">
            Browse and search CBP duty stations across the United States.
          </p>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
          <form onSubmit={handleSearch} className="flex flex-1 items-end space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, city, or state..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="w-full md:w-auto">
            <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">
                  <Building2 className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="mt-6 space-y-4">
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
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">Map view would display here</p>
                    <p className="text-xs text-muted-foreground">An interactive map showing all duty station locations</p>
                  </div>
                </div>
                
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {stations.map((station) => (
                    <Button 
                      key={station.id} 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate(`/station/${station.id}`)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate">{station.name}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
