
import { DutyStation } from "@/data/dutyStations";
import { Button } from "@/components/ui/button";
import { StationCard } from "./StationCard";
import { useNavigate } from "react-router-dom";

interface StationsListProps {
  stations: DutyStation[];
  setSelectedSector: (sector: string) => void;
  setSelectedState: (state: string) => void;
}

export function StationsList({ 
  stations, 
  setSelectedSector, 
  setSelectedState 
}: StationsListProps) {
  const navigate = useNavigate();

  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
        <p className="text-muted-foreground">No duty stations found matching your search.</p>
        <Button variant="link" onClick={() => {
          setSelectedSector("All Sectors");
          setSelectedState("All States");
          navigate("/directory");
        }}>
          Clear filters and show all
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stations.map((station) => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
