import Link from "next/link";

import { ProfileAvatar } from "@/components/ui/profile-avatar";
import type { DashboardPresenceEntry } from "@/types/dashboard";

export interface OnlineListProps {
  entries: DashboardPresenceEntry[];
}

/** The "Who's Online" preview list shown on the dashboard. */
export function OnlineList({ entries }: OnlineListProps) {
  return (
    <div className="flex flex-col gap-3">
      {entries.length === 0 ? (
        <p className="text-muted-foreground text-[13px]">
          No one&apos;s online right now.
        </p>
      ) : (
        entries.map((entry) => (
          <div key={entry.user.id} className="flex items-center gap-2.5">
            <ProfileAvatar initials={entry.user.initials} presence="online" />
            <div className="text-text-body text-[13px]">
              {entry.user.displayName}
            </div>
          </div>
        ))
      )}
      <Link
        href="/standups/history?tab=team"
        className="focus-visible:ring-ring text-muted-foreground hover:text-foreground mt-0.5 rounded text-[12.5px] focus-visible:ring-2 focus-visible:outline-none"
      >
        View all engineers →
      </Link>
    </div>
  );
}
