"use client";

import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PTOEntryRow } from "@/components/pto/pto-entry-row";
import {
  RequestPTODialog,
  type RequestPtoValues,
} from "@/components/pto/request-pto-dialog";
import { CURRENT_USER } from "@/lib/fixtures/engineers";
import { PTO_LIST } from "@/lib/fixtures/pto";
import type { PTOEntry } from "@/types/pto";

function formatRange(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const days =
    Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1;
  return { range: `${fmt(startDate)} – ${fmt(endDate)}`, days };
}

export default function PTOPage() {
  const [entries, setEntries] = useState<PTOEntry[]>(PTO_LIST);

  function handleCreate(values: RequestPtoValues) {
    const { range, days } = formatRange(values.startDate, values.endDate);
    setEntries((prev) => [
      {
        id: `pto-${Date.now()}`,
        name: CURRENT_USER.name,
        initials: CURRENT_USER.initials,
        range,
        days,
        status: "Upcoming",
        handoverTo: values.handoverTo,
      },
      ...prev,
    ]);
  }

  return (
    <AppShell title="PTO">
      <div className="max-w-[900px] p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-xl font-bold">PTO</div>
          <RequestPTODialog onCreate={handleCreate} />
        </div>
        <div className="flex flex-col gap-2.5">
          {entries.map((entry) => (
            <PTOEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
