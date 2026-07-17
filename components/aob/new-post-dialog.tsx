"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const TAGS = ["Process", "Infra", "Engineering", "Announcement"] as const;

const newPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  tag: z.enum(TAGS),
  body: z.string().trim().min(1, "Body is required"),
});

export type NewPostValues = z.infer<typeof newPostSchema>;

export interface NewPostDialogProps {
  onCreate: (values: NewPostValues) => void;
}

/**
 * "New post" dialog for AOB. The design's prototype leaves this button
 * inert (a flat mockup has no dialog system); this fills in the natural
 * interaction with a form built from the same design tokens. Local state
 * only — nothing is submitted to a backend.
 */
export function NewPostDialog({ onCreate }: NewPostDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewPostValues>({
    resolver: zodResolver(newPostSchema),
    defaultValues: { title: "", tag: "Process", body: "" },
  });

  function onSubmit(values: NewPostValues) {
    onCreate(values);
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
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
            <Label htmlFor="aob-tag">Tag</Label>
            <Controller
              control={control}
              name="tag"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="aob-tag">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAGS.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="aob-body">Body</Label>
            <Textarea
              id="aob-body"
              rows={4}
              {...register("body")}
              aria-invalid={!!errors.body}
            />
            {errors.body && (
              <p className="text-destructive text-xs">{errors.body.message}</p>
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
            <Button type="submit">Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
