import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  error: "border-state-error-border bg-state-error-bg text-state-error-body",
  success:
    "border-state-success-border bg-state-success-bg text-state-success-body",
} as const;

export interface AlertProps {
  tone: keyof typeof TONE_CLASSES;
  children: React.ReactNode;
  className?: string;
}

/**
 * Inline error/success banner using the design's state-error/state-success
 * tokens (first used ad hoc in the design guidelines reference screen — this
 * is the same visual pattern, extracted into a reusable component).
 */
export function Alert({ tone, children, className }: AlertProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-[10px] border p-3 text-[13px]",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
