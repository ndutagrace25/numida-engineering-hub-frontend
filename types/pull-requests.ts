export type PullRequestStatus =
  "Open" | "In review" | "Changes requested" | "Merged" | "Draft";

export interface PullRequestItem {
  number: number;
  title: string;
  author: string;
  status: PullRequestStatus;
  updated: string;
}

export interface PullRequestGroup {
  repo: string;
  prs: PullRequestItem[];
}
