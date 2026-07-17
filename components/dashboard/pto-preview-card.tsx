import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import type { PTOEntry } from "@/types/pto";

export interface PTOPreviewCardProps {
  entries: PTOEntry[];
}

export function PTOPreviewCard({ entries }: PTOPreviewCardProps) {
  return (
    <DashboardWidgetCard title="Upcoming PTO" viewAllHref="/pto">
      <div className="flex flex-col gap-2.5">
        {entries.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-2">
            <div className="text-[13px] font-medium">{p.name}</div>
            <div className="text-muted-foreground text-xs">{p.range}</div>
          </div>
        ))}
      </div>
    </DashboardWidgetCard>
  );
}
