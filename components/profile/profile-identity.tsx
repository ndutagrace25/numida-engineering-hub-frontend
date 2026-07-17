"use client";

import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { useAuth } from "@/hooks/use-auth";

/**
 * The avatar/name/role block atop the profile page, sourced from the
 * authenticated session (GET /auth/me/) instead of mock data. The backend's
 * User model has no role/team field, so that line is omitted rather than
 * inventing one — see the README's "Authentication" section.
 */
export function ProfileIdentity() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <div className="mb-3">
        <ProfileAvatar initials={user.initials} variant="accent" size="xl" />
      </div>
      <h2 className="text-lg font-bold">{user.displayName}</h2>
      <div className="text-muted-foreground mt-0.5 text-[13.5px]">
        {user.email}
      </div>
    </>
  );
}
