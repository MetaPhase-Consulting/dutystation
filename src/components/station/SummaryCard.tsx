import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { getSourceName } from "@/lib/sourceName";
import {
  costOfLivingDetails,
  costOfLivingHero,
  crimeDetails,
  crimeHero,
  demographicsDetails,
  demographicsHero,
  formatAreaScope,
  healthcareDetails,
  healthcareHero,
  jobsDetails,
  jobsHero,
  realEstateDetails,
  realEstateHero,
  schoolsDetails,
  schoolsHero,
  transitDetails,
  transitHero,
  weatherDetails,
  weatherHero,
  type DetailStat,
  type HeroStat,
} from "@/lib/summaryFormat";
import type {
  CategorySummary,
  CategorySummaryDataMap,
  StationSummaries,
  SummaryCategory,
} from "@/types/station";

interface SummaryCardProps {
  category: SummaryCategory;
  summaries: StationSummaries;
  fallbackUrl: string;
}

interface RenderedSummary {
  hero: HeroStat;
  details: DetailStat[];
}

// Generic dispatch: TypeScript can't correlate the `CategorySummary<T>` generic
// with the variable `category`, so we cast per-case once the discriminant is
// narrowed. The shape in the cast matches `CategorySummaryDataMap[category]`
// and is validated at the storage layer.
function renderForCategory(summary: CategorySummary): RenderedSummary {
  const data = summary.summaryData as CategorySummaryDataMap[SummaryCategory];
  switch (summary.category) {
    case "weather":
      return {
        hero: weatherHero(data as CategorySummaryDataMap["weather"]),
        details: weatherDetails(data as CategorySummaryDataMap["weather"]),
      };
    case "schools":
      return {
        hero: schoolsHero(data as CategorySummaryDataMap["schools"]),
        details: schoolsDetails(data as CategorySummaryDataMap["schools"]),
      };
    case "crime":
      return {
        hero: crimeHero(data as CategorySummaryDataMap["crime"]),
        details: crimeDetails(data as CategorySummaryDataMap["crime"]),
      };
    case "costOfLiving":
      return {
        hero: costOfLivingHero(data as CategorySummaryDataMap["costOfLiving"]),
        details: costOfLivingDetails(data as CategorySummaryDataMap["costOfLiving"]),
      };
    case "realEstate":
      return {
        hero: realEstateHero(data as CategorySummaryDataMap["realEstate"]),
        details: realEstateDetails(data as CategorySummaryDataMap["realEstate"]),
      };
    case "transit":
      return {
        hero: transitHero(data as CategorySummaryDataMap["transit"]),
        details: transitDetails(data as CategorySummaryDataMap["transit"]),
      };
    case "demographics":
      return {
        hero: demographicsHero(data as CategorySummaryDataMap["demographics"]),
        details: demographicsDetails(data as CategorySummaryDataMap["demographics"]),
      };
    case "healthcare":
      return {
        hero: healthcareHero(data as CategorySummaryDataMap["healthcare"]),
        details: healthcareDetails(data as CategorySummaryDataMap["healthcare"]),
      };
    case "jobs":
      return {
        hero: jobsHero(data as CategorySummaryDataMap["jobs"]),
        details: jobsDetails(data as CategorySummaryDataMap["jobs"]),
      };
  }
}

export function SummaryCard({ category, summaries, fallbackUrl }: SummaryCardProps) {
  const meta = CATEGORY_META[category];
  const summary = summaries[category];
  const Icon = meta.icon;
  const hasSummary = Boolean(summary);
  const rendered = summary ? renderForCategory(summary) : null;

  return (
    <Card
      className="h-full"
      data-testid={`summary-card-${category}`}
      aria-labelledby={`summary-card-${category}-title`}
    >
      <CardContent className="p-4 flex flex-col h-full gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-muted p-1.5 rounded-md">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h3
                id={`summary-card-${category}-title`}
                className="text-sm font-semibold text-[#222222] leading-tight"
              >
                {meta.label}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {meta.description}
              </p>
            </div>
          </div>
          {summary ? (
            <Badge
              variant="outline"
              className="text-[10px] font-normal"
              title={formatAreaScope(summary.areaScope, summary.areaValue)}
            >
              {summary.areaScope}
            </Badge>
          ) : null}
        </div>

        {hasSummary && rendered ? (
          <>
            <div className="pt-1">
              <div className="text-2xl font-semibold text-[#0A4A0A] tabular-nums leading-none">
                {rendered.hero.value}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {rendered.hero.label}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mt-auto">
              {rendered.details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex justify-between items-baseline border-b border-dotted border-muted-foreground/20 py-0.5"
                >
                  <dt className="text-muted-foreground truncate pr-2">{detail.label}</dt>
                  <dd className="font-medium text-[#222222] tabular-nums whitespace-nowrap">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-start py-4">
            <p className="text-xs text-muted-foreground mb-2">
              Detailed summary coming soon.
            </p>
            {fallbackUrl ? (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs inline-flex items-center gap-1 underline underline-offset-2 hover:text-primary"
              >
                View external source
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        )}

        {summary ? (
          <p className="text-[10px] text-muted-foreground/80 border-t pt-2">
            Source:{" "}
            {summary.sourceUrl ? (
              <a
                href={summary.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {getSourceName(summary.sourceUrl) ?? summary.dataSource}
              </a>
            ) : (
              summary.dataSource
            )}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
