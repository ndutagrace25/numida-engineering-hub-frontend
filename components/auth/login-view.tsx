"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/hooks/use-auth";

function isSafeRedirectTarget(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

/**
 * Gates the login screen itself: an already-authenticated user should
 * never see the login form (they're bounced straight to the app, or to
 * `?next=` if that's how they got here), and while that check is in
 * flight we render nothing rather than flashing the form first.
 */
export function LoginView() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const next = searchParams.get("next");
    router.replace(next && isSafeRedirectTarget(next) ? next : "/dashboard");
  }, [isLoading, isAuthenticated, router, searchParams]);

  if (isLoading || isAuthenticated) {
    return <div className="bg-background min-h-dvh w-full" />;
  }

  return (
    <AuthCard title="Welcome back" subtitle="Log in with your Numida account">
      <LoginForm />
    </AuthCard>
  );
}
