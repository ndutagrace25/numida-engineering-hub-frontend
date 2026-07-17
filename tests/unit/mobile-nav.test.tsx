import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MobileNav } from "@/components/layout/mobile-nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

describe("MobileNav", () => {
  it("is closed by default", () => {
    render(<MobileNav />);

    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
  });

  it("opens the navigation drawer and shows every nav link when the menu button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );

    expect(
      await screen.findByRole("link", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Pull Requests" }),
    ).toBeInTheDocument();
  });
});
