import { apiClient } from "@/lib/api/client";
import { getInitials } from "@/lib/initials";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  Dashboard,
  DashboardAOBItem,
  DashboardPresence,
  DashboardPresenceEntry,
  DashboardPTOEntry,
  DashboardPullRequestLink,
  DashboardStandup,
  DashboardStandupItem,
  DashboardStandupSummary,
  DashboardUserRef,
  StandupSection,
} from "@/types/dashboard";

/** Raw shapes of apps/dashboard/serializers.py's nested serializers. */
interface UserRefDto {
  id: number;
  first_name: string;
  last_name: string;
  display_name: string;
}

interface StandupItemDto {
  id: number;
  section: StandupSection;
  content: string;
  position: number;
}

interface StandupDto {
  id: number;
  user: UserRefDto;
  standup_date: string;
  blockers: string;
  items: StandupItemDto[];
}

interface StandupSummaryDto {
  total_active_users: number;
  total_submitted_standups: number;
  users_who_submitted: UserRefDto[];
  users_who_have_not_submitted: UserRefDto[];
}

interface PresenceEntryDto {
  user: UserRefDto;
  last_seen_at: string | null;
}

interface PresenceDto {
  online: PresenceEntryDto[];
  recently_active: PresenceEntryDto[];
  offline: PresenceEntryDto[];
}

interface AOBItemDto {
  id: number;
  title: string;
  description: string;
  external_url: string | null;
  week_start: string;
  position: number;
  created_by: UserRefDto | null;
  created_at: string;
}

interface PTOEntryDto {
  id: number;
  user: UserRefDto | null;
  start_date: string;
  end_date: string;
  reason: string;
  handover_url: string | null;
  created_by: UserRefDto | null;
}

interface PullRequestLinkDto {
  id: number;
  title: string;
  url: string;
  group_name: string;
  status: DashboardPullRequestLink["status"];
  week_start: string;
  position: number;
  created_by: UserRefDto | null;
}

interface DashboardDto {
  week_start: string;
  week_end: string;
  standup_summary: StandupSummaryDto;
  weekly_standups: StandupDto[];
  presence: PresenceDto;
  aob_items: AOBItemDto[];
  pto_entries: PTOEntryDto[];
  pull_request_links: PullRequestLinkDto[];
}

function toUserRef(dto: UserRefDto): DashboardUserRef {
  return {
    id: dto.id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    displayName: dto.display_name,
    initials: getInitials(dto.first_name, dto.last_name, dto.display_name),
  };
}

function toStandupItem(dto: StandupItemDto): DashboardStandupItem {
  return {
    id: dto.id,
    section: dto.section,
    content: dto.content,
    position: dto.position,
  };
}

function toStandup(dto: StandupDto): DashboardStandup {
  return {
    id: dto.id,
    user: toUserRef(dto.user),
    standupDate: dto.standup_date,
    blockers: dto.blockers,
    items: dto.items.map(toStandupItem),
  };
}

function toStandupSummary(dto: StandupSummaryDto): DashboardStandupSummary {
  return {
    totalActiveUsers: dto.total_active_users,
    totalSubmittedStandups: dto.total_submitted_standups,
    usersWhoSubmitted: dto.users_who_submitted.map(toUserRef),
    usersWhoHaveNotSubmitted: dto.users_who_have_not_submitted.map(toUserRef),
  };
}

function toPresenceEntry(dto: PresenceEntryDto): DashboardPresenceEntry {
  return { user: toUserRef(dto.user), lastSeenAt: dto.last_seen_at };
}

function toPresence(dto: PresenceDto): DashboardPresence {
  return {
    online: dto.online.map(toPresenceEntry),
    recentlyActive: dto.recently_active.map(toPresenceEntry),
    offline: dto.offline.map(toPresenceEntry),
  };
}

function toAOBItem(dto: AOBItemDto): DashboardAOBItem {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    externalUrl: dto.external_url,
    weekStart: dto.week_start,
    position: dto.position,
    createdBy: dto.created_by ? toUserRef(dto.created_by) : null,
    createdAt: dto.created_at,
  };
}

function toPTOEntry(dto: PTOEntryDto): DashboardPTOEntry {
  return {
    id: dto.id,
    user: dto.user ? toUserRef(dto.user) : null,
    startDate: dto.start_date,
    endDate: dto.end_date,
    reason: dto.reason,
    handoverUrl: dto.handover_url,
    createdBy: dto.created_by ? toUserRef(dto.created_by) : null,
  };
}

function toPullRequestLink(dto: PullRequestLinkDto): DashboardPullRequestLink {
  return {
    id: dto.id,
    title: dto.title,
    url: dto.url,
    groupName: dto.group_name,
    status: dto.status,
    weekStart: dto.week_start,
    position: dto.position,
    createdBy: dto.created_by ? toUserRef(dto.created_by) : null,
  };
}

function toDashboard(dto: DashboardDto): Dashboard {
  return {
    weekStart: dto.week_start,
    weekEnd: dto.week_end,
    standupSummary: toStandupSummary(dto.standup_summary),
    weeklyStandups: dto.weekly_standups.map(toStandup),
    presence: toPresence(dto.presence),
    aobItems: dto.aob_items.map(toAOBItem),
    ptoEntries: dto.pto_entries.map(toPTOEntry),
    pullRequestLinks: dto.pull_request_links.map(toPullRequestLink),
  };
}

/** GET /dashboard/?week_start=<Monday> — week_start must be validated as a Monday by the caller. */
export async function fetchDashboard(weekStart: string): Promise<Dashboard> {
  const { data } = await apiClient.get<ApiSuccessResponse<DashboardDto>>(
    "/dashboard/",
    { params: { week_start: weekStart } },
  );
  return toDashboard(data.data);
}
