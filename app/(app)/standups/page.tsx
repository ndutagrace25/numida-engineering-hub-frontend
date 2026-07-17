"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import {
  draftToStandupInput,
  EMPTY_STANDUP_DRAFT,
  standupToDraft,
} from "@/components/standups/standup-mapping";
import { StandupSectionEditor } from "@/components/standups/standup-section-editor";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { getApiError, getErrorMessage } from "@/lib/api/errors";
import {
  createStandup,
  fetchStandups,
  updateStandup,
} from "@/lib/api/standups";
import { formatDateParam, formatWeekRangeLabel, getMondayOf } from "@/lib/week";
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

const monday = getMondayOf(new Date());
const weekStart = formatDateParam(monday);
const weekEnd = formatDateParam(
  new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6),
);

export default function StandupFormPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const idPrefix = useId();

  const [draft, setDraft] = useState<StandupDraft>(EMPTY_STANDUP_DRAFT);
  const [standupId, setStandupId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const existingQuery = useQuery({
    queryKey: ["standups", "mine", weekStart, user?.id],
    queryFn: () => fetchStandups({ user: user!.id, standupDate: weekStart }),
    enabled: !!user,
  });

  // Seed the draft from the fetched standup exactly once, during render
  // (React's documented alternative to an effect for this) — `hasLoaded`
  // state (not the query's own loading flags) gates it, since a refetch
  // after a save (see saveMutation's invalidateQueries) must not clobber
  // further local edits with server data again.
  if (!hasLoaded && existingQuery.data) {
    setHasLoaded(true);
    const [existing] = existingQuery.data;
    if (existing) {
      setStandupId(existing.id);
      setDraft(standupToDraft(existing));
    }
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const input = draftToStandupInput(draft);
      if (standupId) {
        return updateStandup(standupId, input);
      }
      return createStandup({ standupDate: weekStart, ...input });
    },
    onSuccess: (standup) => {
      setStandupId(standup.id);
      setFormError(null);
      setSavedMessage("Standup saved.");
      queryClient.invalidateQueries({ queryKey: ["standups"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      setSavedMessage(null);
      const apiError = getApiError(error);
      const fieldMessage = Object.values(apiError.fields).flat()[0];
      setFormError(fieldMessage ?? getErrorMessage(error));
    },
  });

  function addItem(section: StandupSection, text: string) {
    setSavedMessage(null);
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
    setSavedMessage(null);
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
              {formatWeekRangeLabel(weekStart, weekEnd)}, {monday.getFullYear()}
            </div>
          </div>
          <Button
            type="button"
            className="w-fit"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? "Submitting…" : "Submit standup"}
          </Button>
        </div>

        {formError && (
          <Alert tone="error" className="mb-4">
            {formError}
          </Alert>
        )}
        {savedMessage && (
          <Alert tone="success" className="mb-4">
            {savedMessage}
          </Alert>
        )}

        {existingQuery.isLoading ? (
          <LoadingSkeleton lines={4} />
        ) : (
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
        )}
      </div>
    </AppShell>
  );
}
