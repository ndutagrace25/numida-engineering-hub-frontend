import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PullRequestLinkStatus } from "@/types/pull-requests";

export type StatusBadgeTone =
  "open" | "in-review" | "changes-requested" | "merged" | "draft";

const TONE_CLASS: Record<StatusBadgeTone, string> = {
  open: "bg-status-open-bg text-status-open-fg",
  "in-review": "bg-status-in-review-bg text-status-in-review-fg",
  "changes-requested":
    "bg-status-changes-requested-bg text-status-changes-requested-fg",
  merged: "bg-status-merged-bg text-status-merged-fg",
  draft: "bg-status-draft-bg text-status-draft-fg",
};

/**
 * The real backend's PullRequestLink.Status enum has no "Merged"/"Draft"
 * (never appeared in the design) but does have "Approved"/"Blocked" (no
 * design tone exists for either) — mapped onto the closest existing tone
 * rather than inventing new colors: Approved reuses the positive/terminal
 * "merged" tone, Blocked reuses the attention-needed "changes-requested" one.
 */
const BACKEND_PR_STATUS: Record<
  PullRequestLinkStatus,
  { label: string; tone: StatusBadgeTone }
> = {
  OPEN: { label: "Open", tone: "open" },
  IN_REVIEW: { label: "In review", tone: "in-review" },
  CHANGES_REQUESTED: { label: "Changes requested", tone: "changes-requested" },
  APPROVED: { label: "Approved", tone: "merged" },
  BLOCKED: { label: "Blocked", tone: "changes-requested" },
};

export function backendPullRequestStatus(status: PullRequestLinkStatus) {
  return BACKEND_PR_STATUS[status];
}

export interface StatusBadgeProps {
  tone: StatusBadgeTone;
  children: React.ReactNode;
  className?: string;
}

/** The small pill-shaped status label used for PR statuses and PTO status. */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </Badge>
  );
}
