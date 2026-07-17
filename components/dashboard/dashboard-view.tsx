"use client";

import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/layout/app-shell";
import { AOBPreviewCard } from "@/components/dashboard/aob-preview-card";
import { MyStandupCard } from "@/components/dashboard/my-standup-card";
import { PRPreviewCard } from "@/components/dashboard/pr-preview-card";
import { PTOPreviewCard } from "@/components/dashboard/pto-preview-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { SubmissionBanner } from "@/components/dashboard/submission-banner";
import { WeeklyProgressCard } from "@/components/dashboard/weekly-progress-card";
import { OnlineList } from "@/components/presence/online-list";
import { Alert } from "@/components/ui/alert";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import { useAuth } from "@/hooks/use-auth";
import { fetchDashboard } from "@/lib/api/dashboard";
import { getErrorMessage } from "@/lib/api/errors";
import { ACTIVITY } from "@/lib/fixtures/activity";
import { formatDateParam, getMondayOf } from "@/lib/week";

const weekStart = formatDateParam(getMondayOf(new Date()));

/**
 * The dashboard's real data: GET /dashboard/ aggregates standup
 * submissions, presence, AOB, PTO, and pull request links for the
 * current week in one call. Recent Activity is the one exception — the
 * backend has no activity-feed endpoint, so it stays on fixture data
 * (see the README/report).
 */
export function DashboardView() {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard", weekStart],
    queryFn: () => fetchDashboard(weekStart),
  });

  return (
    <AppShell title="Dashboard">
      <div className="max-w-[1280px] p-6 sm:p-8">
        {isLoading && <LoadingSkeleton lines={4} />}

        {isError && <Alert tone="error">{getErrorMessage(error)}</Alert>}

        {data && (
          <>
            <SubmissionBanner
              submittedCount={data.standupSummary.totalSubmittedStandups}
              totalCount={data.standupSummary.totalActiveUsers}
              weekStart={data.weekStart}
              weekEnd={data.weekEnd}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <MyStandupCard
                standups={data.weeklyStandups}
                currentUserId={user?.id}
              />

              <SectionCard>
                <SectionCardHeader>
                  <SectionCardTitle>Who&apos;s Online</SectionCardTitle>
                </SectionCardHeader>
                <OnlineList entries={data.presence.online.slice(0, 5)} />
              </SectionCard>

              <WeeklyProgressCard summary={data.standupSummary} />
              <AOBPreviewCard items={data.aobItems.slice(0, 2)} />
              <PTOPreviewCard entries={data.ptoEntries.slice(0, 2)} />
              <PRPreviewCard links={data.pullRequestLinks} />

              <RecentActivityCard activity={ACTIVITY} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
