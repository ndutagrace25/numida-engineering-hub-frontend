import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProtectedRoute } from "@/components/auth/protected-route";

const replaceMock = vi.fn();
let authState = { isAuthenticated: false, isLoading: true };

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => authState,
}));

vi.mock("@/lib/api/presence", () => ({
  sendHeartbeat: vi.fn().mockResolvedValue(undefined),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing and does not redirect while the session check is loading", () => {
    authState = { isAuthenticated: false, isLoading: true };
    render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects to /auth/login with a next= param when not authenticated", () => {
    authState = { isAuthenticated: false, isLoading: false };
    render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(replaceMock).toHaveBeenCalledWith("/auth/login?next=%2Fdashboard");
    expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
  });

  it("renders children once authenticated, without redirecting", () => {
    authState = { isAuthenticated: true, isLoading: false };
    render(
      <ProtectedRoute>
        <div>Secret content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Secret content")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
