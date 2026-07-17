"use client";

import { useContext } from "react";

import { AuthContext } from "@/providers/auth-provider";

/** Access to the current user, auth status, and login/logout/refreshUser. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
