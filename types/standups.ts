export type StandupSection =
  "did" | "working" | "plan" | "meetings" | "blockers";

export interface StandupItemEntry {
  id: string;
  text: string;
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
