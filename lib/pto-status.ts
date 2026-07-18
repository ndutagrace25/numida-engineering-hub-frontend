import { formatDateParam } from "@/lib/week";
import type { PTOStatus } from "@/types/pto";

/** The backend has no status field — derived purely from today vs the range. */
export function derivePTOStatus(
  startDate: string,
  endDate: string,
  today: Date = new Date(),
): PTOStatus {
  const todayStr = formatDateParam(today);
  if (todayStr < startDate) return "Upcoming";
  if (todayStr > endDate) return "Completed";
  return "Active";
}
