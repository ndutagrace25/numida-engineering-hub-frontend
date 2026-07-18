import { apiClient } from "@/lib/api/client";
import { toUserRef, type UserRefDto } from "@/lib/api/user-ref";
import { formatDateParam } from "@/lib/week";
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

const UPCOMING_LOOKBACK_DAYS = 30;

/**
 * All PTO that hasn't ended yet — not bounded to any single week. The
 * backend's date_after filter only applies to start_date, so a 30-day
 * lookback safely catches any currently-active entry (started before
 * today, still ongoing); there's no single query param for "hasn't ended
 * yet," so anything already ended is filtered out here. Used by both the
 * standalone PTO page and the Dashboard's "Upcoming PTO" widget, which —
 * unlike the rest of the dashboard aggregate — isn't meant to be scoped
 * to just the current week.
 */
export async function fetchUpcomingPTOEntries(): Promise<PTOEntry[]> {
  const today = new Date();
  const todayStr = formatDateParam(today);
  const dateAfter = formatDateParam(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - UPCOMING_LOOKBACK_DAYS,
    ),
  );
  const entries = await fetchPTOEntries({ dateAfter, pageSize: 50 });
  return entries.filter((entry) => entry.endDate >= todayStr);
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
