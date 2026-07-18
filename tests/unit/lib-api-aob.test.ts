import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}));

import { apiClient } from "@/lib/api/client";
import { createAOBItem, fetchAOBItems } from "@/lib/api/aob";

const mockedGet = vi.mocked(apiClient.get);
const mockedPost = vi.mocked(apiClient.post);

const userDto = {
  id: 1,
  first_name: "Aisha",
  last_name: "Nakato",
  display_name: "Aisha Nakato",
};

const itemDto = {
  id: 7,
  title: "New PR review SLA",
  description: "Review PRs within one business day.",
  external_url: "https://example.com/policy",
  week_start: "2026-07-13",
  position: 1,
  created_by: userDto,
  created_at: "2026-07-13T09:00:00Z",
  updated_at: "2026-07-13T09:00:00Z",
};

describe("fetchAOBItems", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requests /aob-items/ with page_size and maps the response, including the total count", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: { count: 5, next: null, previous: null, results: [itemDto] },
      },
    });

    const result = await fetchAOBItems({ pageSize: 3 });

    expect(mockedGet).toHaveBeenCalledWith("/aob-items/", {
      params: { page_size: 3 },
    });
    expect(result.count).toBe(5);
    expect(result.items[0].createdBy?.displayName).toBe("Aisha Nakato");
    expect(result.items[0].externalUrl).toBe("https://example.com/policy");
  });

  it("maps an empty external_url to null instead of an empty string", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ ...itemDto, external_url: "" }],
        },
      },
    });

    const result = await fetchAOBItems();

    expect(result.items[0].externalUrl).toBeNull();
  });

  it("maps a null created_by to null instead of throwing", async () => {
    mockedGet.mockResolvedValue({
      data: {
        message: "ok",
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ ...itemDto, created_by: null }],
        },
      },
    });

    const result = await fetchAOBItems();

    expect(result.items[0].createdBy).toBeNull();
  });
});

describe("createAOBItem", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts snake_case fields, defaulting optional fields to empty strings", async () => {
    mockedPost.mockResolvedValue({ data: { message: "ok", data: itemDto } });

    await createAOBItem({
      title: "New PR review SLA",
      weekStart: "2026-07-13",
      position: 1,
    });

    expect(mockedPost).toHaveBeenCalledWith("/aob-items/", {
      title: "New PR review SLA",
      description: "",
      external_url: "",
      week_start: "2026-07-13",
      position: 1,
    });
  });

  it("passes through description and externalUrl when given", async () => {
    mockedPost.mockResolvedValue({ data: { message: "ok", data: itemDto } });

    await createAOBItem({
      title: "New PR review SLA",
      description: "Review PRs within one business day.",
      externalUrl: "https://example.com/policy",
      weekStart: "2026-07-13",
      position: 1,
    });

    expect(mockedPost).toHaveBeenCalledWith("/aob-items/", {
      title: "New PR review SLA",
      description: "Review PRs within one business day.",
      external_url: "https://example.com/policy",
      week_start: "2026-07-13",
      position: 1,
    });
  });
});
