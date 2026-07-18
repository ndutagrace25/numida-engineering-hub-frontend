"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DateRangeField } from "@/components/ui/date-range-field";
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
import { useAuth } from "@/hooks/use-auth";
import { getApiError, getErrorMessage } from "@/lib/api/errors";

const addPtoSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string(),
    handoverUrl: z.string().refine((v) => !v || /^https:\/\/.+/.test(v), {
      message: "Must be an HTTPS URL",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date can't be before the start date",
    path: ["endDate"],
  });

export type AddPtoValues = z.infer<typeof addPtoSchema>;

const BACKEND_FIELD_TO_FORM_FIELD = {
  start_date: "startDate",
  end_date: "endDate",
  reason: "reason",
  handover_url: "handoverUrl",
} as const;

export interface AddPTODialogProps {
  onCreate: (values: AddPtoValues) => Promise<unknown>;
}

/**
 * "Add PTO" dialog (not "Request" — there's no approval workflow, this
 * just logs the entry). The design's own button was inert (no onClick at
 * all); this fills in the natural interaction. Unlike the design's mock
 * data — which modeled "handover" as picking a specific person — the
 * backend only has an optional handover_url (a link to handover notes),
 * so that's what this form collects instead.
 */
export function AddPTODialog({ onCreate }: AddPTODialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddPtoValues>({
    resolver: zodResolver(addPtoSchema),
    defaultValues: { startDate: "", endDate: "", reason: "", handoverUrl: "" },
  });

  async function onSubmit(values: AddPtoValues) {
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
      <DialogTrigger render={<Button />}>Add PTO</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add PTO</DialogTitle>
          <DialogDescription>
            Log time off for {user?.displayName ?? "yourself"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {formError && <Alert tone="error">{formError}</Alert>}

          <Controller
            control={control}
            name="startDate"
            render={({ field: startField }) => (
              <Controller
                control={control}
                name="endDate"
                render={({ field: endField }) => (
                  <DateRangeField
                    startId="pto-start"
                    endId="pto-end"
                    startProps={{
                      value: startField.value,
                      onChange: startField.onChange,
                    }}
                    endProps={{
                      value: endField.value,
                      onChange: endField.onChange,
                    }}
                    startError={errors.startDate?.message}
                    endError={errors.endDate?.message}
                  />
                )}
              />
            )}
          />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pto-reason">Reason (optional)</Label>
            <Textarea id="pto-reason" {...register("reason")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pto-handover-url">
              Handover notes URL (optional)
            </Label>
            <Input
              id="pto-handover-url"
              type="url"
              placeholder="https://…"
              aria-invalid={!!errors.handoverUrl}
              {...register("handoverUrl")}
            />
            {errors.handoverUrl && (
              <p className="text-destructive text-xs">
                {errors.handoverUrl.message}
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
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
