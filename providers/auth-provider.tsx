"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useEffect } from "react";

import { fetchCurrentUser, login, logout } from "@/lib/api/auth";
import { onUnauthorized } from "@/lib/api/client";
import type { AuthUser, LoginCredentials } from "@/types/auth";

export const authKeys = {
  currentUser: ["auth", "current-user"] as const,
};

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

/**
 * Owns the authenticated user's session state for the whole app, backed by
 * TanStack Query so every consumer of useAuth() shares one cached
 * GET /auth/me/ result instead of each issuing its own request.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const currentUserQuery = useQuery({
    queryKey: authKeys.currentUser,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(
    () =>
      onUnauthorized(() => {
        queryClient.setQueryData(authKeys.currentUser, null);
      }),
    [queryClient],
  );

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser, user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    // onSettled (not onSuccess): local session state must be cleared even if
    // the backend call itself fails (e.g. a network error) — otherwise the
    // cached user would still look authenticated after the caller has
    // already navigated to the login screen, bouncing them straight back.
    onSettled: () => {
      queryClient.setQueryData(authKeys.currentUser, null);
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    },
  });

  const refreshUser = useCallback(async () => {
    return queryClient.fetchQuery({
      queryKey: authKeys.currentUser,
      queryFn: fetchCurrentUser,
    });
  }, [queryClient]);

  const value: AuthContextValue = {
    user: currentUserQuery.data ?? null,
    isAuthenticated: Boolean(currentUserQuery.data),
    isLoading: currentUserQuery.isLoading,
    login: (credentials) => loginMutation.mutateAsync(credentials),
    logout: () => logoutMutation.mutateAsync(),
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
