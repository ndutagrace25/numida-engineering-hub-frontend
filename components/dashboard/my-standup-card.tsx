"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import { CURRENT_USER } from "@/lib/fixtures/engineers";
import { WEEKLY_BY_OFFSET } from "@/lib/fixtures/standups";

const TODAY_ROWS = WEEKLY_BY_OFFSET[0];

/**
 * The dashboard's paginated "today" card: cycles through every engineer's
 * DID/WORKING/BLOCKER preview, with an Edit link shown only when viewing
 * the signed-in user's own entry. Matches the design's prev/next
 * behavior exactly; this uses each engineer's static weekly fixture data
 * (not any draft being edited on /standups) to keep this phase's state
 * scoped to a single page — see the report for this simplification.
 */
export function MyStandupCard() {
  const [index, setIndex] = useState(0);
  const person = TODAY_ROWS[index];
  const isMe = person.name === CURRENT_USER.name;

  const items = [
    { label: "DID", text: person.did[0] ?? "Nothing yet" },
    { label: "WORKING", text: person.working[0] ?? "Nothing yet" },
    { label: "BLOCKER", text: person.blockers[0] ?? "None" },
  ];

  return (
    <SectionCard className="sm:col-span-2">
      <SectionCardHeader>
        <SectionCardTitle>
          {isMe ? "My Standup" : `${person.name} — today`}
        </SectionCardTitle>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setIndex((i) => (i - 1 + TODAY_ROWS.length) % TODAY_ROWS.length)
            }
            className="focus-visible:ring-ring text-muted-foreground hover:text-foreground rounded text-[12.5px] font-semibold focus-visible:ring-2 focus-visible:outline-none"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % TODAY_ROWS.length)}
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
