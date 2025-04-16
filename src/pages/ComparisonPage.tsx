import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DutyStation, dutyStations, findDutyStationById } from "@/data/dutyStations";
import { MapPin, Home, GraduationCap, Shield, DollarSign, CloudSun, Car, Package, ArrowLeftRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ComparisonPage() {
  const [station1, setStation1] = useState<DutyStation | null>(null);
  const [station2, setStation2] = useState<DutyStation | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Sort duty stations alphabetically by name
  const sortedDutyStations = [...dutyStations].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  useEffect(() => {
    // Extract station IDs from URL if present
    const params = new URLSearchParams(location.search);
    const station1Id = params.get("station1");
    const station2Id = params.get("station2");
    
    if (station1Id) {
      const foundStation = findDutyStationById(station1Id);
      if (foundStation) setStation1(foundStation);
    }
    
    if (station2Id) {
      const foundStation = findDutyStationById(station2Id);
      if (foundStation) setStation2(foundStation);
    }
  }, [location.search]);

  const handleStation1Change = (stationId: string) => {
    const station = findDutyStationById(stationId);
    if (station) {
      setStation1(station);
      
      // Update URL with selected station
      const params = new URLSearchParams(location.search);
      params.set("station1", stationId);
      navigate(`/compare?${params.toString()}`);
    }
  };

  const handleStation2Change = (stationId: string) => {
    const station = findDutyStationById(stationId);
    if (station) {
      setStation2(station);
      
      // Update URL with selected station
      const params = new URLSearchParams(location.search);
      params.set("station2", stationId);
      navigate(`/compare?${params.toString()}`);
    }
  };

  const resourceCategories = [
    {
      name: "Real Estate",
      description: "Housing options and property listings",
      icon: Home,
      linkKey: "realEstate" as const,
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Schools",
      description: "Information about local schools",
      icon: GraduationCap,
      linkKey: "schools" as const,
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Crime",
      description: "Crime statistics for the area",
      icon: Shield,
      linkKey: "crime" as const,
      color: "bg-red-100 text-red-700",
    },
    {
      name: "Cost of Living",
      description: "Cost of living metrics",
      icon: DollarSign,
      linkKey: "costOfLiving" as const,
      color: "bg-amber-100 text-amber-700",
    },
    {
      name: "Weather",
      description: "Local climate and weather patterns",
      icon: CloudSun,
      linkKey: "weather" as const,
      color: "bg-sky-100 text-sky-700",
    },
    {
      name: "Transit",
      description: "Transportation options and commute info",
      icon: Car,
      linkKey: "transit" as const,
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "Moving Tips",
      description: "Moving information for this location",
      icon: Package,
      linkKey: "movingTips" as const,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/directory')}
              aria-label="Back to directory"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Compare Duty Stations</h1>
          </div>
          <p className="text-muted-foreground">
            Select two duty stations to compare side by side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select 
              value={station1?.id || ""} 
              onValueChange={handleStation1Change}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select first duty station" />
              </SelectTrigger>
              <SelectContent>
                {sortedDutyStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select 
              value={station2?.id || ""} 
              onValueChange={handleStation2Change}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select second duty station" />
              </SelectTrigger>
              <SelectContent>
                {sortedDutyStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {station1 && station2 ? (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Comparison: {station1.name} vs. {station2.name}
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Location Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">{station1.name}</h3>
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {station1.city}, {station1.state}
                      </span>
                    </div>
                    <div className="text-sm mb-3">Region: {station1.region}</div>
                    <p className="text-sm">{station1.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">{station2.name}</h3>
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {station2.city}, {station2.state}
                      </span>
                    </div>
                    <div className="text-sm mb-3">Region: {station2.region}</div>
                    <p className="text-sm">{station2.description}</p>
                  </div>
                </div>
                
                {/* Resource Comparisons */}
                <div>
                  <h3 className="font-medium text-lg mb-4">External Resources</h3>
                  
                  <div className="grid gap-4">
                    {resourceCategories.map((category) => (
                      <div key={category.name} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                          href={station1.links[category.linkKey]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-md border hover:border-primary transition-colors group"
                        >
                          <div className={`${category.color} p-2 rounded-md`}>
                            <category.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                              {category.name}: {station1.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </a>
                        
                        <a
                          href={station2.links[category.linkKey]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-md border hover:border-primary transition-colors group"
                        >
                          <div className={`${category.color} p-2 rounded-md`}>
                            <category.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                              {category.name}: {station2.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <h2 className="text-xl font-semibold mb-2">Select Two Duty Stations to Compare</h2>
                <p className="text-muted-foreground mb-6">
                  Please select duty stations using the dropdown menus above.
                </p>
                {station1 && !station2 && (
                  <p className="text-sm">
                    <span className="font-medium">{station1.name}</span> selected. Please select a second station to compare.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
