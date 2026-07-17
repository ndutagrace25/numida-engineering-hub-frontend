import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "@/components/layout/app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: "grace@numida.com",
      displayName: "Grace Nduta",
      initials: "GN",
    },
    logout: vi.fn(),
  }),
}));

describe("AppShell", () => {
  it("renders the page title, the primary navigation, and its children", () => {
    render(
      <AppShell title="Dashboard">
        <div>Page content</div>
      </AppShell>,
    );

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders every primary nav link", () => {
    render(
      <AppShell title="Dashboard">
        <div />
      </AppShell>,
    );

    for (const label of [
      "Dashboard",
      "Standups",
      "My History",
      "Team History",
      "PTO",
      "AOB",
      "Pull Requests",
    ]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});
