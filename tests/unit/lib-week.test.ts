import { describe, expect, it } from "vitest";

import { formatDateParam, formatWeekRangeLabel, getMondayOf } from "@/lib/week";

describe("getMondayOf", () => {
  it("returns the same date when it's already a Monday", () => {
    const monday = new Date(2026, 6, 13); // Jul 13, 2026 is a Monday
    expect(formatDateParam(getMondayOf(monday))).toBe("2026-07-13");
  });

  it("rolls back to Monday from a mid-week date", () => {
    const thursday = new Date(2026, 6, 16);
    expect(formatDateParam(getMondayOf(thursday))).toBe("2026-07-13");
  });

  it("rolls back to Monday from a Sunday", () => {
    const sunday = new Date(2026, 6, 19);
    expect(formatDateParam(getMondayOf(sunday))).toBe("2026-07-13");
  });
});

describe("formatDateParam", () => {
  it("pads single-digit months and days", () => {
    expect(formatDateParam(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("formatWeekRangeLabel", () => {
  it("formats a week within the same month", () => {
    expect(formatWeekRangeLabel("2026-07-13", "2026-07-19")).toBe("Jul 13–19");
  });

  it("formats a week that crosses a month boundary", () => {
    expect(formatWeekRangeLabel("2026-07-27", "2026-08-02")).toBe(
      "Jul 27 – Aug 2",
    );
  });
});
