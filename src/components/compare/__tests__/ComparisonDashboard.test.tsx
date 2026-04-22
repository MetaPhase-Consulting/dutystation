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
  it("renders metric rows with directional winners", () => {
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

    const crimeRow = screen.getByTestId("compare-row-crime.violent");
    expect(within(crimeRow).getByText("Laredo Station")).toBeInTheDocument();

    const homeRow = screen.getByTestId("compare-row-realEstate.medianHome");
    expect(within(homeRow).getByText("Laredo Station")).toBeInTheDocument();

    const unempRow = screen.getByTestId("compare-row-jobs.unemployment");
    expect(within(unempRow).getByText("Laredo Station")).toBeInTheDocument();
  });

  it("omits the winner chip for neutral metrics like temperature", () => {
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
    // Neither station name should appear in the "Better" column for a
    // neutral metric — just the em dash placeholder.
    const betterCells = within(tempRow).getAllByRole("cell");
    const betterCell = betterCells[betterCells.length - 1];
    expect(betterCell).toHaveTextContent("—");
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
