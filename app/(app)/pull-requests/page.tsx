import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { PRGroup } from "@/components/pull-requests/pr-group";
import { PR_GROUPS } from "@/lib/fixtures/pull-requests";

export const metadata: Metadata = {
  title: "Pull Requests — Standup Hub",
};

export default function PullRequestsPage() {
  return (
    <AppShell title="Pull Requests">
      <div className="max-w-[900px] p-6 sm:p-8">
        <h2 className="mb-5 text-xl font-bold">Outstanding pull requests</h2>
        <div className="flex flex-col gap-5">
          {PR_GROUPS.map((group) => (
            <PRGroup key={group.repo} group={group} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
