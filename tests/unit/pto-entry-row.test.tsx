import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PTOEntryRow } from "@/components/pto/pto-entry-row";
import type { PTOEntry } from "@/types/pto";

const baseEntry: PTOEntry = {
  id: 1,
  user: {
    id: 10,
    firstName: "Diana",
    lastName: "Kariuki",
    displayName: "Diana Kariuki",
    initials: "DK",
  },
  startDate: "2026-07-27",
  endDate: "2026-07-31",
  reason: "Annual leave",
  handoverUrl: null,
  createdBy: null,
};

describe("PTOEntryRow", () => {
  it("shows the taker's name, date range, and inclusive day count", () => {
    render(<PTOEntryRow entry={baseEntry} />);

    expect(screen.getByText("Diana Kariuki")).toBeInTheDocument();
    expect(screen.getByText("Jul 27 – Jul 31 · 5 days")).toBeInTheDocument();
  });

  it("falls back to 'Unknown' when the user was deleted (SET_NULL)", () => {
    render(<PTOEntryRow entry={{ ...baseEntry, user: null }} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("does not render a handover link when handoverUrl is absent", () => {
    render(<PTOEntryRow entry={baseEntry} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a handover link pointing at handoverUrl when present", () => {
    render(
      <PTOEntryRow
        entry={{ ...baseEntry, handoverUrl: "https://example.com/notes" }}
      />,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/notes");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
