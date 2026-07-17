/**
 * Domain types for GET /dashboard/, normalized from the backend's
 * snake_case response (see apps/dashboard/serializers.py). `role` never
 * appears anywhere here — the backend's User model has no such field.
 */

export interface DashboardUserRef {
  id: number;
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
}

export type StandupSection = "COMPLETED" | "CURRENT" | "PLANNED" | "MEETING";

export interface DashboardStandupItem {
  id: number;
  section: StandupSection;
  content: string;
  position: number;
}

/** blockers is a single free-text field on the standup itself, not an itemized section. */
export interface DashboardStandup {
  id: number;
  user: DashboardUserRef;
  standupDate: string;
  blockers: string;
  items: DashboardStandupItem[];
}

export interface DashboardStandupSummary {
  totalActiveUsers: number;
  totalSubmittedStandups: number;
  usersWhoSubmitted: DashboardUserRef[];
  usersWhoHaveNotSubmitted: DashboardUserRef[];
}

export type PresenceStatus = "ONLINE" | "RECENTLY_ACTIVE" | "OFFLINE";

export interface DashboardPresenceEntry {
  user: DashboardUserRef;
  lastSeenAt: string | null;
}

export interface DashboardPresence {
  online: DashboardPresenceEntry[];
  recentlyActive: DashboardPresenceEntry[];
  offline: DashboardPresenceEntry[];
}

/** No "tag"/category field exists on the backend's AOBItem model. */
export interface DashboardAOBItem {
  id: number;
  title: string;
  description: string;
  externalUrl: string | null;
  weekStart: string;
  position: number;
  createdBy: DashboardUserRef | null;
  createdAt: string;
}

export interface DashboardPTOEntry {
  id: number;
  user: DashboardUserRef | null;
  startDate: string;
  endDate: string;
  reason: string;
  handoverUrl: string | null;
  createdBy: DashboardUserRef | null;
}

/** Differs from the mock fixture's status strings — no Merged/Draft, has Approved/Blocked instead. */
export type DashboardPullRequestStatus =
  "OPEN" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "BLOCKED";

/** No PR "number" field — link out via `url` instead. */
export interface DashboardPullRequestLink {
  id: number;
  title: string;
  url: string;
  groupName: string;
  status: DashboardPullRequestStatus;
  weekStart: string;
  position: number;
  createdBy: DashboardUserRef | null;
}

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
