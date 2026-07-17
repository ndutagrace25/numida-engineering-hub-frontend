import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import type { ActivityItem } from "@/types/activity";

export interface RecentActivityCardProps {
  activity: ActivityItem[];
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  return (
    <SectionCard className="sm:col-span-2 lg:col-span-3">
      <SectionCardHeader>
        <SectionCardTitle>Recent Activity</SectionCardTitle>
      </SectionCardHeader>
      <ul className="flex flex-col gap-3">
        {activity.map((item, i) => (
          <li
            key={i}
            className="text-text-body flex items-center gap-2.5 text-[13px]"
          >
            <span
              aria-hidden="true"
              className="bg-primary size-1.5 shrink-0 rounded-full"
            />
            <span className="font-semibold">{item.actor}</span>
            <span>{item.action}</span>
            <span className="text-text-faint ml-auto text-xs">{item.time}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
