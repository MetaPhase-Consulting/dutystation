import { DutyStation, PositionType, StationListFilters } from "@/types/station";

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

export function filterStations(stations: DutyStation[], filters: StationListFilters): DutyStation[] {
  const {
    query = "",
    sector,
    region,
    state,
    positionTypes = [],
    incentiveOnly = false,
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

    if (incentiveOnly && !station.attributes.incentiveEligible) {
      return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    const compareResult = a.name.localeCompare(b.name);
    return sortOrder === "asc" ? compareResult : -compareResult;
  });
}
