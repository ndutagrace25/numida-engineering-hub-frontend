"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  GitPullRequest,
  Presentation,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fetchAOBItems } from "@/lib/api/aob";
import { fetchPullRequestLinks } from "@/lib/api/pull-requests";
import { fetchStandups } from "@/lib/api/standups";
import { fetchUsers } from "@/lib/api/users";
import { formatShortDate } from "@/lib/format-date";
import { formatDateParam, getMondayOf } from "@/lib/week";
import { cn } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;
const RESULTS_PER_GROUP = 5;

const resultItemClass =
  "focus-visible:ring-ring block w-full rounded-md px-2.5 py-2 text-left outline-none hover:bg-muted focus-visible:ring-2";

function ResultGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border border-b p-1.5 last:border-b-0">
      <div className="text-muted-foreground flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium tracking-wide uppercase">
        <Icon className="size-3" strokeWidth={1.8} aria-hidden="true" />
        {label}
      </div>
      {children}
    </div>
  );
}

/**
 * Global search: queries standups, pull requests, AOB, and people in
 * parallel (all four backends already support `?search=` via DRF's
 * SearchFilter) and shows the top few matches per category in a
 * dropdown. ⌘K/Ctrl+K focuses the box from anywhere in the app.
 */
export function GlobalSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const isSearchEnabled = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const standupsQuery = useQuery({
    queryKey: ["global-search", "standups", debouncedQuery],
    queryFn: () =>
      fetchStandups({ search: debouncedQuery, pageSize: RESULTS_PER_GROUP }),
    enabled: isSearchEnabled,
  });
  const pullRequestsQuery = useQuery({
    queryKey: ["global-search", "pull-requests", debouncedQuery],
    queryFn: () =>
      fetchPullRequestLinks({
        search: debouncedQuery,
        pageSize: RESULTS_PER_GROUP,
      }),
    enabled: isSearchEnabled,
  });
  const aobQuery = useQuery({
    queryKey: ["global-search", "aob", debouncedQuery],
    queryFn: () =>
      fetchAOBItems({ search: debouncedQuery, pageSize: RESULTS_PER_GROUP }),
    enabled: isSearchEnabled,
  });
  const usersQuery = useQuery({
    queryKey: ["global-search", "people", debouncedQuery],
    queryFn: () => fetchUsers({ search: debouncedQuery }),
    enabled: isSearchEnabled,
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function goTo(href: string) {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  }

  const standups = standupsQuery.data ?? [];
  const pullRequests = pullRequestsQuery.data?.items ?? [];
  const aobItems = aobQuery.data?.items ?? [];
  const people = (usersQuery.data ?? []).slice(0, RESULTS_PER_GROUP);

  const isLoading =
    isSearchEnabled &&
    (standupsQuery.isFetching ||
      pullRequestsQuery.isFetching ||
      aobQuery.isFetching ||
      usersQuery.isFetching);

  const hasResults =
    standups.length > 0 ||
    pullRequests.length > 0 ||
    aobItems.length > 0 ||
    people.length > 0;

  const showDropdown = isOpen && isSearchEnabled;

  return (
    <div
      ref={containerRef}
      className="relative hidden max-w-[460px] flex-1 md:block"
    >
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-[15px] -translate-y-1/2"
        strokeWidth={1.7}
        aria-hidden="true"
      />
      <label htmlFor="global-search" className="sr-only">
        Search standups, PRs, people, AOB
      </label>
      <Input
        ref={inputRef}
        id="global-search"
        type="search"
        placeholder="Search standups, PRs, people, AOB… (⌘K)"
        className="bg-background h-9 rounded-lg pl-9 text-[13.5px]"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {showDropdown && (
        <div className="bg-popover text-popover-foreground ring-foreground/10 absolute top-full left-0 z-50 mt-1.5 max-h-[70vh] w-full min-w-[340px] overflow-y-auto rounded-lg shadow-lg ring-1">
          {!hasResults && (
            <div className="text-muted-foreground px-3.5 py-3 text-[13px]">
              {isLoading
                ? "Searching…"
                : `No results for "${debouncedQuery}"`}
            </div>
          )}

          {standups.length > 0 && (
            <ResultGroup label="Standups" icon={ClipboardList}>
              {standups.map((standup) => (
                <button
                  key={standup.id}
                  type="button"
                  onClick={() =>
                    goTo(
                      `/standups/weekly?week=${formatDateParam(getMondayOf(new Date(standup.standupDate)))}`,
                    )
                  }
                  className={resultItemClass}
                >
                  <div className="truncate text-[13px] font-medium">
                    {standup.user.displayName}
                  </div>
                  <div className="text-muted-foreground truncate text-[12px]">
                    {formatShortDate(standup.standupDate)}
                    {" · "}
                    {standup.blockers || standup.items[0]?.content || "—"}
                  </div>
                </button>
              ))}
            </ResultGroup>
          )}

          {pullRequests.length > 0 && (
            <ResultGroup label="Pull Requests" icon={GitPullRequest}>
              {pullRequests.map((pr) => (
                <a
                  key={pr.id}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={cn(resultItemClass, "cursor-pointer")}
                >
                  <div className="truncate text-[13px] font-medium">
                    {pr.title}
                  </div>
                  <div className="text-muted-foreground truncate text-[12px]">
                    {pr.groupName}
                  </div>
                </a>
              ))}
            </ResultGroup>
          )}

          {aobItems.length > 0 && (
            <ResultGroup label="AOB" icon={Presentation}>
              {aobItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo("/aob")}
                  className={resultItemClass}
                >
                  <div className="truncate text-[13px] font-medium">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-muted-foreground truncate text-[12px]">
                      {item.description}
                    </div>
                  )}
                </button>
              ))}
            </ResultGroup>
          )}

          {people.length > 0 && (
            <ResultGroup label="People" icon={Users}>
              {people.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() =>
                    goTo(`/standups/history?tab=team&engineer=${person.id}`)
                  }
                  className={resultItemClass}
                >
                  <div className="truncate text-[13px] font-medium">
                    {person.displayName}
                  </div>
                </button>
              ))}
            </ResultGroup>
          )}
        </div>
      )}
    </div>
  );
}
