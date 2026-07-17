import { MONTH_LABELS } from "@/lib/format-date";

/** The Monday on/before `date`, at local midnight — the backend requires
 * every `week_start` query param to be exactly a Monday. */
export function getMondayOf(date: Date): Date {
  const day = date.getDay(); // 0 = Sunday .. 6 = Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() + diffToMonday);
  return monday;
}

/** Formats a Date as YYYY-MM-DD in local time (not UTC, to avoid off-by-one). */
export function formatDateParam(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateParam(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** A YYYY-MM-DD date string shifted by `days` (negative to go back). */
export function shiftWeek(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return formatDateParam(new Date(year, month - 1, day + days));
}

/** "Jul 14–18" (same month) or "Jul 28 – Aug 3" (crossing a month boundary). */
export function formatWeekRangeLabel(
  weekStart: string,
  weekEnd: string,
): string {
  const start = parseDateParam(weekStart);
  const end = parseDateParam(weekEnd);
  const startLabel = `${MONTH_LABELS[start.getMonth()]} ${start.getDate()}`;
  if (start.getMonth() === end.getMonth()) {
    return `${startLabel}–${end.getDate()}`;
  }
  return `${startLabel} – ${MONTH_LABELS[end.getMonth()]} ${end.getDate()}`;
}
