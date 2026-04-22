import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  Car,
  CloudSun,
  DollarSign,
  GraduationCap,
  Home,
  MapPin,
  Package,
  Plane,
  Shield,
  Trees,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ComponentType,
  DutyStation,
  StationLinkCategory,
} from "@/types/station";
import { useStationsQuery, useTravelResourcesQuery } from "@/lib/data/queryHooks";
import { PageMeta } from "@/components/PageMeta";
import { componentAccent } from "@/lib/componentColors";
import { getSourceName } from "@/lib/sourceName";

const COMPONENT_OPTIONS: ComponentType[] = ["USBP", "OFO", "AMO"];

const linkCategories: {
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

interface ResourceCell {
  key: string;
  name: string;
  description: string;
  icon: typeof Home;
  url: string;
}

// Build the ordered list of resource cells for one station: the 7 station-link
// categories, then Recreation (first entry), then Travel (first entry).
function buildStationResources(
  station: DutyStation,
  travelUrl: string | undefined,
  travelDescription: string | undefined
): ResourceCell[] {
  const cells: ResourceCell[] = linkCategories.map((category) => ({
    key: `${station.id}-${category.key}`,
    name: category.name,
    description: category.description,
    icon: category.icon,
    url: station.links[category.key].url,
  }));

  const rec = station.recreation[0];
  if (rec?.url) {
    cells.push({
      key: `${station.id}-recreation`,
      name: "Recreation",
      description: rec.description || "Parks, trails, and outdoor activities nearby",
      icon: Trees,
      url: rec.url,
    });
  }

  if (travelUrl) {
    cells.push({
      key: `${station.id}-travel`,
      name: "Travel",
      description: travelDescription || "Flights, hotels, and rental cars",
      icon: Plane,
      url: travelUrl,
    });
  }

  return cells;
}

export default function ComparisonPage() {
  const [station1Id, setStation1Id] = useState<string | null>(null);
  const [station2Id, setStation2Id] = useState<string | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: stations = [], isLoading } = useStationsQuery();
  const { data: travelResources = [] } = useTravelResourcesQuery();

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

  const firstTravel = travelResources[0];
  const resources1 = station1
    ? buildStationResources(station1, firstTravel?.url, firstTravel?.description)
    : [];
  const resources2 = station2
    ? buildStationResources(station2, firstTravel?.url, firstTravel?.description)
    : [];
  // Both stations share the same ordered category list, so we can zip them.
  const rowCount = Math.max(resources1.length, resources2.length);

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
                {/* Summary row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
                  {[station1, station2].map((station) => (
                    <div key={`summary-${station.id}`}>
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
                  ))}
                </div>

                {/* External resources row-by-row */}
                <div>
                  <h3 className="text-base font-semibold mb-2 text-[#222222]">External Resources</h3>
                  <div className="grid gap-1.5">
                    {Array.from({ length: rowCount }).map((_, index) => {
                      const r1 = resources1[index];
                      const r2 = resources2[index];
                      return (
                        <div
                          key={`row-${index}`}
                          className="grid grid-cols-1 md:grid-cols-2 gap-1.5"
                        >
                          {[r1, r2].map((resource, col) => {
                            if (!resource) return <div key={`empty-${col}`} />;
                            const source = getSourceName(resource.url);
                            return (
                              <a
                                key={resource.key}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 p-2 rounded-md border hover:border-primary transition-colors group"
                              >
                                <div className="bg-muted p-1.5 rounded-md shrink-0">
                                  <resource.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-[#222222] group-hover:text-primary transition-colors leading-tight">
                                    {resource.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground leading-snug">
                                    {resource.description}
                                  </p>
                                  {source ? (
                                    <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                                      Source: {source}
                                    </p>
                                  ) : null}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      );
                    })}
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
