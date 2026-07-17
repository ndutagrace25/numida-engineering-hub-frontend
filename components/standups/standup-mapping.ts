import { formatShortDate, MONTH_LABELS_FULL } from "@/lib/format-date";
import { formatWeekRangeLabel, shiftWeek } from "@/lib/week";
import type { StandupItemInput } from "@/lib/api/standups";
import type {
  HistoryEntry,
  Standup,
  StandupDraft,
  StandupItemSection,
  WeeklyStandupRow,
} from "@/types/standups";

const DRAFT_SECTION_TO_BACKEND: Record<
  "did" | "working" | "plan" | "meetings",
  StandupItemSection
> = {
  did: "COMPLETED",
  working: "CURRENT",
  plan: "PLANNED",
  meetings: "MEETING",
};

/** A blank draft — no existing standup for this week yet. */
export const EMPTY_STANDUP_DRAFT: StandupDraft = {
  did: [],
  working: [],
  plan: [],
  meetings: [],
  blockers: [],
};

function itemContentsBySection(
  standup: Standup,
  section: StandupItemSection,
): string[] {
  return standup.items
    .filter((item) => item.section === section)
    .sort((a, b) => a.position - b.position)
    .map((item) => item.content);
}

/**
 * Maps a real backend Standup onto the form's local draft shape. Blockers
 * is a single free-text field on the backend — split on newlines here so
 * it can still use the same bullet-list editor as the other sections;
 * draftToStandupInput() joins it back on submit.
 */
export function standupToDraft(standup: Standup): StandupDraft {
  const bySection = (section: StandupItemSection) =>
    itemContentsBySection(standup, section).map((text, index) => ({
      id: `${section}-${index}`,
      text,
    }));

  return {
    did: bySection("COMPLETED"),
    working: bySection("CURRENT"),
    plan: bySection("PLANNED"),
    meetings: bySection("MEETING"),
    blockers: standup.blockers
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text, index) => ({ id: `blocker-${index}`, text })),
  };
}

/**
 * Maps a Standup onto WeeklyStandupCard's row shape (used by both the
 * team weekly view and history) — `role` is always "" (the backend has no
 * role field; WeeklyStandupCard only renders that line when non-empty),
 * and `blockers` (a single free-text field) becomes a one-item array when
 * non-empty so the existing bullet-rendering markup needs no changes.
 */
export function standupToWeeklyRow(standup: Standup): WeeklyStandupRow {
  return {
    name: standup.user.displayName,
    initials: standup.user.initials,
    role: "",
    did: itemContentsBySection(standup, "COMPLETED"),
    working: itemContentsBySection(standup, "CURRENT"),
    plan: itemContentsBySection(standup, "PLANNED"),
    meetings: itemContentsBySection(standup, "MEETING"),
    blockers: standup.blockers ? [standup.blockers] : [],
  };
}

/**
 * Maps a Standup onto one History row. Per the app's convention, a
 * standup's `standupDate` is that week's Monday, so it doubles as the
 * week's identity for grouping/labeling here.
 */
export function standupToHistoryEntry(standup: Standup): HistoryEntry {
  const monday = standup.standupDate;
  const sunday = shiftWeek(monday, 6);
  const [year, month] = monday.split("-").map(Number);

  return {
    engineer: standup.user.displayName,
    initials: standup.user.initials,
    week: `Week of ${formatShortDate(monday)}`,
    range: formatWeekRangeLabel(monday, sunday),
    month: `${MONTH_LABELS_FULL[month - 1]} ${year}`,
    did: itemContentsBySection(standup, "COMPLETED"),
    working: itemContentsBySection(standup, "CURRENT"),
    blockers: standup.blockers ? [standup.blockers] : [],
  };
}

export function draftToStandupInput(draft: StandupDraft): {
  blockers: string;
  items: StandupItemInput[];
} {
  const items: StandupItemInput[] = (
    ["did", "working", "plan", "meetings"] as const
  ).flatMap((key) =>
    draft[key].map((entry, position) => ({
      section: DRAFT_SECTION_TO_BACKEND[key],
      content: entry.text,
      position,
    })),
  );

  return {
    blockers: draft.blockers.map((entry) => entry.text).join("\n"),
    items,
  };
}
