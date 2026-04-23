import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { ComparisonDashboard } from "@/components/compare/ComparisonDashboard";
import { makeStation, sampleSummaries } from "@/test/fixtures/station";
import type { StationSummaries } from "@/types/station";

function mutateSummaries(
  base: StationSummaries,
  mutate: (summaries: StationSummaries) => void
): StationSummaries {
  const clone = structuredClone(base);
  mutate(clone);
  return clone;
}

describe("ComparisonDashboard", () => {
  it("bolds the winning value on directional metrics", () => {
    const stationA = makeStation({
      id: "laredo-station",
      name: "Laredo Station",
      summaries: sampleSummaries,
    });

    // Station B: higher crime, more expensive housing, worse unemployment —
    // so station A should be marked better on those metrics.
    const stationB = makeStation({
      id: "houlton-station",
      name: "Houlton Station",
      city: "Houlton",
      state: "ME",
      componentType: "OFO",
      summaries: mutateSummaries(sampleSummaries, (s) => {
        s.crime!.summaryData.violentPer100k = 400;
        s.realEstate!.summaryData.medianHomePrice = 320000;
        s.jobs!.summaryData.unemploymentRate = 7.8;
      }),
    });

    render(<ComparisonDashboard stationA={stationA} stationB={stationB} />);

    // Station A wins (data-winner on the A cell) in each of these directional rows.
    for (const metricId of ["crime.violent", "realEstate.medianHome", "jobs.unemployment"]) {
      const row = screen.getByTestId(`compare-row-${metricId}`);
      const cells = within(row).getAllByRole("cell");
      // cells = [label, A, B]
      expect(cells[1].getAttribute("data-winner")).toBe("true");
      expect(cells[2].getAttribute("data-winner")).toBeNull();
    }
  });

  it("does not flag a winner on neutral metrics like temperature", () => {
    const stationA = makeStation({ id: "a", summaries: sampleSummaries });
    const stationB = makeStation({
      id: "b",
      name: "Other",
      summaries: mutateSummaries(sampleSummaries, (s) => {
        s.weather!.summaryData.summerHighF = 79;
      }),
    });

    render(<ComparisonDashboard stationA={stationA} stationB={stationB} />);

    const tempRow = screen.getByTestId("compare-row-weather.summerHigh");
    const cells = within(tempRow).getAllByRole("cell");
    // Label cell + 2 value cells, and neither value cell is flagged as winner.
    expect(cells).toHaveLength(3);
    expect(cells[1].getAttribute("data-winner")).toBeNull();
    expect(cells[2].getAttribute("data-winner")).toBeNull();
  });

  it("falls back to an empty-state message when neither station has data", () => {
    const stationA = makeStation({ id: "a" });
    const stationB = makeStation({ id: "b", name: "Other" });

    render(<ComparisonDashboard stationA={stationA} stationB={stationB} />);

    expect(
      screen.getByText(/Summary data is not yet populated/i)
    ).toBeInTheDocument();
  });

  it("has no critical accessibility violations when populated", async () => {
    const stationA = makeStation({ id: "a", summaries: sampleSummaries });
    const stationB = makeStation({
      id: "b",
      name: "Other",
      summaries: sampleSummaries,
    });
    const { container } = render(
      <ComparisonDashboard stationA={stationA} stationB={stationB} />
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
