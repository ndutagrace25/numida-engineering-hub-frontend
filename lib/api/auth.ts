import { apiClient } from "@/lib/api/client";
import { getApiError } from "@/lib/api/errors";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthUser, LoginCredentials } from "@/types/auth";

/** Raw shape of apps/accounts/serializers.py's UserSerializer/CurrentUserSerializer. */
interface UserDto {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  is_active: boolean;
  date_joined: string;
}

function getInitials(dto: UserDto): string {
  const first = dto.first_name.trim();
  const last = dto.last_name.trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (last) return last.slice(0, 2).toUpperCase();
  return dto.email.slice(0, 2).toUpperCase();
}

function toAuthUser(dto: UserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.first_name,
    lastName: dto.last_name,
    displayName: dto.display_name,
    initials: getInitials(dto),
    isActive: dto.is_active,
    dateJoined: dto.date_joined,
  };
}

/** POST /auth/login/ — starts a session. Rejects with the raw error on failure. */
export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const { data } = await apiClient.post<ApiSuccessResponse<UserDto>>(
    "/auth/login/",
    credentials,
  );
  return toAuthUser(data.data);
}

/**
 * POST /auth/logout/ — ends the session. A 401 here means the session had
 * already expired (LogoutView requires IsAuthenticated) — that still counts
 * as a successful logout locally, since the desired end state ("no active
 * session") is already true. Any other failure (network, 5xx) rethrows so
 * the caller can surface it instead of silently discarding local state.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout/");
  } catch (error) {
    if (getApiError(error).status === 401) return;
    throw error;
  }
}

/**
 * GET /auth/me/ — the current session's user. A 401 here just means "not
 * logged in," which is a normal, expected result (not an error) on first
 * load or after a session expires — so it resolves to `null` instead of
 * throwing. Any other failure (network, 5xx) rethrows.
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } =
      await apiClient.get<ApiSuccessResponse<UserDto>>("/auth/me/");
    return toAuthUser(data.data);
  } catch (error) {
    if (getApiError(error).status === 401) return null;
    throw error;
  }
}
