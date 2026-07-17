import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps {
  /** Number of placeholder lines to render. */
  lines?: number;
  className?: string;
}

/**
 * Generic "content is loading" placeholder, matching the two-bar loading
 * preview on the Design guidelines page. ShadCN's Skeleton keeps its
 * default pulse animation here — that's a functional loading indicator,
 * not decorative flair, so it's kept even though a static mockup can't
 * depict motion.
 */
export function LoadingSkeleton({
  lines = 2,
  className,
}: LoadingSkeletonProps) {
  const widths = ["70%", "45%", "85%", "60%"];
  return (
    <div
      className={cn("flex flex-col gap-1.5", className)}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-2 rounded"
          style={{ width: widths[i % widths.length] }}
        />
      ))}
    </div>
  );
}
