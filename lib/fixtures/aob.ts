import type { AOBPost } from "@/types/aob";

/**
 * Mock data mirroring the AOB_POSTS constant in the imported design
 * (Standup Hub.dc.html). Not connected to the backend yet.
 */
export const AOB_POSTS: AOBPost[] = [
  {
    id: "aob-1",
    author: "Grace Wanjiru",
    initials: "GW",
    date: "Jul 15",
    tag: "Process",
    title: "New PR review SLA: 24 hours",
    body: 'Starting this sprint, please review teammates’ PRs within one business day. Use the "needs review" GitHub label to flag blockers.',
  },
  {
    id: "aob-2",
    author: "Ethan Mensah",
    initials: "EM",
    date: "Jul 14",
    tag: "Infra",
    title: "Staging DB migration this Thursday",
    body: "Staging will be read-only from 2–4 PM EAT while we migrate to the new Postgres cluster. Plan demos accordingly.",
  },
  {
    id: "aob-3",
    author: "Brian Okello",
    initials: "BO",
    date: "Jul 10",
    tag: "Engineering",
    title: "Deprecating the old design tokens package",
    body: "@numida/tokens-v1 will stop receiving updates Aug 1. Migrate to tokens-v2 — migration guide in the wiki.",
  },
];
