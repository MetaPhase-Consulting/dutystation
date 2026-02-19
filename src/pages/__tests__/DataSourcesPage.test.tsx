import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import DataSourcesPage from "@/pages/DataSourcesPage";
import { LEGAL_DISCLAIMER_TITLE } from "@/content/legal";
import { renderWithRouterAndQueryClient } from "@/test/test-utils";

describe("DataSourcesPage", () => {
  it("renders centralized legal disclaimer content", () => {
    renderWithRouterAndQueryClient(<DataSourcesPage />);

    expect(screen.getByRole("heading", { name: LEGAL_DISCLAIMER_TITLE })).toBeInTheDocument();
    expect(
      screen.getByText(/CBP is not responsible for relocation costs, travel expenses, housing expenses/i)
    ).toBeInTheDocument();
  });
});
