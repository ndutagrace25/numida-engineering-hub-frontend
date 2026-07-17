import type {
  HistoryEntry,
  StandupDraft,
  WeeklyStandupRow,
} from "@/types/standups";

/**
 * Mock data mirroring the WEEKLY_BY_OFFSET/HISTORY_ENTRIES constants and
 * the initial `state.standup` draft in the imported design
 * (Standup Hub.dc.html). Not connected to the backend yet.
 */

let nextId = 0;
function makeId() {
  nextId += 1;
  return `draft-item-${nextId}`;
}

/** The current user's (Aisha Nakato) editable standup for this week. */
export function getInitialStandupDraft(): StandupDraft {
  return {
    did: [
      { id: makeId(), text: "Reviewed onboarding PR from Brian" },
      { id: makeId(), text: "Deployed hotfix for disbursement retries" },
    ],
    working: [
      { id: makeId(), text: "Migrating credit scoring to new feature store" },
    ],
    plan: [{ id: makeId(), text: "Write RFC for scoring rollout" }],
    meetings: [{ id: makeId(), text: "Tue 10am — Sprint planning" }],
    blockers: [],
  };
}

export const WEEKLY_BY_OFFSET: Record<number, WeeklyStandupRow[]> = {
  0: [
    {
      name: "Aisha Nakato",
      initials: "AN",
      role: "Backend Engineer",
      did: [
        "Shipped loan-limit recalculation service",
        "Paired with Brian on mobile API contract",
      ],
      working: ["Migrating credit scoring to new feature store"],
      plan: ["Write RFC for scoring rollout"],
      meetings: ["Tue 10am — Sprint planning"],
      blockers: [],
    },
    {
      name: "Brian Okello",
      initials: "BO",
      role: "Frontend Engineer",
      did: ["Refactored onboarding flow UI", "Added skeleton loading states"],
      working: ["Building offline-sync for field agent app"],
      plan: ["Start conflict-resolution UI"],
      meetings: [],
      blockers: [],
    },
    {
      name: "Chidi Umeh",
      initials: "CU",
      role: "Mobile Engineer",
      did: ["Released v4.2 to Play Store beta"],
      working: ["Debugging crash reports from Android 14"],
      plan: ["Ship crash fix"],
      meetings: [],
      blockers: ["Blocked on Play Console review"],
    },
    {
      name: "Diana Kariuki",
      initials: "DK",
      role: "Platform Engineer",
      did: ["Provisioned new staging Postgres cluster"],
      working: ["Writing migration runbook"],
      plan: ["Run migration Thursday"],
      meetings: ["Thu 2pm — DB migration"],
      blockers: [],
    },
    {
      name: "Ethan Mensah",
      initials: "EM",
      role: "Backend Engineer",
      did: ["Fixed race condition in disbursement queue"],
      working: ["Load-testing payments API"],
      plan: ["Write postmortem"],
      meetings: [],
      blockers: [],
    },
    {
      name: "Farah Ali",
      initials: "FA",
      role: "QA Engineer",
      did: ["Wrote regression suite for loan limits"],
      working: ["Automating mobile smoke tests"],
      plan: ["Review Chidi's crash fix"],
      meetings: [],
      blockers: [],
    },
    {
      name: "Grace Wanjiru",
      initials: "GW",
      role: "Engineering Manager",
      did: ["Ran sprint retro", "Reviewed Q3 roadmap with leadership"],
      working: ["Planning eng offsite"],
      plan: ["Finalize offsite budget"],
      meetings: ["Mon 9am — Leadership sync"],
      blockers: [],
    },
  ],
  1: [
    {
      name: "Aisha Nakato",
      initials: "AN",
      role: "Backend Engineer",
      did: ["Fixed flaky test in loan-engine CI"],
      working: ["Investigating latency spike in disbursement API"],
      plan: [],
      meetings: [],
      blockers: ["Waiting on infra to provision staging DB"],
    },
    {
      name: "Brian Okello",
      initials: "BO",
      role: "Frontend Engineer",
      did: ["Shipped design-token v2 migration"],
      working: ["Onboarding flow redesign"],
      plan: [],
      meetings: [],
      blockers: [],
    },
    {
      name: "Chidi Umeh",
      initials: "CU",
      role: "Mobile Engineer",
      did: ["Triaged Android 14 crash reports"],
      working: ["Root-causing crash"],
      plan: [],
      meetings: [],
      blockers: [],
    },
    {
      name: "Grace Wanjiru",
      initials: "GW",
      role: "Engineering Manager",
      did: ["Ran sprint retro"],
      working: ["Q3 roadmap"],
      plan: [],
      meetings: [],
      blockers: [],
    },
  ],
};

export const WEEK_LABELS: Record<number, string> = {
  0: "Jul 14–18, 2026",
  1: "Jul 7–11, 2026",
};

export const HISTORY_ENTRIES: HistoryEntry[] = [
  {
    engineer: "Aisha Nakato",
    initials: "AN",
    week: "Week 29",
    range: "Jul 14–18",
    month: "Jul 2026",
    did: [
      "Shipped loan-limit recalculation service",
      "Paired with Brian on mobile API contract",
    ],
    working: ["Migrating credit scoring to new feature store"],
    blockers: [],
  },
  {
    engineer: "Aisha Nakato",
    initials: "AN",
    week: "Week 28",
    range: "Jul 7–11",
    month: "Jul 2026",
    did: ["Fixed flaky test in loan-engine CI"],
    working: ["Investigating latency spike in disbursement API"],
    blockers: ["Waiting on infra to provision staging DB"],
  },
  {
    engineer: "Brian Okello",
    initials: "BO",
    week: "Week 29",
    range: "Jul 14–18",
    month: "Jul 2026",
    did: ["Refactored onboarding flow UI", "Added skeleton loading states"],
    working: ["Building offline-sync for field agent app"],
    blockers: [],
  },
  {
    engineer: "Chidi Umeh",
    initials: "CU",
    week: "Week 29",
    range: "Jul 14–18",
    month: "Jul 2026",
    did: ["Released v4.2 to Play Store beta"],
    working: ["Debugging crash reports from Android 14"],
    blockers: ["Blocked on Play Console review"],
  },
  {
    engineer: "Grace Wanjiru",
    initials: "GW",
    week: "Week 28",
    range: "Jul 7–11",
    month: "Jul 2026",
    did: ["Ran sprint retro", "Reviewed Q3 roadmap with leadership"],
    working: ["Planning eng offsite"],
    blockers: [],
  },
  {
    engineer: "Aisha Nakato",
    initials: "AN",
    week: "Week 27",
    range: "Jun 30–Jul 4",
    month: "Jun 2026",
    did: ["Completed KYC service audit"],
    working: ["Started loan-limit recalculation design"],
    blockers: [],
  },
];
