import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { AOBPreviewCard } from "@/components/dashboard/aob-preview-card";
import { MyStandupCard } from "@/components/dashboard/my-standup-card";
import { PRPreviewCard } from "@/components/dashboard/pr-preview-card";
import { PTOPreviewCard } from "@/components/dashboard/pto-preview-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { SubmissionBanner } from "@/components/dashboard/submission-banner";
import { WeeklyProgressCard } from "@/components/dashboard/weekly-progress-card";
import { OnlineList } from "@/components/presence/online-list";
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from "@/components/ui/section-card";
import { ACTIVITY } from "@/lib/fixtures/activity";
import { AOB_POSTS } from "@/lib/fixtures/aob";
import { ENGINEERS, SUBMITTED } from "@/lib/fixtures/engineers";
import { PTO_LIST } from "@/lib/fixtures/pto";
import { PR_GROUPS } from "@/lib/fixtures/pull-requests";

export const metadata: Metadata = {
  title: "Dashboard — Standup Hub",
};

export default function DashboardPage() {
  const submittedCount = ENGINEERS.filter((e) => SUBMITTED[e.name]).length;
  const onlinePreview = ENGINEERS.slice(0, 5);

  return (
    <AppShell title="Dashboard">
      <div className="max-w-[1280px] p-6 sm:p-8">
        <SubmissionBanner
          submittedCount={submittedCount}
          totalCount={ENGINEERS.length}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <MyStandupCard />

          <SectionCard>
            <SectionCardHeader>
              <SectionCardTitle>Who&apos;s Online</SectionCardTitle>
            </SectionCardHeader>
            <OnlineList engineers={onlinePreview} />
          </SectionCard>

          <WeeklyProgressCard
            submittedCount={submittedCount}
            totalCount={ENGINEERS.length}
          />
          <AOBPreviewCard posts={AOB_POSTS.slice(0, 2)} />
          <PTOPreviewCard entries={PTO_LIST.slice(0, 2)} />
          <PRPreviewCard groups={PR_GROUPS} />

          <RecentActivityCard activity={ACTIVITY} />
        </div>
      </div>
    </AppShell>
  );
}
