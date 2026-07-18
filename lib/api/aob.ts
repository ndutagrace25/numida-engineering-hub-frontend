import { apiClient } from "@/lib/api/client";
import { toUserRef, type UserRefDto } from "@/lib/api/user-ref";
import type { ApiSuccessResponse, PaginatedData } from "@/types/api";
import type { AOBItem } from "@/types/aob";

/** Raw shape of apps.aob.serializers.AOBItemSerializer. */
export interface AOBItemDto {
  id: number;
  title: string;
  description: string;
  external_url: string;
  week_start: string;
  position: number;
  created_by: UserRefDto | null;
  created_at: string;
  updated_at: string;
}

export function toAOBItem(dto: AOBItemDto): AOBItem {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    externalUrl: dto.external_url || null,
    weekStart: dto.week_start,
    position: dto.position,
    createdBy: dto.created_by ? toUserRef(dto.created_by) : null,
    createdAt: dto.created_at,
  };
}

export interface AOBListParams {
  pageSize?: number;
}

export interface AOBListResult {
  items: AOBItem[];
  /** Total items across all pages — lets a caller know if more exist
   * beyond what it asked for (e.g. the dashboard's "latest 3" widget
   * deciding whether to show a "View more" link). */
  count: number;
}

/** GET /aob-items/ — newest week first, then position ascending within a week. */
export async function fetchAOBItems(
  params: AOBListParams = {},
): Promise<AOBListResult> {
  const { data } = await apiClient.get<
    ApiSuccessResponse<PaginatedData<AOBItemDto>>
  >("/aob-items/", {
    params: { page_size: params.pageSize ?? 50 },
  });
  return { items: data.data.results.map(toAOBItem), count: data.data.count };
}

export interface CreateAOBItemInput {
  title: string;
  description?: string;
  externalUrl?: string;
  weekStart: string;
  position: number;
}

/** POST /aob-items/ — created_by is set server-side from the session. */
export async function createAOBItem(
  input: CreateAOBItemInput,
): Promise<AOBItem> {
  const { data } = await apiClient.post<ApiSuccessResponse<AOBItemDto>>(
    "/aob-items/",
    {
      title: input.title,
      description: input.description ?? "",
      external_url: input.externalUrl ?? "",
      week_start: input.weekStart,
      position: input.position,
    },
  );
  return toAOBItem(data.data);
}
