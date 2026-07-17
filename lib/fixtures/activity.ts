import type { ActivityItem } from "@/types/activity";

/**
 * Mock data mirroring the ACTIVITY constant in the imported design
 * (Standup Hub.dc.html). Not connected to the backend yet.
 */
export const ACTIVITY: ActivityItem[] = [
  { actor: "Brian Okello", action: "submitted their standup", time: "9:12 AM" },
  {
    actor: "Chidi Umeh",
    action: "opened PR #213 in mobile-app",
    time: "8:47 AM",
  },
  { actor: "Grace Wanjiru", action: "posted an AOB update", time: "Yesterday" },
  {
    actor: "Ethan Mensah",
    action: "requested PTO for Jul 21–25",
    time: "Yesterday",
  },
];
