import { apiClient } from "@/lib/api/client";
import { toUserRef, type UserRefDto } from "@/lib/api/user-ref";
import type { ApiSuccessResponse, PaginatedData } from "@/types/api";
import type { UserRef } from "@/types/user-ref";

export interface UserListParams {
  search?: string;
}

/** GET /users/ — the active user directory, for pickers like the history engineer filter. */
export async function fetchUsers(
  params: UserListParams = {},
): Promise<UserRef[]> {
  const { data } = await apiClient.get<
    ApiSuccessResponse<PaginatedData<UserRefDto>>
  >("/users/", {
    params: { page_size: 100, search: params.search || undefined },
  });
  return data.data.results.map(toUserRef);
}
