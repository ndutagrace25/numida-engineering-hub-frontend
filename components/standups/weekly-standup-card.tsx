import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SectionCard } from "@/components/ui/section-card";
import type { WeeklyStandupRow } from "@/types/standups";

function Column({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="text-primary mb-1.5 text-[11.5px] font-bold tracking-[0.3px] uppercase">
        {label}
      </div>
      {items.map((t, i) => (
        <div
          key={i}
          className="text-text-body flex items-start gap-2 py-0.5 text-[13px]"
        >
          <span
            aria-hidden="true"
            className="bg-primary mt-[7px] size-[5px] shrink-0 rounded-full"
          />
          <span className="flex-1">{t}</span>
        </div>
      ))}
    </div>
  );
}

export interface WeeklyStandupCardProps {
  row: WeeklyStandupRow;
}

/** One engineer's card in the team weekly view. */
export function WeeklyStandupCard({ row }: WeeklyStandupCardProps) {
  const hasBlockers = row.blockers.length > 0;

  return (
    <SectionCard>
      <div className="mb-3.5 flex items-center gap-2.5">
        <ProfileAvatar initials={row.initials} size="lg" />
        <div className="text-[14.5px] font-semibold">{row.name}</div>
        {row.role && (
          <div className="text-muted-foreground text-[12.5px]">{row.role}</div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <Column label="Did" items={row.did} />
          <Column label="Working on" items={row.working} />
        </div>
        <div className="flex flex-col gap-2.5">
          <Column label="Plan" items={row.plan} />
          <Column label="Meetings" items={row.meetings} />
        </div>
      </div>

      {hasBlockers && (
        <div className="border-border-subtle mt-3 flex flex-col gap-1 border-t pt-3">
          <div className="text-destructive text-[11.5px] font-bold tracking-[0.3px] uppercase">
            Blockers
          </div>
          {row.blockers.map((t, i) => (
            <div
              key={i}
              className="text-destructive flex items-start gap-2 text-[13px]"
            >
              <span
                aria-hidden="true"
                className="mt-[7px] size-[5px] shrink-0 rounded-full bg-[#D6685E]"
              />
              <span className="flex-1">{t}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
