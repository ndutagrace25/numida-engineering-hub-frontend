import type { PullRequestGroup } from "@/types/pull-requests";

/**
 * Mock data mirroring the PR_GROUPS constant in the imported design
 * (Standup Hub.dc.html). Not connected to the backend yet.
 */
export const PR_GROUPS: PullRequestGroup[] = [
  {
    repo: "numida-core",
    prs: [
      {
        number: 482,
        title: "Add recalculation job for loan limits",
        author: "Aisha Nakato",
        status: "In review",
        updated: "2h ago",
      },
      {
        number: 479,
        title: "Fix race condition in disbursement queue",
        author: "Ethan Mensah",
        status: "Changes requested",
        updated: "1d ago",
      },
    ],
  },
  {
    repo: "mobile-app",
    prs: [
      {
        number: 213,
        title: "Offline sync for field agent forms",
        author: "Brian Okello",
        status: "Open",
        updated: "5h ago",
      },
      {
        number: 210,
        title: "Bump Android target SDK to 34",
        author: "Chidi Umeh",
        status: "Merged",
        updated: "2d ago",
      },
    ],
  },
  {
    repo: "credit-scoring-service",
    prs: [
      {
        number: 97,
        title: "Migrate features to new feature store",
        author: "Aisha Nakato",
        status: "Draft",
        updated: "3d ago",
      },
    ],
  },
];
