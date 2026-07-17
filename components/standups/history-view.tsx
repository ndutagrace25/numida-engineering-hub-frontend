"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { HistoryEntryCard } from "@/components/standups/history-entry-card";
import {
  HistoryFilters,
  type HistoryFiltersValue,
} from "@/components/standups/history-filters";
import { standupToHistoryEntry } from "@/components/standups/standup-mapping";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/errors";
import { fetchStandups } from "@/lib/api/standups";
import { fetchUsers } from "@/lib/api/users";
import { getMonthOptions, getWeekOptions } from "@/lib/history-filter-options";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: HistoryFiltersValue = {
  search: "",
  month: "all",
  week: "all",
  engineer: "all",
};

/**
 * My/Team History: tabs, filters, and results — all server-side now
 * (search/engineer/date-range map onto real GET /standups/ query params;
 * see lib/history-filter-options.ts for how month/week map onto real
 * date ranges). Reads/writes the `tab` query param so the sidebar's "My
 * History"/"Team History" links land directly on the right tab.
 */
export function HistoryView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "team" ? "team" : "my";
  const [filters, setFilters] = useState<HistoryFiltersValue>(DEFAULT_FILTERS);
  const { user } = useAuth();

  const monthOptions = useMemo(() => getMonthOptions(), []);
  const weekOptions = useMemo(() => getWeekOptions(), []);
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  let dateAfter: string | undefined;
  let dateBefore: string | undefined;
  const monthRange = monthOptions.find((o) => o.value === filters.month);
  if (monthRange) {
    dateAfter = monthRange.dateAfter;
    dateBefore = monthRange.dateBefore;
  }
  const weekRange = weekOptions.find((o) => o.value === filters.week);
  if (weekRange) {
    dateAfter =
      dateAfter && dateAfter > weekRange.dateAfter
        ? dateAfter
        : weekRange.dateAfter;
    dateBefore =
      dateBefore && dateBefore < weekRange.dateBefore
        ? dateBefore
        : weekRange.dateBefore;
  }

  const scopedUserId =
    tab === "my"
      ? user?.id
      : filters.engineer !== "all"
        ? Number(filters.engineer)
        : undefined;

  const historyQuery = useQuery({
    queryKey: [
      "standups",
      "history",
      tab,
      scopedUserId,
      filters.search,
      dateAfter,
      dateBefore,
    ],
    queryFn: () =>
      fetchStandups({
        user: scopedUserId,
        search: filters.search,
        dateAfter,
        dateBefore,
        pageSize: 50,
      }),
    enabled: tab === "team" || !!user,
  });

  const results = historyQuery.data?.map(standupToHistoryEntry) ?? [];

  function setTab(next: "my" | "team") {
    router.push(`/standups/history?tab=${next}`);
  }

  return (
    <div className="max-w-[1100px] p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("my")}
          aria-pressed={tab === "my"}
          className={cn(
            "focus-visible:ring-ring rounded-lg px-4 py-2 text-[13.5px] font-semibold focus-visible:ring-2 focus-visible:outline-none",
            tab === "my"
              ? "bg-sidebar-primary text-white"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          My History
        </button>
        <button
          type="button"
          onClick={() => setTab("team")}
          aria-pressed={tab === "team"}
          className={cn(
            "focus-visible:ring-ring rounded-lg px-4 py-2 text-[13.5px] font-semibold focus-visible:ring-2 focus-visible:outline-none",
            tab === "team"
              ? "bg-sidebar-primary text-white"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          Team History
        </button>
      </div>

      <HistoryFilters
        value={filters}
        onChange={setFilters}
        isTeamTab={tab === "team"}
        monthOptions={monthOptions}
        weekOptions={weekOptions}
        engineers={usersQuery.data ?? []}
      />

      {historyQuery.isLoading && <LoadingSkeleton lines={4} />}
      {historyQuery.isError && (
        <Alert tone="error">{getErrorMessage(historyQuery.error)}</Alert>
      )}

      {historyQuery.data && (
        <div className="flex flex-col gap-3">
          {results.map((entry, i) => (
            <HistoryEntryCard
              key={`${entry.engineer}-${entry.week}-${i}`}
              entry={entry}
            />
          ))}
          {results.length === 0 && (
            <EmptyState>No entries match these filters</EmptyState>
          )}
        </div>
      )}
    </div>
  );
}
