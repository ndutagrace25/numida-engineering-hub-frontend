import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/client", () => ({
  apiClient: { post: vi.fn(), get: vi.fn() },
}));
vi.mock("@/lib/api/errors", () => ({
  getApiError: vi.fn(),
}));

import { apiClient } from "@/lib/api/client";
import { fetchCurrentUser, login, logout } from "@/lib/api/auth";
import { getApiError } from "@/lib/api/errors";

const mockedPost = vi.mocked(apiClient.post);
const mockedGet = vi.mocked(apiClient.get);
const mockedGetApiError = vi.mocked(getApiError);

const userDto = {
  id: 12,
  email: "grace@numida.com",
  first_name: "Grace",
  last_name: "Nduta",
  display_name: "Grace Nduta",
  is_active: true,
  date_joined: "2026-01-05T08:30:00+03:00",
};

describe("lib/api/auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("posts to /auth/login/ and maps the backend DTO to an AuthUser", async () => {
      mockedPost.mockResolvedValue({
        data: { message: "Login successful.", data: userDto },
      });

      const user = await login({
        email: "grace@numida.com",
        password: "secret",
      });

      expect(mockedPost).toHaveBeenCalledWith("/auth/login/", {
        email: "grace@numida.com",
        password: "secret",
      });
      expect(user).toEqual({
        id: 12,
        email: "grace@numida.com",
        firstName: "Grace",
        lastName: "Nduta",
        displayName: "Grace Nduta",
        initials: "GN",
        isActive: true,
        dateJoined: "2026-01-05T08:30:00+03:00",
      });
    });

    it("rethrows on invalid credentials so the caller can surface the error", async () => {
      const error = new Error("Request failed with status code 400");
      mockedPost.mockRejectedValue(error);

      await expect(
        login({ email: "x@x.com", password: "wrong" }),
      ).rejects.toThrow(error);
    });
  });

  describe("logout", () => {
    it("resolves normally on a successful logout", async () => {
      mockedPost.mockResolvedValue({
        data: { message: "Logout successful.", data: null },
      });

      await expect(logout()).resolves.toBeUndefined();
    });

    it("treats a 401 (already-expired session) as a successful logout", async () => {
      mockedPost.mockRejectedValue(new Error("Unauthorized"));
      mockedGetApiError.mockReturnValue({
        status: 401,
        code: "NOT_AUTHENTICATED",
        message: "Authentication credentials were not provided.",
        fields: {},
      });

      await expect(logout()).resolves.toBeUndefined();
    });

    it("rethrows a non-401 failure (e.g. a network error)", async () => {
      const error = new Error("Network Error");
      mockedPost.mockRejectedValue(error);
      mockedGetApiError.mockReturnValue({
        status: 0,
        code: "NETWORK_ERROR",
        message: "Network Error",
        fields: {},
      });

      await expect(logout()).rejects.toThrow(error);
    });
  });

  describe("fetchCurrentUser", () => {
    it("returns the mapped user when a session is active", async () => {
      mockedGet.mockResolvedValue({
        data: { message: "ok", data: userDto },
      });

      const user = await fetchCurrentUser();

      expect(user?.displayName).toBe("Grace Nduta");
      expect(user?.initials).toBe("GN");
    });

    it("resolves to null on a 401 (no active session) instead of throwing", async () => {
      mockedGet.mockRejectedValue(new Error("Unauthorized"));
      mockedGetApiError.mockReturnValue({
        status: 401,
        code: "NOT_AUTHENTICATED",
        message: "Authentication credentials were not provided.",
        fields: {},
      });

      await expect(fetchCurrentUser()).resolves.toBeNull();
    });

    it("rethrows a non-401 failure", async () => {
      const error = new Error("Server Error");
      mockedGet.mockRejectedValue(error);
      mockedGetApiError.mockReturnValue({
        status: 500,
        code: "SERVER_ERROR",
        message: "An unexpected error occurred.",
        fields: {},
      });

      await expect(fetchCurrentUser()).rejects.toThrow(error);
    });
  });
});
