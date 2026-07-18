import type { AOBItem } from "@/types/aob";
import type { PullRequestLink } from "@/types/pull-requests";
import type { Standup } from "@/types/standups";
import type { PTOEntry } from "@/types/pto";
import type { UserRef } from "@/types/user-ref";

/**
 * Domain types for GET /dashboard/, normalized from the backend's
 * snake_case response (see apps/dashboard/serializers.py). `role` never
 * appears anywhere here — the backend's User model has no such field.
 */

/** @deprecated import UserRef from "@/types/user-ref" directly. */
export type DashboardUserRef = UserRef;

/** @deprecated import Standup from "@/types/standups" directly. */
export type DashboardStandup = Standup;

export interface DashboardStandupSummary {
  totalActiveUsers: number;
  totalSubmittedStandups: number;
  usersWhoSubmitted: UserRef[];
  usersWhoHaveNotSubmitted: UserRef[];
}

export type PresenceStatus = "ONLINE" | "RECENTLY_ACTIVE" | "OFFLINE";

export interface DashboardPresenceEntry {
  user: UserRef;
  lastSeenAt: string | null;
}

export interface DashboardPresence {
  online: DashboardPresenceEntry[];
  recentlyActive: DashboardPresenceEntry[];
  offline: DashboardPresenceEntry[];
}

/** @deprecated import AOBItem from "@/types/aob" directly. */
export type DashboardAOBItem = AOBItem;

/** @deprecated import PTOEntry from "@/types/pto" directly. */
export type DashboardPTOEntry = PTOEntry;

/** @deprecated import PullRequestLinkStatus from "@/types/pull-requests" directly. */
export type DashboardPullRequestStatus = PullRequestLink["status"];

/** @deprecated import PullRequestLink from "@/types/pull-requests" directly. */
export type DashboardPullRequestLink = PullRequestLink;

export interface Dashboard {
  weekStart: string;
  weekEnd: string;
  standupSummary: DashboardStandupSummary;
  weeklyStandups: DashboardStandup[];
  presence: DashboardPresence;
  aobItems: DashboardAOBItem[];
  ptoEntries: DashboardPTOEntry[];
  pullRequestLinks: DashboardPullRequestLink[];
}
