import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
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
import StationDetailMap from "@/components/StationDetailMap";
import { useStationByIdQuery, useTravelResourcesQuery } from "@/lib/data/queryHooks";
import { StationLinkCategory } from "@/types/station";
import { trackUsageEvent } from "@/lib/data/usageTracking";
import { getSourceName } from "@/lib/sourceName";

const linkIconByCategory: Record<StationLinkCategory, typeof Home> = {
  realEstate: Home,
  schools: GraduationCap,
  crime: Shield,
  costOfLiving: DollarSign,
  weather: CloudSun,
  transit: Car,
  movingTips: Package,
};

const linkLabelByCategory: Record<StationLinkCategory, string> = {
  realEstate: "Real Estate",
  schools: "Schools",
  crime: "Crime",
  costOfLiving: "Cost of Living",
  weather: "Weather",
  transit: "Transit",
  movingTips: "Moving Tips",
};

const linkDescriptionByCategory: Record<StationLinkCategory, string> = {
  realEstate: "Explore housing options and property listings",
  schools: "Find information about local schools",
  crime: "Review available crime and safety metrics",
  costOfLiving: "Compare local cost of living information",
  weather: "Check local climate and weather patterns",
  transit: "View transportation and commute resources",
  movingTips: "Review moving guidance and checklists",
};

export default function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: station, isLoading } = useStationByIdQuery(id);
  const { data: travelResources = [] } = useTravelResourcesQuery();
  const navigate = useNavigate();

  const resourceLinks = useMemo(() => {
    if (!station) {
      return [];
    }

    return (Object.keys(station.links) as StationLinkCategory[]).map((category) => ({
      category,
      name: linkLabelByCategory[category],
      description: linkDescriptionByCategory[category],
      icon: linkIconByCategory[category],
      link: station.links[category],
    }));
  }, [station]);

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
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/directory")} aria-label="Back to directory">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-[#0A4A0A]">{station.name}</h1>
            {station.attributes.incentiveEligible ? (
              <Badge className="bg-[#0A4A0A] text-white">{station.attributes.incentiveLabel ?? "Incentive Eligible"}</Badge>
            ) : null}
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
            {station.positionTypes.map((positionType) => (
              <Badge key={positionType} variant="secondary">
                {positionType}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#222222]">About This Location</h2>
                <p className="mb-6">{station.description}</p>

                <div className="mb-6 rounded-md overflow-hidden">
                  <StationDetailMap lat={station.lat} lng={station.lng} />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate("/directory")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Directory
                  </Button>
                  <Button
                    onClick={() => navigate(`/compare?station1=${station.id}`)}
                    className="flex items-center gap-2"
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
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#222222]">External Resources</h2>

                <div className="grid gap-3">
                  {resourceLinks.map((resource) => {
                    const source = getSourceName(resource.link.url);
                    return (
                      <a
                        key={resource.category}
                        href={resource.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-md border hover:border-primary transition-colors group"
                        onClick={() => {
                          trackUsageEvent({
                            eventName: "external_resource_click",
                            stationId: station.id,
                            eventMetadata: {
                              category: resource.category,
                              url: resource.link.url,
                            },
                          });
                        }}
                      >
                        <div className="bg-muted p-2 rounded-md">
                          <resource.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-[#222222] group-hover:text-primary transition-colors">
                            {resource.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                          {source ? (
                            <p className="text-[10px] text-muted-foreground/70 mt-1">Source: {source}</p>
                          ) : null}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {station.recreation.length ? (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#222222] flex items-center gap-2">
                    <Trees className="h-5 w-5 text-[#0A4A0A]" />
                    Recreation
                  </h2>
                  <div className="grid gap-3">
                    {station.recreation.map((resource) => {
                      const source = getSourceName(resource.url);
                      return (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-md border hover:border-primary transition-colors group"
                        >
                          <div className="bg-muted p-2 rounded-md">
                            <Trees className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-[#222222] group-hover:text-primary transition-colors">
                              {resource.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                            {source ? (
                              <p className="text-[10px] text-muted-foreground/70 mt-1">Source: {source}</p>
                            ) : null}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {travelResources.length ? (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#222222]">Travel</h2>
                  <div className="grid gap-3">
                    {travelResources.map((resource) => {
                      const source = getSourceName(resource.url);
                      return (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-md border hover:border-primary transition-colors group"
                        >
                          <div className="bg-muted p-2 rounded-md">
                            <Plane className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-[#222222] group-hover:text-primary transition-colors">
                              {resource.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                            {source ? (
                              <p className="text-[10px] text-muted-foreground/70 mt-1">Source: {source}</p>
                            ) : null}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>

        {station.attributes.disclaimerApplies ? (
          <p className="text-xs text-muted-foreground pt-4 border-t">
            CBP is not responsible for relocation costs. Information is provided for planning reference only.
          </p>
        ) : null}
      </div>
    </div>
  );
}
