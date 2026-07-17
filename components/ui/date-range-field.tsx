import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface DateRangeFieldProps {
  startId: string;
  endId: string;
  startLabel?: string;
  endLabel?: string;
  startProps: React.ComponentProps<"input">;
  endProps: React.ComponentProps<"input">;
  startError?: string;
  endError?: string;
}

/**
 * A paired start/end date control. The design doesn't show a calendar
 * widget anywhere (PTO ranges are always plain text), so this uses the
 * browser's native date input styled to match the rest of the form
 * fields rather than introducing a calendar UI the design never shows.
 */
export function DateRangeField({
  startId,
  endId,
  startLabel = "Start date",
  endLabel = "End date",
  startProps,
  endProps,
  startError,
  endError,
}: DateRangeFieldProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={startId}>{startLabel}</Label>
        <Input
          id={startId}
          type="date"
          aria-invalid={!!startError}
          {...startProps}
        />
        {startError && <p className="text-destructive text-xs">{startError}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={endId}>{endLabel}</Label>
        <Input id={endId} type="date" aria-invalid={!!endError} {...endProps} />
        {endError && <p className="text-destructive text-xs">{endError}</p>}
      </div>
    </div>
  );
}
