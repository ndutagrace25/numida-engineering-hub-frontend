"use client";

import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HistoryFilterOption } from "@/lib/history-filter-options";
import type { UserRef } from "@/types/user-ref";

export interface HistoryFiltersValue {
  search: string;
  month: string;
  week: string;
  engineer: string;
}

export interface HistoryFiltersProps {
  value: HistoryFiltersValue;
  onChange: (value: HistoryFiltersValue) => void;
  isTeamTab: boolean;
  monthOptions: HistoryFilterOption[];
  weekOptions: HistoryFilterOption[];
  engineers: UserRef[];
}

/** Search + month/week/engineer filters shown above My/Team History. */
export function HistoryFilters({
  value,
  onChange,
  isTeamTab,
  monthOptions,
  weekOptions,
  engineers,
}: HistoryFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      <div className="relative min-w-[220px] flex-1 sm:flex-none">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
          aria-hidden="true"
        />
        <label htmlFor="history-search" className="sr-only">
          Search keyword
        </label>
        <input
          id="history-search"
          type="text"
          placeholder="Search keyword…"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="focus-visible:ring-ring border-input bg-background h-9 w-full rounded-lg border pr-3 pl-8 text-[13px] outline-none focus-visible:ring-2"
        />
      </div>

      <Select
        value={value.month}
        onValueChange={(month) => onChange({ ...value, month: String(month) })}
      >
        <SelectTrigger
          aria-label="Filter by month"
          className="h-9 w-[150px] text-[13px]"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All months</SelectItem>
          {monthOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.week}
        onValueChange={(week) => onChange({ ...value, week: String(week) })}
      >
        <SelectTrigger
          aria-label="Filter by week"
          className="h-9 w-[140px] text-[13px]"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All weeks</SelectItem>
          {weekOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isTeamTab && (
        <Select
          value={value.engineer}
          onValueChange={(engineer) =>
            onChange({ ...value, engineer: String(engineer) })
          }
        >
          <SelectTrigger
            aria-label="Filter by engineer"
            className="h-9 w-[170px] text-[13px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All engineers</SelectItem>
            {engineers.map((engineer) => (
              <SelectItem key={engineer.id} value={String(engineer.id)}>
                {engineer.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
