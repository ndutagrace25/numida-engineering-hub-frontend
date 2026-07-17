import type { UserRef } from "@/types/user-ref";

export type StandupSection =
  "did" | "working" | "plan" | "meetings" | "blockers";

export interface StandupItemEntry {
  id: string;
  text: string;
}

/**
 * The real backend's item section enum (apps.standups.models.StandupItem.
 * Section) — distinct from StandupSection above, which is this form's own
 * draft-state keys. Only COMPLETED/CURRENT/PLANNED are required; MEETING
 * is optional. There is no "blockers" section — that's a single free-text
 * field on the Standup itself (see Standup.blockers below).
 */
export type StandupItemSection =
  "COMPLETED" | "CURRENT" | "PLANNED" | "MEETING";

export interface StandupItem {
  id: number;
  section: StandupItemSection;
  content: string;
  position: number;
}

/** A single day's/week's standup as returned by the backend. */
export interface Standup {
  id: number;
  user: UserRef;
  standupDate: string;
  blockers: string;
  items: StandupItem[];
}

/** The authenticated user's own editable standup for the current week. */
export interface StandupDraft {
  did: StandupItemEntry[];
  working: StandupItemEntry[];
  plan: StandupItemEntry[];
  meetings: StandupItemEntry[];
  blockers: StandupItemEntry[];
}

/** One engineer's row in the team weekly view. */
export interface WeeklyStandupRow {
  name: string;
  initials: string;
  role: string;
  did: string[];
  working: string[];
  plan: string[];
  meetings: string[];
  blockers: string[];
}

/** One entry in My History / Team History. */
export interface HistoryEntry {
  engineer: string;
  initials: string;
  week: string;
  range: string;
  month: string;
  did: string[];
  working: string[];
  blockers: string[];
}
