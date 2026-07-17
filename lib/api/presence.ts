import { apiClient } from "@/lib/api/client";

/** POST /presence/heartbeat/ — records the authenticated user as active right now. */
export async function sendHeartbeat(): Promise<void> {
  await apiClient.post("/presence/heartbeat/");
}
