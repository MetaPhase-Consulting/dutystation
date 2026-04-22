import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { AreaSummaryDashboard } from "@/components/station/AreaSummaryDashboard";
import { makeStation, sampleSummaries } from "@/test/fixtures/station";

describe("AreaSummaryDashboard", () => {
  it("renders a card per summary category when summaries are populated", () => {
    const station = makeStation({ summaries: sampleSummaries });
    render(<AreaSummaryDashboard station={station} />);

    // Weather hero
    const weather = screen.getByTestId("summary-card-weather");
    expect(within(weather).getByText(/avg daily high/i)).toBeInTheDocument();
    expect(within(weather).getByText("85°F")).toBeInTheDocument();

    // Real estate — formatted currency
    const realEstate = screen.getByTestId("summary-card-realEstate");
    expect(within(realEstate).getByText("$215,000")).toBeInTheDocument();

    // Crime — violent per 100k
    const crime = screen.getByTestId("summary-card-crime");
    expect(within(crime).getByText("180")).toBeInTheDocument();

    // Jobs — unemployment percent
    const jobs = screen.getByTestId("summary-card-jobs");
    expect(within(jobs).getByText("4.5%")).toBeInTheDocument();
  });

  it("renders a graceful empty state when a station has no summaries", () => {
    const station = makeStation({ summaries: {} });
    render(<AreaSummaryDashboard station={station} />);

    // All 9 summary categories should still render a card with an empty state.
    expect(screen.getAllByText(/Detailed summary coming soon/i).length).toBeGreaterThan(5);
  });

  it("has no critical accessibility violations when populated", async () => {
    const station = makeStation({ summaries: sampleSummaries });
    const { container } = render(<AreaSummaryDashboard station={station} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
