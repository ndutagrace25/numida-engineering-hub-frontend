"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { CURRENT_USER } from "@/lib/fixtures/engineers";

/**
 * The top bar's avatar, made interactive with a small profile/logout
 * menu. The design shows a static avatar in this exact spot — this adds
 * a realistic, standard interaction without changing its appearance.
 */
export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`Account menu for ${CURRENT_USER.name}`}
      >
        <ProfileAvatar
          initials={CURRENT_USER.initials}
          variant="accent"
          size="lg"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-semibold">{CURRENT_USER.name}</span>
            <span className="text-muted-foreground text-xs font-normal">
              {CURRENT_USER.role}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />}>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
