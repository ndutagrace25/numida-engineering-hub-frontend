import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Sidebar } from "@/components/layout/sidebar";

const usePathnameMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Sidebar", () => {
  it("marks the nav item matching the current route as active", () => {
    usePathnameMock.mockReturnValue("/pto");
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "PTO" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks Dashboard active on the dashboard route", () => {
    usePathnameMock.mockReturnValue("/dashboard");
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "PTO" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("calls onNavigate when a nav link is clicked (used to close the mobile drawer)", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    usePathnameMock.mockReturnValue("/dashboard");
    const onNavigate = vi.fn();
    render(<Sidebar onNavigate={onNavigate} />);

    await userEvent.setup().click(screen.getByRole("link", { name: "PTO" }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
