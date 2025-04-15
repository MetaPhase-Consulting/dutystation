import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DutyStation, findDutyStationById } from "@/data/dutyStations";
import { MapPin, Home, GraduationCap, Shield, DollarSign, CloudSun, Car, Package, ArrowLeft, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StationMap from "@/components/StationMap";

export default function StationDetailPage() {
  const [station, setStation] = useState<DutyStation | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundStation = findDutyStationById(id);
      if (foundStation) {
        setStation(foundStation);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
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
          <p className="text-muted-foreground my-4">
            We couldn't find the duty station you're looking for.
          </p>
          <Button onClick={() => navigate('/directory')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  const resourceLinks = [
    {
      name: "Real Estate",
      description: "Explore housing options and property listings",
      icon: Home,
      url: station.links.realEstate,
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Schools",
      description: "Find information about local schools",
      icon: GraduationCap,
      url: station.links.schools,
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Crime",
      description: "View crime statistics for the area",
      icon: Shield,
      url: station.links.crime,
      color: "bg-red-100 text-red-700",
    },
    {
      name: "Cost of Living",
      description: "Compare cost of living metrics",
      icon: DollarSign,
      url: station.links.costOfLiving,
      color: "bg-amber-100 text-amber-700",
    },
    {
      name: "Weather",
      description: "Check local climate and weather patterns",
      icon: CloudSun,
      url: station.links.weather,
      color: "bg-sky-100 text-sky-700",
    },
    {
      name: "Transit",
      description: "View transportation options and commute info",
      icon: Car,
      url: station.links.transit,
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "Moving Tips",
      description: "Get helpful moving information for this location",
      icon: Package,
      url: station.links.movingTips,
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
            <h1 className="text-3xl font-bold tracking-tight">{station.name}</h1>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {station.city}, {station.state} • {station.region} Region
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About This Location</h2>
                <p className="mb-6">{station.description}</p>
                
                <StationMap 
                  lat={station.lat} 
                  lng={station.lng} 
                  className="mb-4"
                />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate('/directory')}>
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

          <div className="w-full md:w-1/3">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">External Resources</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Click on any resource below to learn more about this location.
                </p>
                
                <div className="grid gap-3">
                  {resourceLinks.map((resource) => (
                    <a
                      key={resource.name}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-md border hover:border-primary transition-colors group"
                    >
                      <div className={`${resource.color} p-2 rounded-md`}>
                        <resource.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
