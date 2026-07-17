import { formatShortDate, MONTH_LABELS_FULL } from "@/lib/format-date";
import { formatDateParam, getMondayOf, shiftWeek } from "@/lib/week";

export interface HistoryFilterOption {
  value: string;
  label: string;
  dateAfter: string;
  dateBefore: string;
}

/**
 * The design's My/Team History filters had hardcoded month/week dropdown
 * options with no real backend concept behind them. The backend does
 * support real date_after/date_before range filters though, so these
 * options are computed from a real rolling calendar window (last 6
 * months, last 12 weeks) and each carries the exact date range it maps
 * to — a legitimate translation, not invented data.
 */
export function getMonthOptions(
  referenceDate = new Date(),
  count = 6,
): HistoryFilterOption[] {
  const options: HistoryFilterOption[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - i,
      1,
    );
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    options.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: `${MONTH_LABELS_FULL[d.getMonth()]} ${d.getFullYear()}`,
      dateAfter: formatDateParam(start),
      dateBefore: formatDateParam(end),
    });
  }
  return options;
}

export function getWeekOptions(
  referenceDate = new Date(),
  count = 12,
): HistoryFilterOption[] {
  const thisMonday = formatDateParam(getMondayOf(referenceDate));
  const options: HistoryFilterOption[] = [];
  for (let i = 0; i < count; i++) {
    const monday = shiftWeek(thisMonday, -7 * i);
    const sunday = shiftWeek(monday, 6);
    options.push({
      value: monday,
      label: `Week of ${formatShortDate(monday)}`,
      dateAfter: monday,
      dateBefore: sunday,
    });
  }
  return options;
}
