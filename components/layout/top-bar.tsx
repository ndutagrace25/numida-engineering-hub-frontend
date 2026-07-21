import { Search } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { Input } from "@/components/ui/input";
import { formatWeekRangeLabel, getMondayOf, shiftWeek, formatDateParam } from "@/lib/week";

export interface TopBarProps {
  title: string;
}

/**
 * The 64px header bar from the design: page title, search, current week,
 * and account avatar. The search input is presentational only (no
 * feature endpoints yet), matching the task's mock-data-only scope.
 */
export function TopBar({ title }: TopBarProps) {
  const weekStart = formatDateParam(getMondayOf(new Date()));
  const weekEnd = shiftWeek(weekStart, 6);
  const currentWeekLabel = `Week of ${formatWeekRangeLabel(weekStart, weekEnd)}, ${weekStart.slice(0, 4)}`;

  return (
    <header className="border-border flex h-16 min-h-16 items-center justify-between gap-4 border-b px-4 sm:gap-6 sm:px-7">
      <div className="flex items-center gap-3">
        <MobileNav />
        <h1 className="text-foreground truncate text-base font-semibold whitespace-nowrap">
          {title}
        </h1>
      </div>

      <div className="relative hidden max-w-[460px] flex-1 md:block">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2"
          strokeWidth={1.7}
          aria-hidden="true"
        />
        <label htmlFor="global-search" className="sr-only">
          Search standups, PRs, people, AOB
        </label>
        <Input
          id="global-search"
          type="search"
          placeholder="Search standups, PRs, people, AOB… (⌘K)"
          className="bg-background h-9 rounded-lg pl-9 text-[13.5px]"
        />
      </div>

      <div className="flex items-center gap-3.5 whitespace-nowrap sm:gap-4">
        <div className="text-muted-foreground border-border hidden rounded-full border px-2.5 py-1 text-[12.5px] sm:block">
          {currentWeekLabel}
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
