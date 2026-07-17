import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/presence", () => ({
  sendHeartbeat: vi.fn().mockResolvedValue(undefined),
}));

import { PresenceHeartbeat } from "@/components/presence/presence-heartbeat";
import { sendHeartbeat } from "@/lib/api/presence";

describe("PresenceHeartbeat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends a heartbeat immediately on mount", () => {
    render(<PresenceHeartbeat />);
    expect(sendHeartbeat).toHaveBeenCalledTimes(1);
  });

  it("sends another heartbeat every 60 seconds while mounted", () => {
    render(<PresenceHeartbeat />);
    expect(sendHeartbeat).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60_000);
    expect(sendHeartbeat).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(60_000);
    expect(sendHeartbeat).toHaveBeenCalledTimes(3);
  });

  it("stops sending heartbeats after unmount", () => {
    const { unmount } = render(<PresenceHeartbeat />);
    expect(sendHeartbeat).toHaveBeenCalledTimes(1);

    unmount();
    vi.advanceTimersByTime(120_000);
    expect(sendHeartbeat).toHaveBeenCalledTimes(1);
  });

  it("renders nothing", () => {
    const { container } = render(<PresenceHeartbeat />);
    expect(container).toBeEmptyDOMElement();
  });
});
