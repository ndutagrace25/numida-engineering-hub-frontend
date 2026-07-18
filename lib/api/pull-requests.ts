import { apiClient } from "@/lib/api/client";
import { toUserRef, type UserRefDto } from "@/lib/api/user-ref";
import type { ApiSuccessResponse, PaginatedData } from "@/types/api";
import type { PullRequestLink } from "@/types/pull-requests";

/** Raw shape of apps.pull_requests.serializers.PullRequestLinkSerializer. */
export interface PullRequestLinkDto {
  id: number;
  title: string;
  url: string;
  group_name: string;
  status: PullRequestLink["status"];
  week_start: string;
  position: number;
  created_by: UserRefDto | null;
  created_at: string;
  updated_at: string;
}

export function toPullRequestLink(dto: PullRequestLinkDto): PullRequestLink {
  return {
    id: dto.id,
    title: dto.title,
    url: dto.url,
    groupName: dto.group_name,
    status: dto.status,
    weekStart: dto.week_start,
    position: dto.position,
    createdBy: dto.created_by ? toUserRef(dto.created_by) : null,
    createdAt: dto.created_at,
  };
}

export interface PullRequestListParams {
  pageSize?: number;
}

export interface PullRequestListResult {
  items: PullRequestLink[];
  count: number;
}

/** GET /pull-request-links/ — newest week first, then group_name, then position. */
export async function fetchPullRequestLinks(
  params: PullRequestListParams = {},
): Promise<PullRequestListResult> {
  const { data } = await apiClient.get<
    ApiSuccessResponse<PaginatedData<PullRequestLinkDto>>
  >("/pull-request-links/", {
    params: { page_size: params.pageSize ?? 50 },
  });
  return {
    items: data.data.results.map(toPullRequestLink),
    count: data.data.count,
  };
}

export interface CreatePullRequestLinkInput {
  title: string;
  url: string;
  groupName: string;
  status: PullRequestLink["status"];
  weekStart: string;
  position: number;
}

/** POST /pull-request-links/ — created_by is set server-side from the session. */
export async function createPullRequestLink(
  input: CreatePullRequestLinkInput,
): Promise<PullRequestLink> {
  const { data } = await apiClient.post<ApiSuccessResponse<PullRequestLinkDto>>(
    "/pull-request-links/",
    {
      title: input.title,
      url: input.url,
      group_name: input.groupName,
      status: input.status,
      week_start: input.weekStart,
      position: input.position,
    },
  );
  return toPullRequestLink(data.data);
}
