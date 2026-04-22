
import { DutyStation } from "@/types/station";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { componentAccent } from "@/lib/componentColors";
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

  const handleNavigate = () => navigate(`/station/${station.id}`);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle
          className={`hover:underline cursor-pointer ${componentAccent[station.componentType].text}`}
          onClick={handleNavigate}
        >
          {station.name}
        </CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {station.city}, {station.state}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{station.description}</p>
        <div className="mt-2 text-xs font-medium">Region: {station.region}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">{station.componentType}</Badge>
          <Badge variant="outline">{station.facilityType}</Badge>
          {station.positionTypes.map((positionType) => (
            <Badge key={positionType} variant="secondary">
              {positionType}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleNavigate}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
