import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComponentType } from "@/types/station";
import { useStationsQuery } from "@/lib/data/queryHooks";
import { PageMeta } from "@/components/PageMeta";
import { componentAccent } from "@/lib/componentColors";
import { ComparisonDashboard } from "@/components/compare/ComparisonDashboard";
import StationDetailMap from "@/components/StationDetailMap";

const COMPONENT_OPTIONS: ComponentType[] = ["USBP", "OFO", "AMO"];

export default function ComparisonPage() {
  const [station1Id, setStation1Id] = useState<string | null>(null);
  const [station2Id, setStation2Id] = useState<string | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: stations = [], isLoading } = useStationsQuery();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const first = params.get("station1");
    const second = params.get("station2");
    if (first) setStation1Id(first);
    if (second) setStation2Id(second);
  }, [location.search]);

  const filteredStations = useMemo(() => {
    return [...stations]
      .filter(
        (station) =>
          selectedComponents.length === 0 ||
          selectedComponents.includes(station.componentType)
      )
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [selectedComponents, stations]);

  const station1 = useMemo(
    () => stations.find((station) => station.id === station1Id) ?? null,
    [stations, station1Id]
  );
  const station2 = useMemo(
    () => stations.find((station) => station.id === station2Id) ?? null,
    [stations, station2Id]
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

  const toggleComponent = (component: ComponentType) => {
    if (selectedComponents.includes(component)) {
      setSelectedComponents(selectedComponents.filter((value) => value !== component));
      return;
    }
    setSelectedComponents([...selectedComponents, component]);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <PageMeta
        title="Compare Duty Stations"
        description="Side-by-side comparison of two U.S. CBP duty stations: location, component, sector, and external resources for housing, schools, crime, cost of living, weather, and transit."
        path="/compare"
      />
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A4A0A]">Compare Duty Stations</h1>
          <p className="text-muted-foreground">Select two duty stations to compare side by side.</p>
        </div>

        {/* Single settings row: component toggle + two station dropdowns */}
        <div className="flex flex-wrap items-center gap-3 rounded-md border bg-muted/30 p-3">
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Filter by component"
          >
            {COMPONENT_OPTIONS.map((component) => {
              const active = selectedComponents.includes(component);
              const accent = componentAccent[component];
              return (
                <Button
                  key={component}
                  size="sm"
                  type="button"
                  variant={active ? "default" : "outline"}
                  onClick={() => toggleComponent(component)}
                  aria-pressed={active}
                  className={`h-8 px-3 text-xs font-semibold ${
                    active
                      ? accent.buttonClass
                      : `${accent.text} ${accent.inactiveHoverClass}`
                  }`}
                >
                  {component}
                </Button>
              );
            })}
          </div>

          <Select
            value={station1Id ?? ""}
            onValueChange={(value) => handleStationChange("station1", value)}
          >
            <SelectTrigger className="w-[240px]" aria-label="First duty station to compare">
              <SelectValue placeholder="First station" />
            </SelectTrigger>
            <SelectContent>
              {filteredStations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={station2Id ?? ""}
            onValueChange={(value) => handleStationChange("station2", value)}
          >
            <SelectTrigger className="w-[240px]" aria-label="Second duty station to compare">
              <SelectValue placeholder="Second station" />
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

        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Loading comparison data...
            </CardContent>
          </Card>
        ) : station1 && station2 ? (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Comparison: {station1.name} vs. {station2.name}
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Summary row: station name + metadata on top, mini map below each */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
                  {[station1, station2].map((station) => (
                    <div key={`summary-${station.id}`} className="space-y-3">
                      <div>
                        <h3
                          className={`font-medium text-lg mb-2 ${componentAccent[station.componentType].text}`}
                        >
                          {station.name}
                        </h3>
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
                        </div>
                        <p className="text-sm">{station.description}</p>
                      </div>
                      <StationDetailMap
                        lat={station.preciseLat ?? station.lat}
                        lng={station.preciseLng ?? station.lng}
                        componentType={station.componentType}
                        height={220}
                        showLayerToggle={false}
                      />
                    </div>
                  ))}
                </div>

                {/* Head-to-head summary dashboard */}
                <ComparisonDashboard stationA={station1} stationB={station2} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="py-8">
                <h2 className="text-xl font-semibold mb-2">Select Two Duty Stations to Compare</h2>
                <p className="text-muted-foreground">
                  Pick stations using the dropdowns above. Filter by component to narrow the list.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
