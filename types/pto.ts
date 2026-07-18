import type { UserRef } from "@/types/user-ref";

/**
 * Derived client-side from startDate/endDate vs today — the backend has
 * no status field of its own (see lib/pto-status.ts).
 */
export type PTOStatus = "Upcoming" | "Active" | "Completed";

/**
 * Matches apps.pto.serializers.PTOEntrySerializer. There is no "handover
 * to a person" field — the design's mock data modeled it that way, but
 * the real field is `handoverUrl` (an optional link to handover notes).
 */
export interface PTOEntry {
  id: number;
  user: UserRef | null;
  startDate: string;
  endDate: string;
  reason: string;
  handoverUrl: string | null;
  createdBy: UserRef | null;
}
