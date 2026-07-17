import Image from "next/image";

import { cn } from "@/lib/utils";

// Source image is 1080x400 (2.7:1) — the "sm"/"lg" heights below match the
// square footprint the previous CSS-drawn placeholder used, with width
// derived from that same ratio so the real logo isn't stretched/cropped.
const SIZE_MAP = {
  sm: { width: 76, height: 28 },
  lg: { width: 119, height: 44 },
} as const;

export interface LogomarkProps {
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

/** The Numida logo (public/numida-logo.jpg) used wherever the design calls for it. */
export function Logomark({ size = "sm", className }: LogomarkProps) {
  const { width, height } = SIZE_MAP[size];
  return (
    <Image
      src="/numida-logo.jpg"
      alt="Numida"
      width={width}
      height={height}
      className={cn("shrink-0 object-contain", className)}
      priority
    />
  );
}
