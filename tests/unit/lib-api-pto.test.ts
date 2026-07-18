import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

import { apiClient } from "@/lib/api/client";
import { createPTOEntry, fetchPTOEntries } from "@/lib/api/pto";

const mockedGet = vi.mocked(apiClient.get);
const mockedPost = vi.mocked(apiClient.post);

const userDto = {
  id: 1,
  first_name: "Diana",
  last_name: "Kariuki",
  display_name: "Diana Kariuki",
};

const entryDto = {
  id: 5,
  user: userDto,
  start_date: "2026-07-27",
  end_date: "2026-07-31",
  reason: "Annual leave",
  handover_url: "https://example.com/handover",
  created_by: userDto,
};

describe("fetchPTOEntries", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requests /pto/ with date_after and page_size, and maps the response", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: { count: 1, next: null, previous: null, results: [entryDto] },
      },
    });

    const entries = await fetchPTOEntries({
      dateAfter: "2026-07-01",
      pageSize: 10,
    });

    expect(mockedGet).toHaveBeenCalledWith("/pto/", {
      params: { date_after: "2026-07-01", page_size: 10 },
    });
    expect(entries[0].handoverUrl).toBe("https://example.com/handover");
    expect(entries[0].user?.displayName).toBe("Diana Kariuki");
  });

  it("maps an empty handover_url to null instead of an empty string", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ ...entryDto, handover_url: "" }],
        },
      },
    });

    const entries = await fetchPTOEntries();

    expect(entries[0].handoverUrl).toBeNull();
  });

  it("maps a null user/created_by to null instead of throwing", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ ...entryDto, user: null, created_by: null }],
        },
      },
    });

    const entries = await fetchPTOEntries();

    expect(entries[0].user).toBeNull();
    expect(entries[0].createdBy).toBeNull();
  });
});

describe("createPTOEntry", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts snake_case fields, defaulting optional fields to empty strings", async () => {
    mockedPost.mockResolvedValue({ data: { message: "ok", data: entryDto } });

    await createPTOEntry({
      user: 1,
      startDate: "2026-07-27",
      endDate: "2026-07-31",
    });

    expect(mockedPost).toHaveBeenCalledWith("/pto/", {
      user: 1,
      start_date: "2026-07-27",
      end_date: "2026-07-31",
      reason: "",
      handover_url: "",
    });
  });

  it("passes through reason and handoverUrl when given", async () => {
    mockedPost.mockResolvedValue({ data: { message: "ok", data: entryDto } });

    await createPTOEntry({
      user: 1,
      startDate: "2026-07-27",
      endDate: "2026-07-31",
      reason: "Annual leave",
      handoverUrl: "https://example.com/handover",
    });

    expect(mockedPost).toHaveBeenCalledWith("/pto/", {
      user: 1,
      start_date: "2026-07-27",
      end_date: "2026-07-31",
      reason: "Annual leave",
      handover_url: "https://example.com/handover",
    });
  });
});
