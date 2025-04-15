import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DutyStation, searchDutyStations } from "@/data/dutyStations";
import { MapPin, Map } from "lucide-react";
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
import StationMap from "@/components/StationMap";

export default function DirectoryPage() {
  const [stations, setStations] = useState<DutyStation[]>([]);
  const [activeView, setActiveView] = useState("list");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("search") || "";
    
    setStations(searchDutyStations(queryParam));
  }, [location.search]);

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
            <div className="aspect-[16/10] rounded-lg overflow-hidden border">
              <StationMap locations={stations} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
