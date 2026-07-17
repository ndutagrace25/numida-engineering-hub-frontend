import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserMenu } from "@/components/layout/user-menu";

const pushMock = vi.fn();
const logoutMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: "grace@numida.com",
      displayName: "Grace Nduta",
      initials: "GN",
    },
    logout: logoutMock,
  }),
}));

describe("UserMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the authenticated user's name and email", async () => {
    const user = userEvent.setup();
    render(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /account menu/i }));

    expect(await screen.findByText("Grace Nduta")).toBeInTheDocument();
    expect(screen.getByText("grace@numida.com")).toBeInTheDocument();
  });

  it("calls logout and redirects to /auth/login when Log out is clicked", async () => {
    logoutMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /account menu/i }));
    await user.click(await screen.findByRole("menuitem", { name: /log out/i }));

    expect(logoutMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/auth/login");
  });

  it("still redirects to /auth/login even if the logout call itself fails", async () => {
    logoutMock.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    render(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /account menu/i }));
    await user.click(await screen.findByRole("menuitem", { name: /log out/i }));

    expect(pushMock).toHaveBeenCalledWith("/auth/login");
  });
});
