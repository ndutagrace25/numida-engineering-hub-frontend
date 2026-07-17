"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { standupToWeeklyRow } from "@/components/standups/standup-mapping";
import { WeeklyStandupCard } from "@/components/standups/weekly-standup-card";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { fetchWeeklyStandups } from "@/lib/api/standups";
import {
  formatDateParam,
  formatWeekRangeLabel,
  getMondayOf,
  shiftWeek,
} from "@/lib/week";

/**
 * Team weekly view: reads `?week=<Monday date>` (defaulting to the
 * current week), fetches every standup for that week, and paginates via
 * +/-7 days. Unlike the design's own 2-week-deep mock, real weeks are
 * unbounded in either direction — an empty week just shows the empty
 * state rather than disabling navigation.
 */
export function WeeklyView() {
  const searchParams = useSearchParams();
  const requestedWeek = searchParams.get("week");
  const weekStart =
    requestedWeek && /^\d{4}-\d{2}-\d{2}$/.test(requestedWeek)
      ? requestedWeek
      : formatDateParam(getMondayOf(new Date()));
  const weekEnd = shiftWeek(weekStart, 6);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["standups", "weekly", weekStart],
    queryFn: () => fetchWeeklyStandups(weekStart),
  });

  const rows = data?.map(standupToWeeklyRow) ?? [];

  return (
    <AppShell title="Team Weekly View">
      <div className="max-w-[1100px] p-6 sm:p-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl font-bold">Team weekly view</div>
          <div className="flex items-center gap-2.5">
            <Link
              href={`/standups/weekly?week=${shiftWeek(weekStart, -7)}`}
              aria-label="Previous week"
              className="focus-visible:ring-ring border-input bg-background text-text-icon hover:bg-muted flex size-[30px] items-center justify-center rounded-lg border focus-visible:ring-2 focus-visible:outline-none"
            >
              ‹
            </Link>
            <div className="min-w-[170px] text-center text-[13.5px] font-semibold">
              {formatWeekRangeLabel(weekStart, weekEnd)},{" "}
              {weekStart.slice(0, 4)}
            </div>
            <Link
              href={`/standups/weekly?week=${shiftWeek(weekStart, 7)}`}
              aria-label="Next week"
              className="focus-visible:ring-ring border-input bg-background text-text-icon hover:bg-muted flex size-[30px] items-center justify-center rounded-lg border focus-visible:ring-2 focus-visible:outline-none"
            >
              ›
            </Link>
          </div>
        </div>

        {isLoading && <LoadingSkeleton lines={4} />}
        {isError && <Alert tone="error">{getErrorMessage(error)}</Alert>}

        {data && (
          <div className="flex flex-col gap-4">
            {rows.map((row, i) => (
              <WeeklyStandupCard key={`${row.name}-${i}`} row={row} />
            ))}
            {rows.length === 0 && (
              <EmptyState>No standups submitted for this week yet.</EmptyState>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
