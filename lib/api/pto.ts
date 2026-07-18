import { apiClient } from "@/lib/api/client";
import { toUserRef, type UserRefDto } from "@/lib/api/user-ref";
import type { ApiSuccessResponse, PaginatedData } from "@/types/api";
import type { PTOEntry } from "@/types/pto";

/** Raw shape of apps.pto.serializers.PTOEntrySerializer. */
export interface PTOEntryDto {
  id: number;
  user: UserRefDto | null;
  start_date: string;
  end_date: string;
  reason: string;
  handover_url: string;
  created_by: UserRefDto | null;
}

export function toPTOEntry(dto: PTOEntryDto): PTOEntry {
  return {
    id: dto.id,
    user: dto.user ? toUserRef(dto.user) : null,
    startDate: dto.start_date,
    endDate: dto.end_date,
    reason: dto.reason,
    handoverUrl: dto.handover_url || null,
    createdBy: dto.created_by ? toUserRef(dto.created_by) : null,
  };
}

export interface PTOListParams {
  dateAfter?: string;
  pageSize?: number;
}

/** GET /pto/ — soonest start_date first. */
export async function fetchPTOEntries(
  params: PTOListParams = {},
): Promise<PTOEntry[]> {
  const { data } = await apiClient.get<
    ApiSuccessResponse<PaginatedData<PTOEntryDto>>
  >("/pto/", {
    params: { date_after: params.dateAfter, page_size: params.pageSize ?? 50 },
  });
  return data.data.results.map(toPTOEntry);
}

export interface CreatePTOEntryInput {
  user: number;
  startDate: string;
  endDate: string;
  reason?: string;
  handoverUrl?: string;
}

/** POST /pto/ — `user` is required (whoever is taking the leave). */
export async function createPTOEntry(
  input: CreatePTOEntryInput,
): Promise<PTOEntry> {
  const { data } = await apiClient.post<ApiSuccessResponse<PTOEntryDto>>(
    "/pto/",
    {
      user: input.user,
      start_date: input.startDate,
      end_date: input.endDate,
      reason: input.reason ?? "",
      handover_url: input.handoverUrl ?? "",
    },
  );
  return toPTOEntry(data.data);
}
