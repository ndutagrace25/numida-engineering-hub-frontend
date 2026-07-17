import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/ui/section-card";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { CURRENT_USER } from "@/lib/fixtures/engineers";

export const metadata: Metadata = {
  title: "Profile — Standup Hub",
};

const STATS = [
  { value: 18, label: "week streak" },
  { value: 3, label: "open PRs" },
  { value: 0, label: "blockers" },
];

export default function ProfilePage() {
  return (
    <AppShell title="Profile">
      <div className="max-w-[640px] p-6 sm:p-8">
        <SectionCard className="mb-5 flex flex-col items-center p-7 text-center">
          <div className="mb-3">
            <ProfileAvatar
              initials={CURRENT_USER.initials}
              variant="accent"
              size="xl"
            />
          </div>
          <h2 className="text-lg font-bold">{CURRENT_USER.name}</h2>
          <div className="text-muted-foreground mt-0.5 text-[13.5px]">
            {CURRENT_USER.role} · Platform Team
          </div>
          <div className="mt-5 flex gap-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-sidebar-primary text-lg font-bold">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-[11.5px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <p className="text-muted-foreground text-center text-[12.5px]">
          Everyone has equal permissions — you can edit only the content you
          created.
        </p>
      </div>
    </AppShell>
  );
}
