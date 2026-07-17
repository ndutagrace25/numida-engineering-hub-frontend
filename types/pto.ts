export type PTOStatus = "Upcoming" | "Active" | "Completed";

export interface PTOEntry {
  id: string;
  name: string;
  initials: string;
  range: string;
  days: number;
  status: PTOStatus;
  handoverTo: string;
}
