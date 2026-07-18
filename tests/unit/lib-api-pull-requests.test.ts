import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

import { apiClient } from "@/lib/api/client";
import {
  createPullRequestLink,
  fetchPullRequestLinks,
} from "@/lib/api/pull-requests";

const mockedGet = vi.mocked(apiClient.get);
const mockedPost = vi.mocked(apiClient.post);

const userDto = {
  id: 1,
  first_name: "Aisha",
  last_name: "Nakato",
  display_name: "Aisha Nakato",
};

const linkDto = {
  id: 44,
  title: "Fix login bug",
  url: "https://github.com/org/repo/pull/6905",
  group_name: "App 3.0 PRs",
  status: "IN_REVIEW",
  week_start: "2026-07-13",
  position: 1,
  created_by: userDto,
  created_at: "2026-07-13T09:00:00Z",
  updated_at: "2026-07-13T09:00:00Z",
};

describe("fetchPullRequestLinks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requests /pull-request-links/ with page_size and maps the response, including the total count", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: { count: 5, next: null, previous: null, results: [linkDto] },
      },
    });

    const result = await fetchPullRequestLinks({ pageSize: 3 });

    expect(mockedGet).toHaveBeenCalledWith("/pull-request-links/", {
      params: { page_size: 3 },
    });
    expect(result.count).toBe(5);
    expect(result.items[0].groupName).toBe("App 3.0 PRs");
    expect(result.items[0].createdBy?.displayName).toBe("Aisha Nakato");
  });

  it("maps a null created_by to null instead of throwing", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ ...linkDto, created_by: null }],
        },
      },
    });

    const result = await fetchPullRequestLinks();

    expect(result.items[0].createdBy).toBeNull();
  });
});

describe("createPullRequestLink", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts snake_case fields", async () => {
    mockedPost.mockResolvedValue({ data: { message: "ok", data: linkDto } });

    await createPullRequestLink({
      title: "Fix login bug",
      url: "https://github.com/org/repo/pull/6905",
      groupName: "App 3.0 PRs",
      status: "IN_REVIEW",
      weekStart: "2026-07-13",
      position: 1,
    });

    expect(mockedPost).toHaveBeenCalledWith("/pull-request-links/", {
      title: "Fix login bug",
      url: "https://github.com/org/repo/pull/6905",
      group_name: "App 3.0 PRs",
      status: "IN_REVIEW",
      week_start: "2026-07-13",
      position: 1,
    });
  });
});
