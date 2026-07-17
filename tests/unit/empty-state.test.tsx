import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("renders its message", () => {
    render(<EmptyState>No entries match these filters</EmptyState>);

    expect(
      screen.getByText("No entries match these filters"),
    ).toBeInTheDocument();
  });
});
