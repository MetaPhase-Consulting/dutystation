
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

interface DirectoryFiltersProps {
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  sectors: string[];
  states: string[];
}

export function DirectoryFilters({
  selectedSector,
  setSelectedSector,
  selectedState,
  setSelectedState,
  sortOrder,
  setSortOrder,
  sectors,
  states,
}: DirectoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={selectedSector} onValueChange={setSelectedSector}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select sector" />
        </SelectTrigger>
        <SelectContent>
          {sectors.map(sector => (
            <SelectItem key={sector} value={sector}>
              {sector}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedState} onValueChange={setSelectedState}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          {states.map(state => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        className="gap-2"
      >
        {sortOrder === "asc" ? (
          <>
            <ArrowDownAZ className="h-4 w-4" />
            A to Z
          </>
        ) : (
          <>
            <ArrowUpAZ className="h-4 w-4" />
            Z to A
          </>
        )}
      </Button>
    </div>
  );
}
