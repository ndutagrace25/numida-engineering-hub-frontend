import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PullRequestStatus } from "@/types/pull-requests";

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

const PR_STATUS_TONE: Record<PullRequestStatus, StatusBadgeTone> = {
  Open: "open",
  "In review": "in-review",
  "Changes requested": "changes-requested",
  Merged: "merged",
  Draft: "draft",
};

export function pullRequestStatusTone(
  status: PullRequestStatus,
): StatusBadgeTone {
  return PR_STATUS_TONE[status];
}

export interface StatusBadgeProps {
  tone: StatusBadgeTone;
  children: React.ReactNode;
  className?: string;
}

/** The small pill-shaped status label used for PR statuses, PTO status, and AOB tags. */
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
