"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";

/**
 * Gates every route under app/(app) behind an authenticated session.
 * Redirects to /auth/login?next=<here> when there's no session, preserving
 * the current path (and any query string) so login can send the user back.
 * Renders nothing while the session check is in flight or a redirect is
 * pending, so protected content never flashes for a logged-out visitor.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    const query = searchParams.toString();
    const here = query ? `${pathname}?${query}` : pathname;
    router.replace(`/auth/login?next=${encodeURIComponent(here)}`);
  }, [isLoading, isAuthenticated, pathname, searchParams, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="bg-background min-h-dvh w-full" />;
  }

  return <>{children}</>;
}
