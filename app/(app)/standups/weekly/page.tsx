import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { WeeklyStandupCard } from "@/components/standups/weekly-standup-card";
import { WEEKLY_BY_OFFSET, WEEK_LABELS } from "@/lib/fixtures/standups";

export const metadata: Metadata = {
  title: "Team Weekly View — Standup Hub",
};

const MIN_OFFSET = 0;
const MAX_OFFSET = 1;

export default async function TeamWeeklyViewPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const offset = Math.min(MAX_OFFSET, Math.max(MIN_OFFSET, Number(week) || 0));
  const rows = WEEKLY_BY_OFFSET[offset] ?? [];

  return (
    <AppShell title="Team Weekly View">
      <div className="max-w-[1100px] p-6 sm:p-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl font-bold">Team weekly view</div>
          <div className="flex items-center gap-2.5">
            <Link
              href={`/standups/weekly?week=${Math.min(MAX_OFFSET, offset + 1)}`}
              aria-label="Previous week"
              aria-disabled={offset >= MAX_OFFSET}
              className="focus-visible:ring-ring border-input bg-background text-text-icon hover:bg-muted flex size-[30px] items-center justify-center rounded-lg border focus-visible:ring-2 focus-visible:outline-none aria-disabled:pointer-events-none aria-disabled:opacity-40"
            >
              ‹
            </Link>
            <div className="min-w-[170px] text-center text-[13.5px] font-semibold">
              {WEEK_LABELS[offset]}
            </div>
            <Link
              href={`/standups/weekly?week=${Math.max(MIN_OFFSET, offset - 1)}`}
              aria-label="Next week"
              aria-disabled={offset <= MIN_OFFSET}
              className="focus-visible:ring-ring border-input bg-background text-text-icon hover:bg-muted flex size-[30px] items-center justify-center rounded-lg border focus-visible:ring-2 focus-visible:outline-none aria-disabled:pointer-events-none aria-disabled:opacity-40"
            >
              ›
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <WeeklyStandupCard key={row.name} row={row} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
