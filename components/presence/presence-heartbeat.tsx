"use client";

import { useEffect } from "react";

import { sendHeartbeat } from "@/lib/api/presence";

// Half the backend's 2-minute ONLINE threshold, so presence stays fresh
// as "online" the whole time this is mounted, not just at the boundary.
const HEARTBEAT_INTERVAL_MS = 60_000;

/**
 * Reports the signed-in user as active via POST /presence/heartbeat/ on
 * mount and every HEARTBEAT_INTERVAL_MS after, so "Who's Online" reflects
 * the current session — without this, presence never updates for anyone
 * and everyone eventually reads as offline. Renders nothing; mounted once
 * inside ProtectedRoute so it only runs while actually signed in.
 */
export function PresenceHeartbeat() {
  useEffect(() => {
    const ping = () => {
      sendHeartbeat().catch(() => {
        // A missed heartbeat just means presence goes stale a bit sooner —
        // not worth surfacing as a user-facing error.
      });
    };

    ping();
    const interval = setInterval(ping, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return null;
}
