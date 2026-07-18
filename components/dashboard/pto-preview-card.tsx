import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import { formatDateRange } from "@/lib/format-date";
import type { DashboardPTOEntry } from "@/types/dashboard";

export interface PTOPreviewCardProps {
  entries: DashboardPTOEntry[];
}

export function PTOPreviewCard({ entries }: PTOPreviewCardProps) {
  return (
    <DashboardWidgetCard title="Upcoming PTO" viewAllHref="/pto">
      {entries.length === 0 ? (
        <p className="text-muted-foreground text-[13px]">No upcoming PTO.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="text-[13px] font-medium">
                {entry.user?.displayName ?? "Unknown"}
              </div>
              <div className="text-muted-foreground text-xs">
                {formatDateRange(entry.startDate, entry.endDate)}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardWidgetCard>
  );
}
