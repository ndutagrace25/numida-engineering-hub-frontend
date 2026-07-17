import type { Engineer } from "@/types/engineer";

/**
 * Mock data mirroring the ENGINEERS/SUBMITTED constants in the imported
 * design (Standup Hub.dc.html). Not connected to the backend yet.
 */
export const ENGINEERS: Engineer[] = [
  {
    name: "Aisha Nakato",
    initials: "AN",
    role: "Backend Engineer",
    status: "online",
  },
  {
    name: "Brian Okello",
    initials: "BO",
    role: "Frontend Engineer",
    status: "online",
  },
  {
    name: "Chidi Umeh",
    initials: "CU",
    role: "Mobile Engineer",
    status: "away",
  },
  {
    name: "Diana Kariuki",
    initials: "DK",
    role: "Platform Engineer",
    status: "offline",
  },
  {
    name: "Ethan Mensah",
    initials: "EM",
    role: "Backend Engineer",
    status: "online",
  },
  { name: "Farah Ali", initials: "FA", role: "QA Engineer", status: "offline" },
  {
    name: "Grace Wanjiru",
    initials: "GW",
    role: "Engineering Manager",
    status: "away",
  },
];

/** Whether each engineer has submitted their standup for the current week. */
export const SUBMITTED: Record<string, boolean> = {
  "Aisha Nakato": true,
  "Brian Okello": true,
  "Chidi Umeh": true,
  "Diana Kariuki": false,
  "Ethan Mensah": true,
  "Farah Ali": false,
  "Grace Wanjiru": true,
};

/** The mock signed-in user throughout this phase (no real auth yet). */
export const CURRENT_USER: Engineer = ENGINEERS[0];
