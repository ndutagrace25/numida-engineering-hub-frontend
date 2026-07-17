"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { SectionCard } from "@/components/ui/section-card";
import { cn } from "@/lib/utils";
import type { StandupItemEntry } from "@/types/standups";

export interface StandupSectionEditorProps {
  title: string;
  /** Blockers uses the destructive (red) title/dot color; every other section uses brand cyan/teal. */
  tone?: "default" | "meeting" | "destructive";
  items: StandupItemEntry[];
  placeholder: string;
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
}

const TITLE_CLASS: Record<
  NonNullable<StandupSectionEditorProps["tone"]>,
  string
> = {
  default: "text-accent-foreground",
  meeting: "text-accent-foreground",
  destructive: "text-destructive",
};

const DOT_CLASS: Record<
  NonNullable<StandupSectionEditorProps["tone"]>,
  string
> = {
  default: "bg-primary",
  meeting: "bg-brand-200",
  destructive: "bg-[#D6685E]",
};

/**
 * One editable bullet-list section of the weekly standup form (Did/
 * Working on/Plan/Meetings/Blockers). Local state only — items are held
 * in the parent page's StandupDraft state, nothing is submitted to a
 * backend.
 */
export function StandupSectionEditor({
  title,
  tone = "default",
  items,
  placeholder,
  onAdd,
  onRemove,
}: StandupSectionEditorProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim();
    if (!value) return;
    onAdd(value);
    setDraft("");
  }

  return (
    <SectionCard className="p-[18px_20px]">
      <div
        className={cn("mb-2.5 text-[13.5px] font-semibold", TITLE_CLASS[tone])}
      >
        {title}
      </div>

      <ul className="flex flex-col">
        {items.map((item) => (
          <li
            key={item.id}
            className="text-text-body flex items-start gap-2 py-[5px] text-[13.5px]"
          >
            <span
              className={cn(
                "mt-[7px] size-[5px] shrink-0 rounded-full",
                DOT_CLASS[tone],
              )}
            />
            <span className="flex-1">{item.text}</span>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove "${item.text}"`}
              className="text-text-faint focus-visible:ring-ring hover:text-foreground rounded text-[13px] focus-visible:ring-2 focus-visible:outline-none"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 py-1.5">
        <span className="text-text-faint text-sm" aria-hidden="true">
          +
        </span>
        <label className="sr-only" htmlFor={`standup-${title}`}>
          {placeholder}
        </label>
        <input
          id={`standup-${title}`}
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          className="text-foreground flex-1 border-none bg-transparent py-0.5 text-[13.5px] outline-none placeholder:text-[#9AA5AD]"
        />
      </div>
    </SectionCard>
  );
}
