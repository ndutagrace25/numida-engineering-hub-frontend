"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avoids an immediate refetch right after data is fetched on the
        // server and handed to the client during hydration.
        staleTime: 60 * 1000,
      },
    },
  });
}

// A module-level singleton in the browser (reused across re-renders), but
// never reused across requests on the server — otherwise one user's cached
// data could leak into another user's response.
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState (not useMemo) guarantees the client is only created once per
  // component instance, matching TanStack Query's recommended App Router
  // setup: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
