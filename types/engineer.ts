export type PresenceStatus = "online" | "away" | "offline";

export interface Engineer {
  name: string;
  initials: string;
  role: string;
  status: PresenceStatus;
}
