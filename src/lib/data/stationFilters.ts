import { ComponentType, DutyStation, FacilityType, PositionType, StationListFilters } from "@/types/station";

export function sanitizeSearchTerm(value: string): string {
  return value.replace(/[<>"'`]/g, "").trim();
}

export function uniqueSorted(values: string[], allLabel?: string): string[] {
  const unique = [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

  if (!allLabel) {
    return unique;
  }

  return [allLabel, ...unique];
}

export function stationMatchesQuery(station: DutyStation, query: string): boolean {
  if (!query) {
    return true;
  }

  const normalizedQuery = sanitizeSearchTerm(query).toLowerCase();

  return (
    station.name.toLowerCase().includes(normalizedQuery) ||
    station.city.toLowerCase().includes(normalizedQuery) ||
    station.state.toLowerCase().includes(normalizedQuery) ||
    station.sector.toLowerCase().includes(normalizedQuery)
  );
}

export function hasPositionType(station: DutyStation, selectedPositions: PositionType[]): boolean {
  if (!selectedPositions.length) {
    return true;
  }

  return selectedPositions.some((positionType) => station.positionTypes.includes(positionType));
}

export function hasComponentType(station: DutyStation, selectedComponents: ComponentType[]): boolean {
  if (!selectedComponents.length) {
    return true;
  }

  return selectedComponents.includes(station.componentType);
}

export function hasFacilityType(station: DutyStation, selectedFacilities: FacilityType[]): boolean {
  if (!selectedFacilities.length) {
    return true;
  }

  return selectedFacilities.includes(station.facilityType);
}

export function filterStations(stations: DutyStation[], filters: StationListFilters): DutyStation[] {
  const {
    query = "",
    sector,
    region,
    state,
    componentTypes = [],
    facilityTypes = [],
    positionTypes = [],
    sortOrder = "asc",
  } = filters;

  const filtered = stations.filter((station) => {
    if (!stationMatchesQuery(station, query)) {
      return false;
    }

    if (sector && sector !== "All Sectors" && station.sector !== sector) {
      return false;
    }

    if (region && region !== "All Regions" && station.region !== region) {
      return false;
    }

    if (state && state !== "All States" && station.state !== state) {
      return false;
    }

    if (!hasPositionType(station, positionTypes)) {
      return false;
    }

    if (!hasComponentType(station, componentTypes)) {
      return false;
    }

    if (!hasFacilityType(station, facilityTypes)) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    const compareResult = a.name.localeCompare(b.name);
    return sortOrder === "asc" ? compareResult : -compareResult;
  });
}
