"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AppShell } from "@/components/layout/app-shell";
import {
  AddPTODialog,
  type AddPtoValues,
} from "@/components/pto/add-pto-dialog";
import { PTOEntryRow } from "@/components/pto/pto-entry-row";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/errors";
import { createPTOEntry, fetchPTOEntries } from "@/lib/api/pto";
import { formatDateParam } from "@/lib/week";

const today = new Date();
const todayStr = formatDateParam(today);
// A 30-day lookback safely catches any currently-active entry (started
// before today, still ongoing) — the backend's date_after filter only
// applies to start_date, not end_date, so there's no single query param
// for "hasn't ended yet." Anything that has already ended is filtered
// out client-side below.
const dateAfter = formatDateParam(
  new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
);

export default function PTOPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const ptoQuery = useQuery({
    queryKey: ["pto", dateAfter],
    queryFn: () => fetchPTOEntries({ dateAfter, pageSize: 50 }),
  });

  const entries = (ptoQuery.data ?? []).filter(
    (entry) => entry.endDate >= todayStr,
  );

  const createMutation = useMutation({
    mutationFn: (values: AddPtoValues) =>
      createPTOEntry({
        user: user!.id,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
        handoverUrl: values.handoverUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pto"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return (
    <AppShell title="PTO">
      <div className="max-w-[900px] p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-xl font-bold">PTO</div>
          <AddPTODialog
            onCreate={(values) => createMutation.mutateAsync(values)}
          />
        </div>

        {ptoQuery.isLoading && <LoadingSkeleton lines={4} />}
        {ptoQuery.isError && (
          <Alert tone="error">{getErrorMessage(ptoQuery.error)}</Alert>
        )}

        {ptoQuery.data && (
          <div className="flex flex-col gap-2.5">
            {entries.map((entry) => (
              <PTOEntryRow key={entry.id} entry={entry} />
            ))}
            {entries.length === 0 && <EmptyState>No upcoming PTO.</EmptyState>}
          </div>
        )}
      </div>
    </AppShell>
  );
}
