import { useMemo } from "react";
import { Check } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { componentAccent } from "@/lib/componentColors";
import { COMPARE_METRICS, computeWinner, type CompareMetric } from "@/lib/compareMetrics";
import type { DutyStation } from "@/types/station";

interface ComparisonDashboardProps {
  stationA: DutyStation;
  stationB: DutyStation;
}

type Side = "a" | "b";

function isWinnerCell(
  metric: CompareMetric,
  side: Side,
  winner: ReturnType<typeof computeWinner>
): boolean {
  if (!winner || winner === "tie" || metric.direction === "neutral") {
    return false;
  }
  return winner === side;
}

export function ComparisonDashboard({ stationA, stationB }: ComparisonDashboardProps) {
  const rows = useMemo(() => {
    return COMPARE_METRICS.map((metric) => {
      const valueA = metric.extract(stationA.summaries);
      const valueB = metric.extract(stationB.summaries);
      const winner = computeWinner(metric, valueA, valueB);
      return {
        metric,
        valueA,
        valueB,
        displayA: metric.format(valueA),
        displayB: metric.format(valueB),
        winner,
      };
    });
  }, [stationA, stationB]);

  const hasAnyData = rows.some(
    (row) => row.valueA != null || row.valueB != null
  );

  const chartData = useMemo(() => {
    return rows
      .filter(
        (row) => row.metric.headline && row.valueA != null && row.valueB != null
      )
      .map((row) => ({
        label: row.metric.label,
        [stationA.id]: row.valueA,
        [stationB.id]: row.valueB,
        formattedA: row.displayA,
        formattedB: row.displayB,
      }));
  }, [rows, stationA.id, stationB.id]);

  const colorA = componentAccent[stationA.componentType].hex;
  const colorB = componentAccent[stationB.componentType].hex;

  if (!hasAnyData) {
    return (
      <Card data-testid="comparison-dashboard">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Summary data is not yet populated for one or both of these stations.
          The comparison table will fill in as data becomes available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="comparison-dashboard">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-[#222222] mb-3">
            Head-to-head metrics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">
                Comparison of area metrics for {stationA.name} and {stationB.name}.
                Bolded values with a check mark indicate the station that scores better in
                the direction that typically benefits a relocating household. Neutral
                metrics such as temperature or population are shown without emphasis.
              </caption>
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3 font-medium text-muted-foreground">Metric</th>
                  <th
                    className={`py-2 px-3 font-medium ${componentAccent[stationA.componentType].text}`}
                    scope="col"
                  >
                    {stationA.name}
                  </th>
                  <th
                    className={`py-2 px-3 font-medium ${componentAccent[stationB.componentType].text}`}
                    scope="col"
                  >
                    {stationB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const aWins = isWinnerCell(row.metric, "a", row.winner);
                  const bWins = isWinnerCell(row.metric, "b", row.winner);
                  return (
                    <tr
                      key={row.metric.id}
                      className="border-b last:border-0"
                      data-testid={`compare-row-${row.metric.id}`}
                    >
                      <td className="py-2 pr-3 text-muted-foreground">
                        {row.metric.label}
                      </td>
                      <td
                        className="py-2 px-3 tabular-nums"
                        data-winner={aWins ? "true" : undefined}
                      >
                        {aWins ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#0A4A0A]">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            <span aria-label={`${row.displayA} — better for a relocating household`}>
                              {row.displayA}
                            </span>
                          </span>
                        ) : (
                          <span className="text-[#222222]">{row.displayA}</span>
                        )}
                      </td>
                      <td
                        className="py-2 px-3 tabular-nums"
                        data-winner={bWins ? "true" : undefined}
                      >
                        {bWins ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#0A4A0A]">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            <span aria-label={`${row.displayB} — better for a relocating household`}>
                              {row.displayB}
                            </span>
                          </span>
                        ) : (
                          <span className="text-[#222222]">{row.displayB}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Bolded values with a check mark reflect the direction that typically benefits a
            relocating household (lower rent, higher school rating, etc.). Neutral metrics
            like temperature or population are shown without emphasis.
          </p>
        </div>

        {chartData.length > 0 ? (
          <div>
            <h3 className="text-base font-semibold text-[#222222] mb-3">
              Headline metrics
            </h3>
            <div className="h-64" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey={stationA.id} name={stationA.name} fill={colorA}>
                    {chartData.map((entry) => (
                      <Cell key={`a-${entry.label}`} fill={colorA} />
                    ))}
                  </Bar>
                  <Bar dataKey={stationB.id} name={stationB.name} fill={colorB}>
                    {chartData.map((entry) => (
                      <Cell key={`b-${entry.label}`} fill={colorB} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="sr-only">
              Bar chart comparing headline metrics between {stationA.name} and {stationB.name}.
              The same values are listed accessibly in the table above.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
