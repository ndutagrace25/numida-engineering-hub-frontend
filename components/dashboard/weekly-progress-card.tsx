import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import { cn } from "@/lib/utils";
import { ENGINEERS, SUBMITTED } from "@/lib/fixtures/engineers";

export interface WeeklyProgressCardProps {
  submittedCount: number;
  totalCount: number;
}

/**
 * The dashboard's "Weekly Standups" progress widget: a completion bar
 * plus every engineer's avatar, highlighted if they've submitted. Links
 * to the team weekly view — the design's own prototype wires this card's
 * "Team view →" link to team history instead, but the fully-built
 * "Team weekly view" screen has no other way to reach it, so this links
 * there instead (see the report).
 */
export function WeeklyProgressCard({
  submittedCount,
  totalCount,
}: WeeklyProgressCardProps) {
  const pct = Math.round((submittedCount / totalCount) * 100);

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
      <div className="flex gap-1.5">
        {ENGINEERS.map((e) => (
          <div
            key={e.name}
            title={e.name}
            className={cn(
              "bg-muted text-text-icon flex size-[26px] items-center justify-center rounded-full border-2 text-[10px] font-bold",
              SUBMITTED[e.name] ? "border-primary" : "border-border",
            )}
          >
            {e.initials}
          </div>
        ))}
      </div>
    </DashboardWidgetCard>
  );
}
