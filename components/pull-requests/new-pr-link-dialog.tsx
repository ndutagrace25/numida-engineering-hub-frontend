"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiError, getErrorMessage } from "@/lib/api/errors";

const STATUS_LABEL = {
  OPEN: "Open",
  IN_REVIEW: "In review",
  CHANGES_REQUESTED: "Changes requested",
  APPROVED: "Approved",
  BLOCKED: "Blocked",
} as const;

const STATUS_OPTIONS = Object.entries(STATUS_LABEL).map(([value, label]) => ({
  value: value as keyof typeof STATUS_LABEL,
  label,
}));

const newPRLinkSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .refine((v) => /^https:\/\/.+/.test(v), {
      message: "Must be an HTTPS URL",
    }),
  groupName: z.string().trim().min(1, "Group is required"),
  status: z.enum([
    "OPEN",
    "IN_REVIEW",
    "CHANGES_REQUESTED",
    "APPROVED",
    "BLOCKED",
  ]),
});

export type NewPRLinkValues = z.infer<typeof newPRLinkSchema>;

export interface NewPRLinkDialogProps {
  onCreate: (values: NewPRLinkValues) => Promise<unknown>;
}

const BACKEND_FIELD_TO_FORM_FIELD = {
  title: "title",
  url: "url",
  group_name: "groupName",
  status: "status",
} as const;

/**
 * "New PR link" dialog. The design's prototype has no create affordance
 * for pull requests at all (a flat, read-only mock list) — this fills in
 * the natural interaction, matching the pattern already used for AOB
 * posts and PTO entries. "Group" corresponds to the backend's group_name
 * (the design's mock data called it "repo"), and there's no PR "number"
 * field to collect since the backend only stores a URL.
 */
export function NewPRLinkDialog({ onCreate }: NewPRLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPRLinkValues>({
    resolver: zodResolver(newPRLinkSchema),
    defaultValues: { title: "", url: "", groupName: "", status: "OPEN" },
  });

  async function onSubmit(values: NewPRLinkValues) {
    setFormError(null);
    try {
      await onCreate(values);
      reset();
      setOpen(false);
    } catch (error) {
      const apiError = getApiError(error);
      let mappedToField = false;
      for (const [backendField, formField] of Object.entries(
        BACKEND_FIELD_TO_FORM_FIELD,
      )) {
        const message = apiError.fields[backendField]?.[0];
        if (message) {
          setError(formField, { message });
          mappedToField = true;
        }
      }
      if (!mappedToField) {
        setFormError(getErrorMessage(error));
      }
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          setFormError(null);
        }
      }}
    >
      <DialogTrigger render={<Button />}>New PR link</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New PR link</DialogTitle>
          <DialogDescription>
            Share a pull request with the whole team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && <Alert tone="error">{formError}</Alert>}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pr-title">Title</Label>
            <Input
              id="pr-title"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pr-url">URL</Label>
            <Input
              id="pr-url"
              type="url"
              placeholder="https://…"
              {...register("url")}
              aria-invalid={!!errors.url}
            />
            {errors.url && (
              <p className="text-destructive text-xs">{errors.url.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pr-group">Group</Label>
            <Input
              id="pr-group"
              placeholder="e.g. numida-core"
              {...register("groupName")}
              aria-invalid={!!errors.groupName}
            />
            {errors.groupName && (
              <p className="text-destructive text-xs">
                {errors.groupName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pr-status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="pr-status">
                    <SelectValue>
                      {(value: keyof typeof STATUS_LABEL) =>
                        STATUS_LABEL[value]
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className="-mx-0 -mb-0 rounded-none border-0 bg-transparent p-0 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
