import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import { formatShortDate } from "@/lib/format-date";
import type { DashboardAOBItem } from "@/types/dashboard";

export interface AOBPreviewCardProps {
  items: DashboardAOBItem[];
}

export function AOBPreviewCard({ items }: AOBPreviewCardProps) {
  return (
    <DashboardWidgetCard
      title="AOB"
      viewAllHref="/aob"
      viewAllLabel="All posts →"
    >
      {items.length === 0 ? (
        <p className="text-muted-foreground text-[13px]">
          Nothing raised for this week yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id}>
              <div className="text-[13px] font-semibold">{item.title}</div>
              <div className="text-muted-foreground mt-0.5 text-xs">
                {item.createdBy?.displayName ?? "Unknown"} ·{" "}
                {formatShortDate(item.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardWidgetCard>
  );
}
