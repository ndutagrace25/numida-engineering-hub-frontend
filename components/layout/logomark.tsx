import { cn } from "@/lib/utils";

const SIZE_MAP = {
  sm: { box: 28, dot: 10, radius: "rounded-lg" },
  lg: { box: 44, dot: 15, radius: "rounded-[11px]" },
} as const;

export interface LogomarkProps {
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

/**
 * The abstract mark used throughout the design: a dark teal rounded
 * square with a smaller cyan square inset. Reproduced exactly as drawn
 * in the design (plain divs, not the separately-exported logo PNG, which
 * the design itself never references).
 */
export function Logomark({ size = "sm", className }: LogomarkProps) {
  const { box, dot, radius } = SIZE_MAP[size];
  return (
    <div
      className={cn(
        "bg-sidebar-primary flex shrink-0 items-center justify-center",
        radius,
        className,
      )}
      style={{ width: box, height: box }}
    >
      <div
        className="bg-primary rounded-[3px]"
        style={{ width: dot, height: dot }}
      />
    </div>
  );
}
