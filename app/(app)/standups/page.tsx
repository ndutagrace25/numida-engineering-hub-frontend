"use client";

import { useId, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { StandupSectionEditor } from "@/components/standups/standup-section-editor";
import { Button } from "@/components/ui/button";
import { getInitialStandupDraft } from "@/lib/fixtures/standups";
import type { StandupDraft, StandupSection } from "@/types/standups";

const SECTIONS: {
  key: StandupSection;
  title: string;
  placeholder: string;
  tone?: "default" | "meeting" | "destructive";
}[] = [
  {
    key: "did",
    title: "What did I do?",
    placeholder: "Add an item, press Enter",
  },
  {
    key: "working",
    title: "What am I working on?",
    placeholder: "Add an item, press Enter",
  },
  {
    key: "plan",
    title: "What do I plan to do?",
    placeholder: "Add an item, press Enter",
  },
  {
    key: "meetings",
    title: "Meetings",
    placeholder: "Add an item, press Enter",
    tone: "meeting",
  },
  {
    key: "blockers",
    title: "Blockers",
    placeholder: "Add a blocker, press Enter",
    tone: "destructive",
  },
];

export default function StandupFormPage() {
  const [draft, setDraft] = useState<StandupDraft>(() =>
    getInitialStandupDraft(),
  );
  const idPrefix = useId();

  function addItem(section: StandupSection, text: string) {
    setDraft((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        {
          id: `${idPrefix}-${section}-${prev[section].length}-${Date.now()}`,
          text,
        },
      ],
    }));
  }

  function removeItem(section: StandupSection, id: string) {
    setDraft((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  }

  return (
    <AppShell title="Standups">
      <div className="max-w-[760px] p-6 sm:p-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">This week&apos;s standup</h2>
            <div className="text-muted-foreground mt-0.5 text-[13px]">
              Jul 14 – Jul 18, 2026 · autosaves as you type
            </div>
          </div>
          <Button type="button" className="w-fit">
            Submit standup
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {SECTIONS.map((section) => (
            <StandupSectionEditor
              key={section.key}
              title={section.title}
              tone={section.tone}
              placeholder={section.placeholder}
              items={draft[section.key]}
              onAdd={(text) => addItem(section.key, text)}
              onRemove={(id) => removeItem(section.key, id)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
