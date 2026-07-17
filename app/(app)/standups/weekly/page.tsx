import type { Metadata } from "next";
import { Suspense } from "react";

import { WeeklyView } from "@/components/standups/weekly-view";

export const metadata: Metadata = {
  title: "Team Weekly View — Standup Hub",
};

export default function TeamWeeklyViewPage() {
  return (
    <Suspense fallback={null}>
      <WeeklyView />
    </Suspense>
  );
}
