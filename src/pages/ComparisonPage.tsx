import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  Building2,
  Car,
  CloudSun,
  DollarSign,
  GraduationCap,
  Home,
  MapPin,
  Package,
  Plane,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComponentType, PositionType, StationLinkCategory } from "@/types/station";
import { useStationsQuery } from "@/lib/data/queryHooks";
import { hasPositionType } from "@/lib/data/stationFilters";

const POSITION_OPTIONS: PositionType[] = ["CBPO", "BPA", "AMO"];
const COMPONENT_OPTIONS: ComponentType[] = ["USBP", "OFO", "AMO"];

const resourceCategories: {
  key: StationLinkCategory;
  name: string;
  description: string;
  icon: typeof Home;
}[] = [
  { key: "realEstate", name: "Real Estate", description: "Housing options and property listings", icon: Home },
  { key: "schools", name: "Schools", description: "Information about local schools", icon: GraduationCap },
  { key: "crime", name: "Crime", description: "Crime statistics for the area", icon: Shield },
  { key: "costOfLiving", name: "Cost of Living", description: "Cost of living metrics", icon: DollarSign },
  { key: "weather", name: "Weather", description: "Local climate and weather patterns", icon: CloudSun },
  { key: "transit", name: "Transit", description: "Transportation options and commute info", icon: Car },
  { key: "movingTips", name: "Moving Tips", description: "Moving information for this location", icon: Package },
];

export default function ComparisonPage() {
  const [station1Id, setStation1Id] = useState<string | null>(null);
  const [station2Id, setStation2Id] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<PositionType[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: stations = [], isLoading } = useStationsQuery();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const firstStation = params.get("station1");
    const secondStation = params.get("station2");

    if (firstStation) {
      setStation1Id(firstStation);
    }

    if (secondStation) {
      setStation2Id(secondStation);
    }
  }, [location.search]);

  const filteredStations = useMemo(() => {
    return [...stations]
      .filter((station) => hasPositionType(station, selectedPositions))
      .filter((station) => !selectedComponents.length || selectedComponents.includes(station.componentType))
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [selectedComponents, selectedPositions, stations]);

  const station1 = useMemo(
    () => filteredStations.find((station) => station.id === station1Id) ?? null,
    [filteredStations, station1Id]
  );
  const station2 = useMemo(
    () => filteredStations.find((station) => station.id === station2Id) ?? null,
    [filteredStations, station2Id]
  );

  const handleStationChange = (stationParam: "station1" | "station2", stationId: string) => {
    const params = new URLSearchParams(location.search);
    params.set(stationParam, stationId);
    navigate(`/compare?${params.toString()}`);

    if (stationParam === "station1") {
      setStation1Id(stationId);
      return;
    }

    setStation2Id(stationId);
  };

  const togglePosition = (position: PositionType) => {
    if (selectedPositions.includes(position)) {
      setSelectedPositions(selectedPositions.filter((value) => value !== position));
      return;
    }

    setSelectedPositions([...selectedPositions, position]);
  };

  const toggleComponent = (component: ComponentType) => {
    if (selectedComponents.includes(component)) {
      setSelectedComponents(selectedComponents.filter((value) => value !== component));
      return;
    }

    setSelectedComponents([...selectedComponents, component]);
  };

  const iconByComponent = {
    USBP: Shield,
    OFO: Building2,
    AMO: Plane,
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A4A0A]">Compare Duty Stations</h1>
          <p className="text-muted-foreground">Select two duty stations to compare side by side.</p>
        </div>

        <div className="rounded-md border p-3">
          <p className="text-sm font-medium mb-2">Component Filter</p>
          <div className="flex flex-wrap gap-2">
            {COMPONENT_OPTIONS.map((component) => {
              const Icon = iconByComponent[component];
              return (
                <Button
                  key={component}
                  size="sm"
                  variant={selectedComponents.includes(component) ? "default" : "outline"}
                  onClick={() => toggleComponent(component)}
                  aria-pressed={selectedComponents.includes(component)}
                >
                  <Icon className="mr-1 h-3.5 w-3.5" />
                  {component}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border p-3">
          <p className="text-sm font-medium mb-2">Position Type Filter</p>
          <div className="flex flex-wrap gap-2">
            {POSITION_OPTIONS.map((position) => (
              <Button
                key={position}
                size="sm"
                variant={selectedPositions.includes(position) ? "default" : "outline"}
                onClick={() => togglePosition(position)}
                aria-pressed={selectedPositions.includes(position)}
              >
                {position}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select value={station1Id ?? ""} onValueChange={(value) => handleStationChange("station1", value)}>
              <SelectTrigger className="w-full" aria-label="First duty station to compare">
                <SelectValue placeholder="Select first duty station" />
              </SelectTrigger>
              <SelectContent>
                {filteredStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={station2Id ?? ""} onValueChange={(value) => handleStationChange("station2", value)}>
              <SelectTrigger className="w-full" aria-label="Second duty station to compare">
                <SelectValue placeholder="Select second duty station" />
              </SelectTrigger>
              <SelectContent>
                {filteredStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">Loading comparison data...</CardContent>
          </Card>
        ) : station1 && station2 ? (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Comparison: {station1.name} vs. {station2.name}
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
                  {[station1, station2].map((station) => (
                    <div key={`summary-${station.id}`}>
                      <h3 className="font-medium text-lg mb-2">{station.name}</h3>
                      <div className="flex items-center mb-1">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">
                          {station.city}, {station.state}
                        </span>
                      </div>
                      <div className="text-sm mb-2">Region: {station.region}</div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="outline">{station.componentType}</Badge>
                        <Badge variant="outline">{station.facilityType}</Badge>
                        {station.positionTypes.map((positionType) => (
                          <Badge key={`${station.id}-${positionType}`} variant="secondary">
                            {positionType}
                          </Badge>
                        ))}
                        {station.attributes.incentiveEligible ? (
                          <Badge className="bg-[#0A4A0A] text-white">Incentive</Badge>
                        ) : null}
                      </div>
                      <p className="text-sm">{station.description}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-4">External Resources</h3>

                  <div className="grid gap-4">
                    {resourceCategories.map((category) => (
                      <div key={category.key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[station1, station2].map((station) => {
                          const link = station.links[category.key];

                          return (
                            <a
                              key={`${station.id}-${category.key}`}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 p-3 rounded-md border hover:border-primary transition-colors group"
                            >
                              <div className="bg-muted p-2 rounded-md">
                                <category.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                                  {category.name}: {station.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">{category.description}</p>
                              </div>
                            </a>
                          );
                        })}
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
                <p className="text-muted-foreground mb-6">Please select duty stations using the dropdown menus above.</p>
                {selectedPositions.length ? (
                  <p className="text-sm text-muted-foreground">
                    Position filter active: {selectedPositions.join(", ")}.
                  </p>
                ) : null}
                {selectedComponents.length ? (
                  <p className="text-sm text-muted-foreground">
                    Component filter active: {selectedComponents.join(", ")}.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
