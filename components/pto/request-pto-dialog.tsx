"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENT_USER, ENGINEERS } from "@/lib/fixtures/engineers";

const HANDOVER_OPTIONS = ENGINEERS.filter((e) => e.name !== CURRENT_USER.name);

const requestPtoSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    handoverTo: z.string().min(1, "Choose a handover"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date can't be before the start date",
    path: ["endDate"],
  });

export type RequestPtoValues = z.infer<typeof requestPtoSchema>;

export interface RequestPTODialogProps {
  onCreate: (values: RequestPtoValues) => void;
}

/**
 * "Request PTO" dialog. The design's prototype leaves this button inert;
 * this fills in the natural interaction with a form built from the same
 * design tokens. Local state only — nothing is submitted to a backend.
 */
export function RequestPTODialog({ onCreate }: RequestPTODialogProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestPtoValues>({
    resolver: zodResolver(requestPtoSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      handoverTo: HANDOVER_OPTIONS[0]?.name ?? "",
    },
  });

  function onSubmit(values: RequestPtoValues) {
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
      <DialogTrigger render={<Button />}>Request PTO</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request PTO</DialogTitle>
          <DialogDescription>
            Log time off for {CURRENT_USER.name} and choose who covers for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            <Label htmlFor="pto-handover">Handover to</Label>
            <Controller
              control={control}
              name="handoverTo"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="pto-handover">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HANDOVER_OPTIONS.map((e) => (
                      <SelectItem key={e.name} value={e.name}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.handoverTo && (
              <p className="text-destructive text-xs">
                {errors.handoverTo.message}
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
            <Button type="submit">Submit request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
