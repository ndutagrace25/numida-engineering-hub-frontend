"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { HistoryEntryCard } from "@/components/standups/history-entry-card";
import {
  HistoryFilters,
  type HistoryFiltersValue,
} from "@/components/standups/history-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { filterHistory } from "@/lib/filter-history";
import { CURRENT_USER } from "@/lib/fixtures/engineers";
import { HISTORY_ENTRIES } from "@/lib/fixtures/standups";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: HistoryFiltersValue = {
  search: "",
  month: "all",
  week: "all",
  engineer: "all",
};

/**
 * My/Team History: tabs, filters, and results. Reads/writes the `tab`
 * query param (via useSearchParams) so the sidebar's "My History"/"Team
 * History" links land directly on the right tab — pulled out of the
 * route's page.tsx so that file can stay a server component wrapping
 * this in a Suspense boundary, per Next.js's requirement for
 * useSearchParams during static generation.
 */
export function HistoryView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "team" ? "team" : "my";
  const [filters, setFilters] = useState<HistoryFiltersValue>(DEFAULT_FILTERS);

  const results = useMemo(
    () => filterHistory(HISTORY_ENTRIES, tab, CURRENT_USER.name, filters),
    [tab, filters],
  );

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
      />

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
    </div>
  );
}
