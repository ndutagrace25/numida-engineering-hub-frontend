import type { Metadata } from "next";
import { Suspense } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { HistoryView } from "@/components/standups/history-view";

export const metadata: Metadata = {
  title: "History — Standup Hub",
};

export default function HistoryPage() {
  return (
    <AppShell title="History">
      <Suspense fallback={null}>
        <HistoryView />
      </Suspense>
    </AppShell>
  );
}
