
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpAZ, Building2, Plane, Shield } from "lucide-react";
import { ComponentType, FacilityType, PositionType } from "@/types/station";

interface DirectoryFiltersProps {
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  sectors: string[];
  regions: string[];
  states: string[];
  selectedPositions: PositionType[];
  setSelectedPositions: (positions: PositionType[]) => void;
  selectedComponents: ComponentType[];
  setSelectedComponents: (components: ComponentType[]) => void;
  selectedFacilityType: string;
  setSelectedFacilityType: (facility: string) => void;
  facilityTypes: string[];
  incentiveOnly: boolean;
  setIncentiveOnly: (value: boolean) => void;
}

const POSITION_OPTIONS: PositionType[] = ["CBPO", "BPA", "AMO"];
const COMPONENT_OPTIONS: ComponentType[] = ["USBP", "OFO", "AMO"];

export function DirectoryFilters({
  selectedSector,
  setSelectedSector,
  selectedRegion,
  setSelectedRegion,
  selectedState,
  setSelectedState,
  sortOrder,
  setSortOrder,
  sectors,
  regions,
  states,
  selectedPositions,
  setSelectedPositions,
  selectedComponents,
  setSelectedComponents,
  selectedFacilityType,
  setSelectedFacilityType,
  facilityTypes,
  incentiveOnly,
  setIncentiveOnly,
}: DirectoryFiltersProps) {
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
    <div className="space-y-4">
      <div className="rounded-md border p-3">
        <p className="mb-2 text-sm font-medium">Component</p>
        <div className="flex flex-wrap gap-2">
          {COMPONENT_OPTIONS.map((component) => {
            const Icon = iconByComponent[component];
            return (
              <Button
                key={component}
                size="sm"
                type="button"
                variant={selectedComponents.includes(component) ? "default" : "outline"}
                onClick={() => toggleComponent(component)}
                aria-pressed={selectedComponents.includes(component)}
                className="gap-1"
              >
                <Icon className="h-3.5 w-3.5" />
                {component}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
      <Select value={selectedSector} onValueChange={setSelectedSector}>
        <SelectTrigger className="w-[180px]" aria-label="Filter by sector">
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

      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
        <SelectTrigger className="w-[180px]" aria-label="Filter by region">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map(region => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedState} onValueChange={setSelectedState}>
        <SelectTrigger className="w-[180px]" aria-label="Filter by state">
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

        <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
          <SelectTrigger className="w-[180px]" aria-label="Filter by facility type">
            <SelectValue placeholder="Select facility type" />
          </SelectTrigger>
          <SelectContent>
            {facilityTypes.map((facility) => (
              <SelectItem key={facility} value={facility}>
                {facility}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      <Button
        variant="outline"
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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

        <div className="flex items-center gap-3 rounded-md border px-3 py-2">
          <span className="text-sm">Incentive Eligible Only</span>
        <Switch
          checked={incentiveOnly}
          onCheckedChange={setIncentiveOnly}
          aria-label="Toggle incentive eligible stations only"
        />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-md border px-2 py-1">
        {POSITION_OPTIONS.map((position) => (
          <Button
            key={position}
            size="sm"
            type="button"
            variant={selectedPositions.includes(position) ? "default" : "outline"}
            onClick={() => togglePosition(position)}
            aria-pressed={selectedPositions.includes(position)}
          >
            {position}
          </Button>
        ))}
      </div>
    </div>
  );
}
