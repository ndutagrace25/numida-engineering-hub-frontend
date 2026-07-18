import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardView } from "@/components/dashboard/dashboard-view";
import * as aobApi from "@/lib/api/aob";
import * as dashboardApi from "@/lib/api/dashboard";
import * as ptoApi from "@/lib/api/pto";
import type { Dashboard } from "@/types/dashboard";

vi.mock("@/lib/api/dashboard");
vi.mock("@/lib/api/pto");
vi.mock("@/lib/api/aob");

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

function renderWithQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <DashboardView />
    </QueryClientProvider>,
  );
}

const emptyDashboard: Dashboard = {
  weekStart: "2026-07-13",
  weekEnd: "2026-07-19",
  standupSummary: {
    totalActiveUsers: 3,
    totalSubmittedStandups: 1,
    usersWhoSubmitted: [],
    usersWhoHaveNotSubmitted: [],
  },
  weeklyStandups: [],
  presence: { online: [], recentlyActive: [], offline: [] },
  aobItems: [],
  ptoEntries: [],
  pullRequestLinks: [],
};

describe("DashboardView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the submission banner's counts once the dashboard loads", async () => {
    vi.mocked(dashboardApi.fetchDashboard).mockResolvedValue(emptyDashboard);
    vi.mocked(ptoApi.fetchUpcomingPTOEntries).mockResolvedValue([]);
    vi.mocked(aobApi.fetchAOBItems).mockResolvedValue({ items: [], count: 0 });

    renderWithQueryClient();

    expect(
      await screen.findByText("1 of 3 engineers have submitted their standup"),
    ).toBeInTheDocument();
  });

  it("shows a safe error message when the request fails", async () => {
    vi.mocked(dashboardApi.fetchDashboard).mockRejectedValue(
      Object.assign(new Error("network down"), { isAxiosError: true }),
    );
    vi.mocked(ptoApi.fetchUpcomingPTOEntries).mockResolvedValue([]);
    vi.mocked(aobApi.fetchAOBItems).mockResolvedValue({ items: [], count: 0 });

    renderWithQueryClient();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Can't reach the server. Check your connection and try again.",
    );
  });
});
