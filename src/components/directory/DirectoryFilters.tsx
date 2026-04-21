import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentType } from "@/types/station";

interface DirectoryFiltersProps {
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  sectorOptions: Array<{ value: string; label: string }>;
  regions: string[];
  states: string[];
  selectedComponents: ComponentType[];
  setSelectedComponents: (components: ComponentType[]) => void;
  selectedFacilityType: string;
  setSelectedFacilityType: (facility: string) => void;
  facilityTypes: string[];
}

const COMPONENT_OPTIONS: ComponentType[] = ["USBP", "OFO", "AMO"];

export function DirectoryFilters({
  selectedSector,
  setSelectedSector,
  selectedRegion,
  setSelectedRegion,
  selectedState,
  setSelectedState,
  sectorOptions,
  regions,
  states,
  selectedComponents,
  setSelectedComponents,
  selectedFacilityType,
  setSelectedFacilityType,
  facilityTypes,
}: DirectoryFiltersProps) {
  const toggleComponent = (component: ComponentType) => {
    if (selectedComponents.includes(component)) {
      setSelectedComponents(selectedComponents.filter((value) => value !== component));
      return;
    }
    setSelectedComponents([...selectedComponents, component]);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border bg-muted/30 p-3">
      <div
        className="flex flex-wrap items-center gap-1.5"
        role="group"
        aria-label="Filter by component"
      >
        {COMPONENT_OPTIONS.map((component) => {
          const active = selectedComponents.includes(component);
          return (
            <Button
              key={component}
              size="sm"
              type="button"
              variant={active ? "default" : "outline"}
              onClick={() => toggleComponent(component)}
              aria-pressed={active}
              className="h-8 px-3 text-xs font-semibold"
            >
              {component}
            </Button>
          );
        })}
      </div>

      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
        <SelectTrigger className="w-[160px]" aria-label="Filter by region">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedSector} onValueChange={setSelectedSector}>
        <SelectTrigger className="w-[210px]" aria-label="Filter by sector">
          <SelectValue placeholder="Select sector" />
        </SelectTrigger>
        <SelectContent>
          {sectorOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedState} onValueChange={setSelectedState}>
        <SelectTrigger className="w-[140px]" aria-label="Filter by state">
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          {states.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
        <SelectTrigger className="w-[170px]" aria-label="Filter by facility type">
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
    </div>
  );
}
