import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SectionCard } from "@/components/ui/section-card";
import type { HistoryEntry } from "@/types/standups";

export interface HistoryEntryCardProps {
  entry: HistoryEntry;
}

/** One row in My History / Team History. */
export function HistoryEntryCard({ entry }: HistoryEntryCardProps) {
  const lines = [...entry.did, ...entry.working.map((w) => `Working on: ${w}`)];
  const hasBlockers = entry.blockers.length > 0;

  return (
    <SectionCard className="p-4 sm:p-[16px_20px]">
      <div className="mb-2 flex flex-wrap items-center gap-2.5">
        <ProfileAvatar initials={entry.initials} size="sm" />
        <div className="text-[13.5px] font-semibold">{entry.engineer}</div>
        <div className="text-muted-foreground text-[12.5px]">
          {entry.week} · {entry.range}
        </div>
      </div>
      {lines.map((line, i) => (
        <div key={i} className="text-text-body py-0.5 pl-[34px] text-[13px]">
          — {line}
        </div>
      ))}
      {hasBlockers && (
        <div className="text-destructive pl-[34px] text-[12.5px]">
          ⚠ {entry.blockers.join("; ")}
        </div>
      )}
    </SectionCard>
  );
}
