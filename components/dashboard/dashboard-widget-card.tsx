import Link from "next/link";

import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import { cn } from "@/lib/utils";

export interface DashboardWidgetCardProps {
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
  /** Hide the header link entirely — e.g. when there's nothing more to view. */
  showViewAll?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** The title + "X →" link header pattern shared by most dashboard widgets. */
export function DashboardWidgetCard({
  title,
  viewAllHref,
  viewAllLabel = "All →",
  showViewAll = true,
  className,
  children,
}: DashboardWidgetCardProps) {
  return (
    <SectionCard className={cn(className)}>
      <SectionCardHeader>
        <SectionCardTitle>{title}</SectionCardTitle>
        {showViewAll && (
          <Link
            href={viewAllHref}
            className="focus-visible:ring-ring text-muted-foreground hover:text-foreground rounded text-[12.5px] focus-visible:ring-2 focus-visible:outline-none"
          >
            {viewAllLabel}
          </Link>
        )}
      </SectionCardHeader>
      {children}
    </SectionCard>
  );
}
