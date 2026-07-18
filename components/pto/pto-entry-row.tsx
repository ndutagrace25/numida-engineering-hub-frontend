import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { countInclusiveDays, formatDateRange } from "@/lib/format-date";
import { derivePTOStatus } from "@/lib/pto-status";
import type { PTOEntry } from "@/types/pto";

export interface PTOEntryRowProps {
  entry: PTOEntry;
}

/**
 * One row in the PTO list. `status` is derived from today vs the date
 * range (the backend has no such field); `handoverUrl` — a link to
 * handover notes, not a person, unlike the design's own mock data —
 * renders as a link only when present.
 */
export function PTOEntryRow({ entry }: PTOEntryRowProps) {
  const status = derivePTOStatus(entry.startDate, entry.endDate);
  const days = countInclusiveDays(entry.startDate, entry.endDate);

  return (
    <SectionCard className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-[16px_20px]">
      <ProfileAvatar initials={entry.user?.initials ?? "?"} size="lg" />
      <div className="flex-1">
        <div className="text-sm font-semibold">
          {entry.user?.displayName ?? "Unknown"}
        </div>
        <div className="text-muted-foreground mt-0.5 text-[12.5px]">
          {formatDateRange(entry.startDate, entry.endDate)} · {days} days
        </div>
      </div>
      {entry.handoverUrl && (
        <a
          href={entry.handoverUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-label focus-visible:ring-ring rounded text-[12.5px] focus-visible:ring-2 focus-visible:outline-none"
        >
          Handover:{" "}
          <span className="text-primary font-semibold hover:underline">
            notes ↗
          </span>
        </a>
      )}
      <StatusBadge tone="open">{status}</StatusBadge>
    </SectionCard>
  );
}
