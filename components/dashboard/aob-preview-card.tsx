import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import { formatShortDate } from "@/lib/format-date";
import type { AOBItem } from "@/types/aob";

export interface AOBPreviewCardProps {
  /** Already the latest 3 — the caller decides how many to fetch. */
  items: AOBItem[];
  /** Whether more items exist beyond the ones shown here. */
  hasMore: boolean;
}

export function AOBPreviewCard({ items, hasMore }: AOBPreviewCardProps) {
  return (
    <DashboardWidgetCard
      title="AOB"
      viewAllHref="/aob"
      viewAllLabel="View more →"
      showViewAll={hasMore}
    >
      {items.length === 0 ? (
        <p className="text-muted-foreground text-[13px]">Nothing raised yet.</p>
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
