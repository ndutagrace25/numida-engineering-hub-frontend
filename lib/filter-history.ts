import type { HistoryEntry } from "@/types/standups";
import type { HistoryFiltersValue } from "@/components/standups/history-filters";

/**
 * Filters history entries the same way the imported design's prototype
 * does: scope to "my" entries or all, then narrow by engineer/month/week/
 * search keyword.
 */
export function filterHistory(
  entries: HistoryEntry[],
  tab: "my" | "team",
  currentUserName: string,
  filters: HistoryFiltersValue,
): HistoryEntry[] {
  let scoped =
    tab === "my"
      ? entries.filter((h) => h.engineer === currentUserName)
      : entries;

  if (tab === "team" && filters.engineer !== "all") {
    scoped = scoped.filter((h) => h.engineer === filters.engineer);
  }
  if (filters.month !== "all") {
    scoped = scoped.filter((h) => h.month === filters.month);
  }
  if (filters.week !== "all") {
    scoped = scoped.filter((h) => h.week === filters.week);
  }

  const query = filters.search.trim().toLowerCase();
  if (query) {
    scoped = scoped.filter((h) =>
      [...h.did, ...h.working, ...h.blockers]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  return scoped;
}
