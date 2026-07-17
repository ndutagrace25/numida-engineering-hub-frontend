import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MyStandupCard } from "@/components/dashboard/my-standup-card";
import type { DashboardStandup } from "@/types/dashboard";

const aisha: DashboardStandup = {
  id: 1,
  user: {
    id: 100,
    firstName: "Aisha",
    lastName: "Nakato",
    displayName: "Aisha Nakato",
    initials: "AN",
  },
  standupDate: "2026-07-13",
  blockers: "",
  items: [
    { id: 1, section: "COMPLETED", content: "Shipped the thing", position: 0 },
    {
      id: 2,
      section: "COMPLETED",
      content: "Reviewed a PR",
      position: 1,
    },
    { id: 3, section: "CURRENT", content: "Migrating the store", position: 0 },
    { id: 4, section: "PLANNED", content: "Write the RFC", position: 0 },
  ],
};

const me: DashboardStandup = {
  id: 2,
  user: {
    id: 200,
    firstName: "Qa",
    lastName: "Tester",
    displayName: "Qa Tester",
    initials: "QT",
  },
  standupDate: "2026-07-13",
  blockers: "Waiting on infra",
  items: [
    { id: 5, section: "COMPLETED", content: "Reviewed PRs", position: 0 },
  ],
};

describe("MyStandupCard", () => {
  it("shows an empty state when no one has submitted a standup this week", () => {
    render(<MyStandupCard standups={[]} currentUserId={200} />);

    expect(
      screen.getByText("No one has submitted a standup this week yet."),
    ).toBeInTheDocument();
  });

  it("shows every item across every populated section, not just the first", () => {
    render(<MyStandupCard standups={[aisha]} currentUserId={200} />);

    expect(screen.getByText("What did I do?")).toBeInTheDocument();
    expect(screen.getByText("— Shipped the thing")).toBeInTheDocument();
    expect(screen.getByText("— Reviewed a PR")).toBeInTheDocument();
    expect(screen.getByText("What am I working on?")).toBeInTheDocument();
    expect(screen.getByText("— Migrating the store")).toBeInTheDocument();
    expect(screen.getByText("What do I plan to do?")).toBeInTheDocument();
    expect(screen.getByText("— Write the RFC")).toBeInTheDocument();
  });

  it("omits a section heading entirely when that section has no items", () => {
    render(<MyStandupCard standups={[aisha]} currentUserId={200} />);

    expect(screen.queryByText("Meetings")).not.toBeInTheDocument();
  });

  it("omits the Blockers section entirely when there are no blockers", () => {
    render(<MyStandupCard standups={[aisha]} currentUserId={200} />);

    expect(screen.queryByText("Blockers")).not.toBeInTheDocument();
  });

  it("shows the other person's name and no Edit link when it isn't the current user", () => {
    render(<MyStandupCard standups={[aisha]} currentUserId={200} />);

    expect(screen.getByText("Aisha Nakato — today")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  it("shows 'My Standup', the Blockers section, and an Edit link when viewing the current user's own entry", () => {
    render(<MyStandupCard standups={[me]} currentUserId={200} />);

    expect(screen.getByText("My Standup")).toBeInTheDocument();
    expect(screen.getByText("Blockers")).toBeInTheDocument();
    expect(screen.getByText("— Waiting on infra")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument();
  });

  it("cycles between people with Previous/Next", async () => {
    const user = userEvent.setup();
    render(<MyStandupCard standups={[aisha, me]} currentUserId={200} />);

    expect(screen.getByText("Aisha Nakato — today")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next →" }));
    expect(screen.getByText("My Standup")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "← Previous" }));
    expect(screen.getByText("Aisha Nakato — today")).toBeInTheDocument();
  });
});
