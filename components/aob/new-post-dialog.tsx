"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { getApiError, getErrorMessage } from "@/lib/api/errors";

const newPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim(),
  externalUrl: z.string().refine((v) => !v || /^https:\/\/.+/.test(v), {
    message: "Must be an HTTPS URL",
  }),
});

export type NewPostValues = z.infer<typeof newPostSchema>;

export interface NewPostDialogProps {
  onCreate: (values: NewPostValues) => Promise<unknown>;
}

const BACKEND_FIELD_TO_FORM_FIELD = {
  title: "title",
  description: "description",
  external_url: "externalUrl",
} as const;

/**
 * "New post" dialog for AOB. There's no "tag"/category field on the
 * backend's AOBItem model, so — unlike the design's mock data — this
 * form doesn't collect one; it adds an optional external link instead,
 * matching what the backend actually supports.
 */
export function NewPostDialog({ onCreate }: NewPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPostValues>({
    resolver: zodResolver(newPostSchema),
    defaultValues: { title: "", description: "", externalUrl: "" },
  });

  async function onSubmit(values: NewPostValues) {
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
      <DialogTrigger render={<Button />}>New post</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New AOB post</DialogTitle>
          <DialogDescription>
            Share an update with the whole team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && <Alert tone="error">{formError}</Alert>}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="aob-title">Title</Label>
            <Input
              id="aob-title"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="aob-body">Body</Label>
            <Textarea id="aob-body" rows={4} {...register("description")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="aob-external-url">Link (optional)</Label>
            <Input
              id="aob-external-url"
              type="url"
              placeholder="https://…"
              aria-invalid={!!errors.externalUrl}
              {...register("externalUrl")}
            />
            {errors.externalUrl && (
              <p className="text-destructive text-xs">
                {errors.externalUrl.message}
              </p>
            )}
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
              {isSubmitting ? "Posting…" : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
