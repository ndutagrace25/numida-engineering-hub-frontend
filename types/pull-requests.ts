import type { UserRef } from "@/types/user-ref";

/** Differs from the design's mock statuses — no Merged/Draft, has Approved/Blocked instead. */
export type PullRequestLinkStatus =
  "OPEN" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "BLOCKED";

/** No PR "number" field — link out via `url` instead. */
export interface PullRequestLink {
  id: number;
  title: string;
  url: string;
  groupName: string;
  status: PullRequestLinkStatus;
  weekStart: string;
  position: number;
  createdBy: UserRef | null;
  createdAt: string;
}
