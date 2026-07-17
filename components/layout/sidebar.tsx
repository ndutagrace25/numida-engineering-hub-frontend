"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Logomark } from "@/components/layout/logomark";
import { PRIMARY_NAV } from "@/components/layout/nav-config";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

function useIsActive() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (href: string, matchPrefix?: string) => {
    if (!matchPrefix) return pathname === href;
    if (pathname !== matchPrefix) return false;
    const [, query] = href.split("?");
    const wantedTab = new URLSearchParams(query).get("tab") ?? "my";
    const currentTab = searchParams.get("tab") ?? "my";
    return wantedTab === currentTab;
  };
}

const navItemClass = (active: boolean) =>
  cn(
    "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13.5px] transition-colors",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
    active
      ? "bg-accent text-accent-foreground font-semibold"
      : "text-text-icon hover:bg-muted font-medium",
  );

export interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

/**
 * The 232px-wide primary navigation column from the design. Shared by the
 * desktop app shell and reused (in a Sheet) for the mobile navigation
 * drawer via the `onNavigate` callback, which closes that sheet on click.
 */
export function Sidebar({ className, onNavigate }: SidebarProps) {
  const isActive = useIsActive();
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    onNavigate?.();
    // Local session state is always cleared regardless of outcome (see
    // AuthProvider's logoutMutation), so navigating to login afterwards is
    // safe even if the backend call itself failed (e.g. a network error).
    await logout().catch(() => {});
    router.push("/auth/login");
  }

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "bg-surface-sidebar border-border flex h-full w-[232px] min-w-[232px] flex-col border-r",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-[22px] pb-[18px]">
        <Logomark size="sm" />
        <span className="text-muted-foreground text-[11px] font-medium">
          Standup Hub
        </span>
      </div>

      <div className="mt-1 flex flex-col gap-0.5 px-3">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.matchPrefix);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={navItemClass(active)}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className="size-[18px]"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="border-border flex flex-col gap-0.5 border-t px-3 py-2.5">
        {user && (
          <Link
            href="/profile"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
              isActive("/profile") ? "bg-accent" : "hover:bg-muted",
            )}
            aria-current={isActive("/profile") ? "page" : undefined}
          >
            <ProfileAvatar initials={user.initials} size="md" />
            <div className="flex min-w-0 flex-col leading-[1.15]">
              <span className="truncate text-[13.5px] font-semibold">
                {user.displayName}
              </span>
              <span className="text-muted-foreground truncate text-[11px]">
                {user.email}
              </span>
            </div>
          </Link>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="text-muted-foreground hover:bg-muted focus-visible:ring-ring flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          <LogOut className="size-4" strokeWidth={1.6} aria-hidden="true" />
          <span>Log out</span>
        </button>
      </div>
    </nav>
  );
}
