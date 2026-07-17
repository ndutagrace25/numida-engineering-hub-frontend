import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import type { DashboardStandupSummary } from "@/types/dashboard";

export interface WeeklyProgressCardProps {
  summary: DashboardStandupSummary;
}

/**
 * The dashboard's "Weekly Standups" progress widget: a completion bar
 * plus every active engineer's avatar, highlighted if they've submitted.
 * Links to the team weekly view — the design's own prototype wires this
 * card's "Team view →" link to team history instead, but the fully-built
 * "Team weekly view" screen has no other way to reach it, so this links
 * there instead (see the report).
 */
export function WeeklyProgressCard({ summary }: WeeklyProgressCardProps) {
  const { totalActiveUsers, totalSubmittedStandups } = summary;
  const pct =
    totalActiveUsers === 0
      ? 0
      : Math.round((totalSubmittedStandups / totalActiveUsers) * 100);

  return (
    <DashboardWidgetCard
      title="Weekly Standups"
      viewAllHref="/standups/weekly"
      viewAllLabel="Team view →"
    >
      <div
        className="bg-muted mb-2.5 h-2 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Standups submitted this week"
      >
        <div className="bg-primary h-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {summary.usersWhoSubmitted.map((user) => (
          <div
            key={user.id}
            title={user.displayName}
            className="bg-muted text-text-icon border-primary flex size-[26px] items-center justify-center rounded-full border-2 text-[10px] font-bold"
          >
            {user.initials}
          </div>
        ))}
        {summary.usersWhoHaveNotSubmitted.map((user) => (
          <div
            key={user.id}
            title={user.displayName}
            className="bg-muted text-text-icon border-border flex size-[26px] items-center justify-center rounded-full border-2 text-[10px] font-bold"
          >
            {user.initials}
          </div>
        ))}
      </div>
    </DashboardWidgetCard>
  );
}
