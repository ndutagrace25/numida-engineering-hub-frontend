import type { PTOEntry } from "@/types/pto";

/**
 * Mock data mirroring the PTO_LIST constant in the imported design
 * (Standup Hub.dc.html). Not connected to the backend yet.
 */
export const PTO_LIST: PTOEntry[] = [
  {
    id: "pto-1",
    name: "Diana Kariuki",
    initials: "DK",
    range: "Jul 21 – Jul 25",
    days: 5,
    status: "Upcoming",
    handoverTo: "Ethan Mensah",
  },
  {
    id: "pto-2",
    name: "Farah Ali",
    initials: "FA",
    range: "Jul 17 – Jul 18",
    days: 2,
    status: "Upcoming",
    handoverTo: "Grace Wanjiru",
  },
  {
    id: "pto-3",
    name: "Grace Wanjiru",
    initials: "GW",
    range: "Aug 3 – Aug 14",
    days: 10,
    status: "Upcoming",
    handoverTo: "Brian Okello",
  },
];
