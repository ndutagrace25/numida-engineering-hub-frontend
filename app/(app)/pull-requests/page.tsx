"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AppShell } from "@/components/layout/app-shell";
import {
  NewPRLinkDialog,
  type NewPRLinkValues,
} from "@/components/pull-requests/new-pr-link-dialog";
import { PRGroup } from "@/components/pull-requests/pr-group";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { getErrorMessage } from "@/lib/api/errors";
import {
  createPullRequestLink,
  fetchPullRequestLinks,
} from "@/lib/api/pull-requests";
import { formatDateParam, getMondayOf } from "@/lib/week";
import type { PullRequestLink } from "@/types/pull-requests";

const currentWeekStart = formatDateParam(getMondayOf(new Date()));

function groupByName(links: PullRequestLink[]) {
  const order: string[] = [];
  const byName = new Map<string, PullRequestLink[]>();
  for (const link of links) {
    if (!byName.has(link.groupName)) {
      order.push(link.groupName);
      byName.set(link.groupName, []);
    }
    byName.get(link.groupName)!.push(link);
  }
  return order.map((groupName) => ({
    groupName,
    links: byName.get(groupName)!,
  }));
}

export default function PullRequestsPage() {
  const queryClient = useQueryClient();

  const prQuery = useQuery({
    queryKey: ["pull-requests"],
    queryFn: () => fetchPullRequestLinks({ pageSize: 50 }),
  });

  const links = prQuery.data?.items ?? [];
  const groups = groupByName(links);

  const createMutation = useMutation({
    mutationFn: (values: NewPRLinkValues) => {
      // The backend has no auto-increment for position within a
      // week+group — append after whatever's already shared this week
      // under the same group.
      const inSameWeekAndGroup = links.filter(
        (link) =>
          link.weekStart === currentWeekStart &&
          link.groupName === values.groupName,
      );
      const nextPosition =
        inSameWeekAndGroup.length === 0
          ? 1
          : Math.max(...inSameWeekAndGroup.map((link) => link.position)) + 1;

      return createPullRequestLink({
        title: values.title,
        url: values.url,
        groupName: values.groupName,
        status: values.status,
        weekStart: currentWeekStart,
        position: nextPosition,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pull-requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return (
    <AppShell title="Pull Requests">
      <div className="max-w-[900px] p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Outstanding pull requests</h2>
          <NewPRLinkDialog
            onCreate={(values) => createMutation.mutateAsync(values)}
          />
        </div>

        {prQuery.isLoading && <LoadingSkeleton lines={4} />}
        {prQuery.isError && (
          <Alert tone="error">{getErrorMessage(prQuery.error)}</Alert>
        )}

        {prQuery.data && (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <PRGroup
                key={group.groupName}
                groupName={group.groupName}
                links={group.links}
              />
            ))}
            {groups.length === 0 && (
              <EmptyState>No pull requests shared yet.</EmptyState>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
