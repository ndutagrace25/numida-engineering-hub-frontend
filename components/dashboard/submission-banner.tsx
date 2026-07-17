import Link from "next/link";

import { Button } from "@/components/ui/button";

export interface SubmissionBannerProps {
  submittedCount: number;
  totalCount: number;
}

/** The dark teal "N of M engineers submitted" banner atop the dashboard. */
export function SubmissionBanner({
  submittedCount,
  totalCount,
}: SubmissionBannerProps) {
  return (
    <div className="bg-sidebar-primary mb-6 flex flex-col gap-4 rounded-xl px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-brand-100 text-[12.5px] font-semibold tracking-[0.3px] uppercase">
          Current week · Jul 14–18
        </div>
        <div className="mt-1 text-[19px] font-semibold text-white">
          {submittedCount} of {totalCount} engineers have submitted their
          standup
        </div>
      </div>
      <Button
        render={<Link href="/standups" />}
        nativeButton={false}
        className="w-fit"
      >
        Submit my standup
      </Button>
    </div>
  );
}
