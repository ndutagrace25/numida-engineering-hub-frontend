import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pull Requests — Standup Hub",
};

export default function PullRequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
