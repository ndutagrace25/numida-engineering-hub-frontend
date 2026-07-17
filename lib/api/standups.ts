import { apiClient } from "@/lib/api/client";
import { toUserRef, type UserRefDto } from "@/lib/api/user-ref";
import type { ApiSuccessResponse, PaginatedData } from "@/types/api";
import type {
  Standup,
  StandupItem,
  StandupItemSection,
} from "@/types/standups";

/** Raw shapes of apps/standups/serializers.py's StandupSerializer/StandupItemSerializer. */
export interface StandupItemDto {
  id: number;
  section: StandupItemSection;
  content: string;
  position: number;
}

export interface StandupDto {
  id: number;
  user: UserRefDto;
  standup_date: string;
  blockers: string;
  items: StandupItemDto[];
}

export function toStandupItem(dto: StandupItemDto): StandupItem {
  return {
    id: dto.id,
    section: dto.section,
    content: dto.content,
    position: dto.position,
  };
}

export function toStandup(dto: StandupDto): Standup {
  return {
    id: dto.id,
    user: toUserRef(dto.user),
    standupDate: dto.standup_date,
    blockers: dto.blockers,
    items: dto.items.map(toStandupItem),
  };
}

export interface StandupItemInput {
  section: StandupItemSection;
  content: string;
  position: number;
}

export interface CreateStandupInput {
  standupDate: string;
  blockers: string;
  items: StandupItemInput[];
}

/** POST /standups/ — creates the authenticated user's standup for a date. */
export async function createStandup(
  input: CreateStandupInput,
): Promise<Standup> {
  const { data } = await apiClient.post<ApiSuccessResponse<StandupDto>>(
    "/standups/",
    {
      standup_date: input.standupDate,
      blockers: input.blockers,
      items: input.items,
    },
  );
  return toStandup(data.data);
}

export interface UpdateStandupInput {
  blockers?: string;
  items?: StandupItemInput[];
}

/** PATCH /standups/<id>/ — partial update; omitting `items` leaves them untouched. */
export async function updateStandup(
  id: number,
  input: UpdateStandupInput,
): Promise<Standup> {
  const { data } = await apiClient.patch<ApiSuccessResponse<StandupDto>>(
    `/standups/${id}/`,
    input,
  );
  return toStandup(data.data);
}

/** GET /standups/weekly/?week_start=<Monday> — every user's standup for that week, unpaginated. */
export async function fetchWeeklyStandups(
  weekStart: string,
): Promise<Standup[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<StandupDto[]>>(
    "/standups/weekly/",
    { params: { week_start: weekStart } },
  );
  return data.data.map(toStandup);
}

export interface StandupListParams {
  /** Scope to one user's standups (e.g. the authenticated user's own, or a selected engineer). */
  user?: number;
  /** Exact standup_date match — e.g. "does this user already have a standup for this week's Monday?" */
  standupDate?: string;
  search?: string;
  dateAfter?: string;
  dateBefore?: string;
  pageSize?: number;
}

/** GET /standups/ — every user's standups, paginated and filterable. */
export async function fetchStandups(
  params: StandupListParams = {},
): Promise<Standup[]> {
  const { data } = await apiClient.get<
    ApiSuccessResponse<PaginatedData<StandupDto>>
  >("/standups/", {
    params: {
      user: params.user,
      standup_date: params.standupDate,
      search: params.search || undefined,
      date_after: params.dateAfter,
      date_before: params.dateBefore,
      page_size: params.pageSize ?? 50,
    },
  });
  return data.data.results.map(toStandup);
}
