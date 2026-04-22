import { MapPin } from "lucide-react";
import { SummaryCard } from "@/components/station/SummaryCard";
import { type DutyStation, SUMMARY_CATEGORIES } from "@/types/station";

interface AreaSummaryDashboardProps {
  station: DutyStation;
}

function describeStationArea(station: DutyStation): string {
  const parts: string[] = [];
  if (station.placeName) parts.push(station.placeName);
  else if (station.city) parts.push(station.city);
  if (station.state) parts.push(station.state);
  const line = parts.join(", ");
  if (station.zipCode) {
    return line ? `${line} (${station.zipCode})` : station.zipCode;
  }
  return line;
}

export function AreaSummaryDashboard({ station }: AreaSummaryDashboardProps) {
  const areaLabel = describeStationArea(station);

  return (
    <section aria-labelledby="area-summary-heading" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="area-summary-heading"
            className="text-xl font-semibold text-[#222222]"
          >
            Area snapshot
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              Data shown for {areaLabel || "the surrounding area"}. Exact scope
              (ZIP, city, county) varies by source — see each card.
            </span>
          </p>
        </div>
      </div>

      <div
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      >
        {SUMMARY_CATEGORIES.map((key) => (
          <div role="listitem" key={key} className="h-full">
            <SummaryCard
              category={key}
              summaries={station.summaries}
              fallbackUrl={station.links[key]?.url ?? ""}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
