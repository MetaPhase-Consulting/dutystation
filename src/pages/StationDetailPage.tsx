import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
  MapPin,
  Plane,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StationDetailMap from "@/components/StationDetailMap";
import { AreaSummaryDashboard } from "@/components/station/AreaSummaryDashboard";
import { useStationByIdQuery, useTravelResourcesQuery } from "@/lib/data/queryHooks";
import { StationLinkCategory } from "@/types/station";
import { trackUsageEvent } from "@/lib/data/usageTracking";
import { getSourceName } from "@/lib/sourceName";
import { componentAccent } from "@/lib/componentColors";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { PageMeta } from "@/components/PageMeta";

export default function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: station, isLoading } = useStationByIdQuery(id);
  const { data: travelResources = [] } = useTravelResourcesQuery();
  const navigate = useNavigate();

  const resourceLinks = useMemo(() => {
    if (!station) {
      return [];
    }

    type ResourceRow = {
      key: string;
      trackingCategory: string;
      name: string;
      description: string;
      icon: LucideIcon;
      url: string;
    };

    // Sidebar link list: only include categories that actually have a URL.
    // The new dashboard surfaces the summary numbers; the sidebar is the
    // quick-jump to the upstream source.
    const rows: ResourceRow[] = (Object.keys(station.links) as StationLinkCategory[])
      .filter((category) => Boolean(station.links[category]?.url))
      .map((category) => {
        const meta = CATEGORY_META[category];
        return {
          key: `link-${category}`,
          trackingCategory: category,
          name: meta.label,
          description: meta.description,
          icon: meta.icon,
          url: station.links[category].url,
        };
      });

    // Fold recreation + travel into the same list so every external
    // resource renders with identical chrome and a "Source: X" footer.
    // Recreation can have multiple entries per station — take the first
    // as the representative link. Travel is a single global resource.
    const firstRecreation = station.recreation[0];
    if (firstRecreation?.url) {
      rows.push({
        key: `recreation-${firstRecreation.id}`,
        trackingCategory: "recreation",
        name: "Recreation",
        description: firstRecreation.description || "Parks, trails, and outdoor activities nearby",
        icon: Trees,
        url: firstRecreation.url,
      });
    }

    const firstTravel = travelResources[0];
    if (firstTravel?.url) {
      rows.push({
        key: `travel-${firstTravel.id}`,
        trackingCategory: "travel",
        name: "Travel",
        description: firstTravel.description || "Flights, hotels, and rental cars",
        icon: Plane,
        url: firstTravel.url,
      });
    }

    return rows;
  }, [station, travelResources]);

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p>Loading duty station information...</p>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold">Duty Station Not Found</h1>
          <p className="text-muted-foreground my-4">We couldn't find the duty station you're looking for.</p>
          <Button onClick={() => navigate("/directory")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <PageMeta
        title={`${station.name} (${station.city}, ${station.state})`}
        description={`${station.name} is a ${station.componentType} ${station.facilityType.toLowerCase()} in ${station.city}, ${station.state}. Explore housing, schools, cost of living, and other local resources.`}
        path={`/station/${station.id}`}
      />
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/directory")} aria-label="Back to directory">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1
              className={`text-3xl font-bold tracking-tight ${componentAccent[station.componentType].text}`}
            >
              {station.name}
            </h1>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {station.city}, {station.state} • {station.region} Region
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{station.componentType}</Badge>
            <Badge variant="outline">{station.facilityType}</Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#222222]">About This Location</h2>
                <p className="mb-6">{station.description}</p>

                <div className="mb-6 rounded-md overflow-hidden">
                  <StationDetailMap
                    lat={station.lat}
                    lng={station.lng}
                    componentType={station.componentType}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate("/directory")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Directory
                  </Button>
                  <Button
                    onClick={() => navigate(`/compare?station1=${station.id}`)}
                    className={`flex items-center gap-2 ${componentAccent[station.componentType].buttonClass}`}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    Compare This Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-base font-semibold mb-2 text-[#222222]">External Resources</h2>

                <div className="grid gap-1.5">
                  {resourceLinks.map((resource) => {
                    const source = getSourceName(resource.url);
                    return (
                      <a
                        key={resource.key}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-md border hover:border-primary transition-colors group"
                        onClick={() => {
                          trackUsageEvent({
                            eventName: "external_resource_click",
                            stationId: station.id,
                            eventMetadata: {
                              category: resource.trackingCategory,
                              url: resource.url,
                            },
                          });
                        }}
                      >
                        <div className="bg-muted p-1.5 rounded-md shrink-0">
                          <resource.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#222222] group-hover:text-primary transition-colors leading-tight">
                            {resource.name}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-snug">{resource.description}</p>
                          {source ? (
                            <p className="text-[10px] text-muted-foreground/80 mt-0.5">Source: {source}</p>
                          ) : null}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <AreaSummaryDashboard station={station} />

        <p className="text-xs text-muted-foreground pt-4 border-t">
          This website is an informational, non-official resource and is not an
          official U.S. government system. Information is provided for
          planning reference only.{" "}
          <Link
            to="/disclaimer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Full disclaimer
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
