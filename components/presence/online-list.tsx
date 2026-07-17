import Link from "next/link";

import { ProfileAvatar } from "@/components/ui/profile-avatar";
import type { Engineer } from "@/types/engineer";

export interface OnlineListProps {
  engineers: Engineer[];
}

/** The "Who's Online" preview list shown on the dashboard. */
export function OnlineList({ engineers }: OnlineListProps) {
  return (
    <div className="flex flex-col gap-3">
      {engineers.map((e) => (
        <div key={e.name} className="flex items-center gap-2.5">
          <ProfileAvatar initials={e.initials} presence={e.status} />
          <div className="text-text-body text-[13px]">{e.name}</div>
        </div>
      ))}
      <Link
        href="/standups/history?tab=team"
        className="focus-visible:ring-ring text-muted-foreground hover:text-foreground mt-0.5 rounded text-[12.5px] focus-visible:ring-2 focus-visible:outline-none"
      >
        View all engineers →
      </Link>
    </div>
  );
}
