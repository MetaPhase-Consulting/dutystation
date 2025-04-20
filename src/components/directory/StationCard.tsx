
import { DutyStation } from "@/data/dutyStations";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StationCardProps {
  station: DutyStation;
}

export function StationCard({ station }: StationCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#0A4A0A]">{station.name}</CardTitle>
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
  );
}
