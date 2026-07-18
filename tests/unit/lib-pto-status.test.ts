import { describe, expect, it } from "vitest";

import { derivePTOStatus } from "@/lib/pto-status";

describe("derivePTOStatus", () => {
  const today = new Date(2026, 6, 18); // Jul 18, 2026

  it("returns Upcoming when the range starts after today", () => {
    expect(derivePTOStatus("2026-07-19", "2026-07-25", today)).toBe("Upcoming");
  });

  it("returns Active when today falls within the range", () => {
    expect(derivePTOStatus("2026-07-16", "2026-07-18", today)).toBe("Active");
    expect(derivePTOStatus("2026-07-18", "2026-07-18", today)).toBe("Active");
  });

  it("returns Completed when the range ended before today", () => {
    expect(derivePTOStatus("2026-07-10", "2026-07-17", today)).toBe(
      "Completed",
    );
  });
});
