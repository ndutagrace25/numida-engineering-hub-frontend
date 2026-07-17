import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

import { apiClient } from "@/lib/api/client";
import {
  createStandup,
  fetchStandups,
  fetchWeeklyStandups,
  updateStandup,
} from "@/lib/api/standups";

const mockedGet = vi.mocked(apiClient.get);
const mockedPost = vi.mocked(apiClient.post);
const mockedPatch = vi.mocked(apiClient.patch);

const userDto = {
  id: 1,
  first_name: "Aisha",
  last_name: "Nakato",
  display_name: "Aisha Nakato",
};

const standupDto = {
  id: 10,
  user: userDto,
  standup_date: "2026-07-13",
  blockers: "",
  items: [{ id: 1, section: "COMPLETED", content: "Shipped it", position: 0 }],
};

describe("createStandup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts snake_case fields and maps the response", async () => {
    mockedPost.mockResolvedValue({ data: { message: "ok", data: standupDto } });

    const standup = await createStandup({
      standupDate: "2026-07-13",
      blockers: "",
      items: [{ section: "COMPLETED", content: "Shipped it", position: 0 }],
    });

    expect(mockedPost).toHaveBeenCalledWith("/standups/", {
      standup_date: "2026-07-13",
      blockers: "",
      items: [{ section: "COMPLETED", content: "Shipped it", position: 0 }],
    });
    expect(standup.id).toBe(10);
    expect(standup.user.displayName).toBe("Aisha Nakato");
  });
});

describe("updateStandup", () => {
  beforeEach(() => vi.clearAllMocks());

  it("patches the standup's own endpoint with the given fields", async () => {
    mockedPatch.mockResolvedValue({
      data: { message: "ok", data: standupDto },
    });

    await updateStandup(10, { blockers: "Waiting on infra" });

    expect(mockedPatch).toHaveBeenCalledWith("/standups/10/", {
      blockers: "Waiting on infra",
    });
  });
});

describe("fetchWeeklyStandups", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requests the weekly endpoint with week_start and maps every entry", async () => {
    mockedGet.mockResolvedValue({
      data: { message: "ok", data: [standupDto] },
    });

    const standups = await fetchWeeklyStandups("2026-07-13");

    expect(mockedGet).toHaveBeenCalledWith("/standups/weekly/", {
      params: { week_start: "2026-07-13" },
    });
    expect(standups).toHaveLength(1);
    expect(standups[0].blockers).toBe("");
  });
});

describe("fetchStandups", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passes through user/standupDate/search/date range params in snake_case", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: { count: 1, next: null, previous: null, results: [standupDto] },
      },
    });

    await fetchStandups({
      user: 5,
      standupDate: "2026-07-13",
      search: "onboarding",
      dateAfter: "2026-07-01",
      dateBefore: "2026-07-31",
      pageSize: 25,
    });

    expect(mockedGet).toHaveBeenCalledWith("/standups/", {
      params: {
        user: 5,
        standup_date: "2026-07-13",
        search: "onboarding",
        date_after: "2026-07-01",
        date_before: "2026-07-31",
        page_size: 25,
      },
    });
  });

  it("defaults page_size to 50 and omits an empty search string", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: { count: 0, next: null, previous: null, results: [] },
      },
    });

    await fetchStandups({ search: "" });

    expect(mockedGet).toHaveBeenCalledWith("/standups/", {
      params: {
        user: undefined,
        standup_date: undefined,
        search: undefined,
        date_after: undefined,
        date_before: undefined,
        page_size: 50,
      },
    });
  });
});
