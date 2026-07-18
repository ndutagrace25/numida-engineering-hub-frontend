"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AOBPostCard } from "@/components/aob/aob-post-card";
import {
  NewPostDialog,
  type NewPostValues,
} from "@/components/aob/new-post-dialog";
import { AppShell } from "@/components/layout/app-shell";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { createAOBItem, fetchAOBItems } from "@/lib/api/aob";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDateParam, getMondayOf } from "@/lib/week";

const currentWeekStart = formatDateParam(getMondayOf(new Date()));

export default function AOBPage() {
  const queryClient = useQueryClient();

  const aobQuery = useQuery({
    queryKey: ["aob"],
    queryFn: () => fetchAOBItems({ pageSize: 50 }),
  });

  const items = aobQuery.data?.items ?? [];

  const createMutation = useMutation({
    mutationFn: (values: NewPostValues) => {
      // The backend has no auto-increment for position within a week —
      // append after whatever's already posted this week.
      const itemsThisWeek = items.filter(
        (item) => item.weekStart === currentWeekStart,
      );
      const nextPosition =
        itemsThisWeek.length === 0
          ? 1
          : Math.max(...itemsThisWeek.map((item) => item.position)) + 1;

      return createAOBItem({
        title: values.title,
        description: values.description,
        externalUrl: values.externalUrl,
        weekStart: currentWeekStart,
        position: nextPosition,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aob"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return (
    <AppShell title="AOB">
      <div className="max-w-[760px] p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Any Other Business</h2>
          <NewPostDialog
            onCreate={(values) => createMutation.mutateAsync(values)}
          />
        </div>

        {aobQuery.isLoading && <LoadingSkeleton lines={4} />}
        {aobQuery.isError && (
          <Alert tone="error">{getErrorMessage(aobQuery.error)}</Alert>
        )}

        {aobQuery.data && (
          <div className="flex flex-col gap-3.5">
            {items.map((post) => (
              <AOBPostCard key={post.id} post={post} />
            ))}
            {items.length === 0 && <EmptyState>Nothing raised yet.</EmptyState>}
          </div>
        )}
      </div>
    </AppShell>
  );
}
