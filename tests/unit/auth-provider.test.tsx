import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "@/hooks/use-auth";
import * as authApi from "@/lib/api/auth";
import { AuthProvider } from "@/providers/auth-provider";

vi.mock("@/lib/api/auth");

function TestConsumer() {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading…</div>;
  return (
    <div>
      {isAuthenticated ? `Hello ${user?.displayName}` : "Not authenticated"}
    </div>
  );
}

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

const authUser = {
  id: 1,
  email: "grace@numida.com",
  firstName: "Grace",
  lastName: "Nduta",
  displayName: "Grace Nduta",
  initials: "GN",
  isActive: true,
  dateJoined: "2026-01-01T00:00:00Z",
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state, then the authenticated user once /auth/me/ resolves", async () => {
    vi.mocked(authApi.fetchCurrentUser).mockResolvedValue(authUser);

    renderWithProviders();

    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(await screen.findByText("Hello Grace Nduta")).toBeInTheDocument();
  });

  it("shows 'not authenticated' when /auth/me/ resolves to null (no session)", async () => {
    vi.mocked(authApi.fetchCurrentUser).mockResolvedValue(null);

    renderWithProviders();

    expect(await screen.findByText("Not authenticated")).toBeInTheDocument();
  });
});
