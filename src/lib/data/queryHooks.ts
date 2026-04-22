import { useQuery } from "@tanstack/react-query";
import { stationRepository } from "@/lib/data/stationRepository";

export const stationQueryKeys = {
  all: ["stations"] as const,
  details: (id: string) => ["stations", "detail", id] as const,
  travel: ["travel-resources"] as const,
};

export function useStationsQuery() {
  return useQuery({
    queryKey: stationQueryKeys.all,
    queryFn: () => stationRepository.getStations(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStationByIdQuery(id: string | undefined) {
  return useQuery({
    queryKey: stationQueryKeys.details(id ?? ""),
    queryFn: () => stationRepository.getStationById(id ?? ""),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTravelResourcesQuery() {
  return useQuery({
    queryKey: stationQueryKeys.travel,
    queryFn: () => stationRepository.getTravelResources(),
    staleTime: 1000 * 60 * 60,
  });
}
