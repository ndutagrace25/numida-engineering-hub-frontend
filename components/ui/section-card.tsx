import { cn } from "@/lib/utils";

export type SectionCardProps = React.ComponentProps<"div">;

/**
 * The plain white, bordered, 12px-radius surface used for every card in
 * the design (dashboard widgets, standup sections, history entries, PTO
 * rows, AOB posts, PR groups). No shadow — the design uses a 1px border
 * only, with no elevation effects anywhere.
 */
export function SectionCard({ className, ...props }: SectionCardProps) {
  return (
    <div
      className={cn("bg-card border-border rounded-xl border p-5", className)}
      {...props}
    />
  );
}

export function SectionCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mb-3.5 flex items-center justify-between", className)}
      {...props}
    />
  );
}

export function SectionCardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-[14.5px] font-semibold", className)} {...props} />
  );
}
