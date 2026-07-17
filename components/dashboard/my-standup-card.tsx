"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import type { DashboardStandup } from "@/types/dashboard";
import type { StandupItemSection } from "@/types/standups";

export interface MyStandupCardProps {
  standups: DashboardStandup[];
  currentUserId?: number;
}

const SECTION_COLUMNS: { section: StandupItemSection; label: string }[][] = [
  [
    { section: "COMPLETED", label: "What did I do?" },
    { section: "CURRENT", label: "What am I working on?" },
  ],
  [
    { section: "PLANNED", label: "What do I plan to do?" },
    { section: "MEETING", label: "Meetings" },
  ],
];

function contentsBySection(
  standup: DashboardStandup,
  section: StandupItemSection,
): string[] {
  return standup.items
    .filter((item) => item.section === section)
    .sort((a, b) => a.position - b.position)
    .map((item) => item.content);
}

/**
 * The dashboard's paginated standup card: cycles through everyone who's
 * submitted this week, showing every section in full (not a truncated
 * one-line-per-section summary) — a moderator reads through each
 * person's complete entry via Previous/Next during standup. An Edit
 * link is shown only when viewing the signed-in user's own entry.
 */
export function MyStandupCard({ standups, currentUserId }: MyStandupCardProps) {
  const [index, setIndex] = useState(0);

  if (standups.length === 0) {
    return (
      <SectionCard className="sm:col-span-2">
        <SectionCardHeader>
          <SectionCardTitle>My Standup</SectionCardTitle>
        </SectionCardHeader>
        <EmptyState>No one has submitted a standup this week yet.</EmptyState>
      </SectionCard>
    );
  }

  const standup = standups[Math.min(index, standups.length - 1)];
  const isMe = standup.user.id === currentUserId;
  const blockerLines = standup.blockers
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <SectionCard className="sm:col-span-2">
      <SectionCardHeader>
        <SectionCardTitle>
          {isMe ? "My Standup" : `${standup.user.displayName} — today`}
        </SectionCardTitle>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setIndex((i) => (i - 1 + standups.length) % standups.length)
            }
            className="focus-visible:ring-ring text-muted-foreground hover:text-foreground rounded text-[12.5px] font-semibold focus-visible:ring-2 focus-visible:outline-none"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % standups.length)}
            className="focus-visible:ring-ring text-muted-foreground hover:text-foreground rounded text-[12.5px] font-semibold focus-visible:ring-2 focus-visible:outline-none"
          >
            Next →
          </button>
        </div>
      </SectionCardHeader>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {SECTION_COLUMNS.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3">
            {column.map(({ section, label }) => {
              const contents = contentsBySection(standup, section);
              if (contents.length === 0) return null;
              return (
                <div key={section}>
                  <div className="text-primary mb-1 text-[11px] font-bold tracking-[0.3px] uppercase">
                    {label}
                  </div>
                  {contents.map((text, i) => (
                    <div
                      key={i}
                      className="text-text-body flex items-start gap-2 py-0.5 text-[13.5px]"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-primary mt-[7px] size-[5px] shrink-0 rounded-full"
                      />
                      <span className="flex-1">{text}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {blockerLines.length > 0 && (
        <div className="border-border-subtle mt-3.5 border-t pt-3">
          <div className="text-destructive mb-1 text-[11px] font-bold tracking-[0.3px] uppercase">
            Blockers
          </div>
          {blockerLines.map((text, i) => (
            <div
              key={i}
              className="text-destructive flex items-start gap-2 py-0.5 text-[13.5px]"
            >
              <span
                aria-hidden="true"
                className="mt-[7px] size-[5px] shrink-0 rounded-full bg-[#D6685E]"
              />
              <span className="flex-1">{text}</span>
            </div>
          ))}
        </div>
      )}

      {isMe && (
        <Link
          href="/standups"
          className="focus-visible:ring-ring border-border-subtle text-primary mt-3.5 flex w-fit items-center gap-1.5 border-t pt-3 text-[12.5px] font-semibold hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit
        </Link>
      )}
    </SectionCard>
  );
}
