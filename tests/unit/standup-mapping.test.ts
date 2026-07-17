import { describe, expect, it } from "vitest";

import {
  draftToStandupInput,
  standupToDraft,
  standupToHistoryEntry,
  standupToWeeklyRow,
} from "@/components/standups/standup-mapping";
import type { Standup, StandupDraft } from "@/types/standups";

const baseStandup: Standup = {
  id: 10,
  user: {
    id: 100,
    firstName: "Aisha",
    lastName: "Nakato",
    displayName: "Aisha Nakato",
    initials: "AN",
  },
  standupDate: "2026-07-13",
  blockers: "Waiting on infra\nBlocked on design review",
  items: [
    { id: 1, section: "CURRENT", content: "Migrating the store", position: 0 },
    { id: 2, section: "COMPLETED", content: "Shipped the thing", position: 0 },
    { id: 3, section: "PLANNED", content: "Write the RFC", position: 0 },
  ],
};

describe("standupToDraft", () => {
  it("groups items by section and splits blockers into separate lines", () => {
    const draft = standupToDraft(baseStandup);

    expect(draft.did).toEqual([
      { id: "COMPLETED-0", text: "Shipped the thing" },
    ]);
    expect(draft.working).toEqual([
      { id: "CURRENT-0", text: "Migrating the store" },
    ]);
    expect(draft.plan).toEqual([{ id: "PLANNED-0", text: "Write the RFC" }]);
    expect(draft.meetings).toEqual([]);
    expect(draft.blockers).toEqual([
      { id: "blocker-0", text: "Waiting on infra" },
      { id: "blocker-1", text: "Blocked on design review" },
    ]);
  });

  it("returns an empty blockers array when blockers is an empty string", () => {
    const draft = standupToDraft({ ...baseStandup, blockers: "" });
    expect(draft.blockers).toEqual([]);
  });

  it("preserves item ordering by position within a section", () => {
    const standup: Standup = {
      ...baseStandup,
      items: [
        { id: 1, section: "COMPLETED", content: "second", position: 1 },
        { id: 2, section: "COMPLETED", content: "first", position: 0 },
      ],
    };
    const draft = standupToDraft(standup);
    expect(draft.did.map((i) => i.text)).toEqual(["first", "second"]);
  });
});

describe("draftToStandupInput", () => {
  it("maps each draft section onto its backend section with positions from array order", () => {
    const draft: StandupDraft = {
      did: [{ id: "a", text: "Did one" }],
      working: [{ id: "b", text: "Working one" }],
      plan: [
        { id: "c", text: "Plan one" },
        { id: "d", text: "Plan two" },
      ],
      meetings: [],
      blockers: [
        { id: "e", text: "Blocker one" },
        { id: "f", text: "Blocker two" },
      ],
    };

    const input = draftToStandupInput(draft);

    expect(input.items).toEqual([
      { section: "COMPLETED", content: "Did one", position: 0 },
      { section: "CURRENT", content: "Working one", position: 0 },
      { section: "PLANNED", content: "Plan one", position: 0 },
      { section: "PLANNED", content: "Plan two", position: 1 },
    ]);
    expect(input.blockers).toBe("Blocker one\nBlocker two");
  });

  it("produces an empty blockers string when there are no blocker entries", () => {
    const input = draftToStandupInput({
      did: [],
      working: [],
      plan: [],
      meetings: [],
      blockers: [],
    });
    expect(input.blockers).toBe("");
    expect(input.items).toEqual([]);
  });
});

describe("standupToWeeklyRow", () => {
  it("maps a standup onto the weekly card's row shape with an empty role", () => {
    const row = standupToWeeklyRow(baseStandup);

    expect(row.name).toBe("Aisha Nakato");
    expect(row.initials).toBe("AN");
    expect(row.role).toBe("");
    expect(row.did).toEqual(["Shipped the thing"]);
    expect(row.working).toEqual(["Migrating the store"]);
    expect(row.plan).toEqual(["Write the RFC"]);
    expect(row.meetings).toEqual([]);
  });

  it("wraps a non-empty blockers string as a single-item array", () => {
    const row = standupToWeeklyRow(baseStandup);
    expect(row.blockers).toEqual([
      "Waiting on infra\nBlocked on design review",
    ]);
  });

  it("returns an empty blockers array when there are none", () => {
    const row = standupToWeeklyRow({ ...baseStandup, blockers: "" });
    expect(row.blockers).toEqual([]);
  });
});

describe("standupToHistoryEntry", () => {
  it("derives week/range/month labels from the standup's date", () => {
    const entry = standupToHistoryEntry(baseStandup);

    expect(entry.engineer).toBe("Aisha Nakato");
    expect(entry.week).toBe("Week of Jul 13");
    expect(entry.range).toBe("Jul 13–19");
    expect(entry.month).toBe("July 2026");
    expect(entry.did).toEqual(["Shipped the thing"]);
    expect(entry.working).toEqual(["Migrating the store"]);
  });
});
