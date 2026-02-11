import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import HomePage from "@/pages/HomePage";
import { renderWithRouterAndQueryClient } from "@/test/test-utils";

describe("HomePage accessibility", () => {
  it("has no critical accessibility violations", async () => {
    const { container } = renderWithRouterAndQueryClient(<HomePage />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
