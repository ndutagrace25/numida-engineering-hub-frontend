import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WeeklyStandupCard } from "@/components/standups/weekly-standup-card";
import type { WeeklyStandupRow } from "@/types/standups";

const baseRow: WeeklyStandupRow = {
  name: "Aisha Nakato",
  initials: "AN",
  role: "Backend Engineer",
  did: ["Shipped the recalculation service"],
  working: ["Migrating the feature store"],
  plan: ["Write the RFC"],
  meetings: [],
  blockers: [],
};

describe("WeeklyStandupCard", () => {
  it("renders the engineer's name, role, and each populated section", () => {
    render(<WeeklyStandupCard row={baseRow} />);

    expect(screen.getByText("Aisha Nakato")).toBeInTheDocument();
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
    expect(
      screen.getByText("— Shipped the recalculation service"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("— Migrating the feature store"),
    ).toBeInTheDocument();
    expect(screen.getByText("— Write the RFC")).toBeInTheDocument();
  });

  it("omits empty sections (e.g. Meetings) instead of rendering an empty heading", () => {
    render(<WeeklyStandupCard row={baseRow} />);

    expect(screen.queryByText("Meetings")).not.toBeInTheDocument();
  });

  it("shows a Blockers section only when the row has blockers", () => {
    const { rerender } = render(<WeeklyStandupCard row={baseRow} />);
    expect(screen.queryByText("Blockers")).not.toBeInTheDocument();

    rerender(
      <WeeklyStandupCard
        row={{ ...baseRow, blockers: ["Waiting on infra"] }}
      />,
    );
    expect(screen.getByText("Blockers")).toBeInTheDocument();
    expect(screen.getByText("— Waiting on infra")).toBeInTheDocument();
  });

  it("omits the role line entirely when role is empty (the backend has no role field)", () => {
    render(<WeeklyStandupCard row={{ ...baseRow, role: "" }} />);

    expect(screen.getByText("Aisha Nakato")).toBeInTheDocument();
    expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument();
  });
});
