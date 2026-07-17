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

export interface MyStandupCardProps {
  standups: DashboardStandup[];
  currentUserId?: number;
}

/**
 * The dashboard's paginated "today" card: cycles through everyone who's
 * submitted a standup this week, with an Edit link shown only when
 * viewing the signed-in user's own entry. `blockers` is the standup's own
 * free-text field (not an itemized section) — shown as a single line,
 * defaulting to "None" when empty.
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

  const items = [
    {
      label: "DID",
      text:
        standup.items.find((i) => i.section === "COMPLETED")?.content ??
        "Nothing yet",
    },
    {
      label: "WORKING",
      text:
        standup.items.find((i) => i.section === "CURRENT")?.content ??
        "Nothing yet",
    },
    { label: "BLOCKER", text: standup.blockers || "None" },
  ];

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

      <div className="flex flex-col gap-2">
        {items.map((row) => (
          <div
            key={row.label}
            className="text-text-body flex gap-2.5 text-[13.5px]"
          >
            <span className="text-primary min-w-[70px] text-[11px] font-bold">
              {row.label}
            </span>
            <span>{row.text}</span>
          </div>
        ))}
      </div>

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
