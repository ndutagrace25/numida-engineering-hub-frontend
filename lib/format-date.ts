export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MONTH_LABELS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-07-15T09:00:00Z" or "2026-07-15" -> "Jul 15". */
export function formatShortDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}`;
}

/** "2026-07-21", "2026-07-25" -> "Jul 21 – Jul 25". */
export function formatDateRange(startDate: string, endDate: string): string {
  return `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`;
}
