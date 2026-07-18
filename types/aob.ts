import type { UserRef } from "@/types/user-ref";

/** No "tag"/category field exists on the backend's AOBItem model. */
export interface AOBItem {
  id: number;
  title: string;
  description: string;
  externalUrl: string | null;
  weekStart: string;
  position: number;
  createdBy: UserRef | null;
  createdAt: string;
}
