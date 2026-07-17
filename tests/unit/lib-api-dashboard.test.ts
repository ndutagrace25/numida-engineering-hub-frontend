import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

import { apiClient } from "@/lib/api/client";
import { fetchDashboard } from "@/lib/api/dashboard";

const mockedGet = vi.mocked(apiClient.get);

const userDto = {
  id: 1,
  first_name: "Aisha",
  last_name: "Nakato",
  display_name: "Aisha Nakato",
};

const dashboardDto = {
  week_start: "2026-07-13",
  week_end: "2026-07-19",
  standup_summary: {
    total_active_users: 2,
    total_submitted_standups: 1,
    users_who_submitted: [userDto],
    users_who_have_not_submitted: [],
  },
  weekly_standups: [
    {
      id: 10,
      user: userDto,
      standup_date: "2026-07-13",
      blockers: "Waiting on infra",
      items: [
        { id: 1, section: "COMPLETED", content: "Shipped X", position: 0 },
      ],
    },
  ],
  presence: { online: [], recently_active: [], offline: [] },
  aob_items: [],
  pto_entries: [],
  pull_request_links: [],
};

describe("fetchDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests /dashboard/ with the given week_start and maps the response to camelCase", async () => {
    mockedGet.mockResolvedValue({
      data: { message: "ok", data: dashboardDto },
    });

    const dashboard = await fetchDashboard("2026-07-13");

    expect(mockedGet).toHaveBeenCalledWith("/dashboard/", {
      params: { week_start: "2026-07-13" },
    });
    expect(dashboard.weekStart).toBe("2026-07-13");
    expect(dashboard.standupSummary.totalActiveUsers).toBe(2);
    expect(dashboard.standupSummary.usersWhoSubmitted[0]).toEqual({
      id: 1,
      firstName: "Aisha",
      lastName: "Nakato",
      displayName: "Aisha Nakato",
      initials: "AN",
    });
    expect(dashboard.weeklyStandups[0].blockers).toBe("Waiting on infra");
    expect(dashboard.weeklyStandups[0].items[0]).toEqual({
      id: 1,
      section: "COMPLETED",
      content: "Shipped X",
      position: 0,
    });
  });

  it("maps a null created_by/user to null instead of throwing", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: {
          ...dashboardDto,
          pto_entries: [
            {
              id: 5,
              user: null,
              start_date: "2026-07-14",
              end_date: "2026-07-15",
              reason: "PTO",
              handover_url: null,
              created_by: null,
            },
          ],
        },
      },
    });

    const dashboard = await fetchDashboard("2026-07-13");

    expect(dashboard.ptoEntries[0].user).toBeNull();
    expect(dashboard.ptoEntries[0].createdBy).toBeNull();
  });
});
