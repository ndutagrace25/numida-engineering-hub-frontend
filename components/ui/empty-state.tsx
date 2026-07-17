import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The dashed, diagonally-hatched placeholder used for "no results" states
 * (e.g. history with no matching filters). The repeating-linear-gradient
 * hatch pattern is the one deliberate "visual effect" in the imported
 * design, reproduced here exactly rather than substituted with a shadow
 * or animation.
 */
export function EmptyState({ children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground border-input rounded-xl border border-dashed p-12 text-center text-[13.5px]",
        className,
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, #F4F6F7 0px, #F4F6F7 8px, #FAFBFB 8px, #FAFBFB 16px)",
      }}
    >
      {children}
    </div>
  );
}
