"use client";

import { QueryProvider } from "@/providers/query-provider";

/**
 * Single composition point for every app-wide provider. The root layout
 * only ever imports this component, so adding a new provider later (theme,
 * auth context, etc.) means editing this file, not app/layout.tsx.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
