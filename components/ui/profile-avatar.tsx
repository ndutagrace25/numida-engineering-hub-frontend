import { cn } from "@/lib/utils";
import type { PresenceStatus } from "@/types/engineer";

const PRESENCE_DOT_CLASS: Record<PresenceStatus, string> = {
  online: "bg-presence-online",
  away: "bg-presence-away",
  offline: "bg-presence-offline",
};

const SIZE_CLASS = {
  sm: "size-6 text-[10px]",
  md: "size-[26px] text-[10.5px]",
  lg: "size-8 text-xs",
  xl: "size-16 text-[22px]",
} as const;

export interface ProfileAvatarProps {
  initials: string;
  /** "accent" is the highlighted style used for the signed-in user. */
  variant?: "neutral" | "accent";
  size?: keyof typeof SIZE_CLASS;
  presence?: PresenceStatus;
  className?: string;
}

/**
 * The initials-only avatar used throughout the design (sidebar, top bar,
 * dashboard, history, PTO, AOB, profile). Matches the two avatar
 * treatments shown there: a neutral gray avatar for other people, and a
 * highlighted cyan-tinted one for the signed-in user.
 */
export function ProfileAvatar({
  initials,
  variant = "neutral",
  size = "md",
  presence,
  className,
}: ProfileAvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-bold",
          SIZE_CLASS[size],
          variant === "accent"
            ? "bg-accent text-accent-foreground"
            : "bg-muted text-text-icon",
        )}
      >
        {initials}
      </div>
      {presence && (
        <span
          aria-hidden="true"
          className={cn(
            "border-background absolute right-[-2px] bottom-[-2px] size-[9px] rounded-full border-2",
            PRESENCE_DOT_CLASS[presence],
          )}
        />
      )}
    </div>
  );
}
