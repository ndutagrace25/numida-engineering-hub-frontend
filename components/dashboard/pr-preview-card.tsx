import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import {
  StatusBadge,
  backendPullRequestStatus,
} from "@/components/ui/status-badge";
import type { PullRequestLink } from "@/types/pull-requests";

export interface PRPreviewCardProps {
  links: PullRequestLink[];
}

/** The dashboard's "Outstanding Pull Requests" preview: first 3 PR links for the week. */
export function PRPreviewCard({ links }: PRPreviewCardProps) {
  const preview = links.slice(0, 3);

  return (
    <DashboardWidgetCard
      title="Outstanding Pull Requests"
      viewAllHref="/pull-requests"
    >
      {preview.length === 0 ? (
        <p className="text-muted-foreground text-[13px]">
          No pull requests shared for this week.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {preview.map((pr) => {
            const status = backendPullRequestStatus(pr.status);
            return (
              <div key={pr.id} className="flex items-center gap-2">
                <div className="flex-1 truncate text-[13px]">{pr.title}</div>
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </div>
            );
          })}
        </div>
      )}
    </DashboardWidgetCard>
  );
}
