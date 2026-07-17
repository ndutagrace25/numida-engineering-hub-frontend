import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import {
  StatusBadge,
  pullRequestStatusTone,
} from "@/components/ui/status-badge";
import type { PullRequestGroup } from "@/types/pull-requests";

export interface PRPreviewCardProps {
  groups: PullRequestGroup[];
}

/** The dashboard's "Outstanding Pull Requests" preview: first 3 PRs across all repos. */
export function PRPreviewCard({ groups }: PRPreviewCardProps) {
  const preview = groups.flatMap((g) => g.prs).slice(0, 3);

  return (
    <DashboardWidgetCard
      title="Outstanding Pull Requests"
      viewAllHref="/pull-requests"
    >
      <div className="flex flex-col gap-2.5">
        {preview.map((pr) => (
          <div key={pr.number} className="flex items-center gap-2">
            <div className="flex-1 truncate text-[13px]">{pr.title}</div>
            <StatusBadge tone={pullRequestStatusTone(pr.status)}>
              {pr.status}
            </StatusBadge>
          </div>
        ))}
      </div>
    </DashboardWidgetCard>
  );
}
