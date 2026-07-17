import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PTOEntry } from "@/types/pto";

export interface PTOEntryRowProps {
  entry: PTOEntry;
}

export function PTOEntryRow({ entry }: PTOEntryRowProps) {
  return (
    <SectionCard className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-[16px_20px]">
      <ProfileAvatar initials={entry.initials} size="lg" />
      <div className="flex-1">
        <div className="text-sm font-semibold">{entry.name}</div>
        <div className="text-muted-foreground mt-0.5 text-[12.5px]">
          {entry.range} · {entry.days} days
        </div>
      </div>
      <div className="text-text-label text-[12.5px]">
        Handover:{" "}
        <span className="text-primary font-semibold">{entry.handoverTo}</span>
      </div>
      <StatusBadge tone="open">{entry.status}</StatusBadge>
    </SectionCard>
  );
}
