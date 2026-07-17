"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";

/**
 * Single composition point for every app-wide provider. The root layout
 * only ever imports this component, so adding a new provider later (theme,
 * etc.) means editing this file, not app/layout.tsx.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
