import { describe, expect, it } from "vitest";

import { getMonthOptions, getWeekOptions } from "@/lib/history-filter-options";

describe("getMonthOptions", () => {
  it("returns the requested number of months, newest first, with correct date ranges", () => {
    const options = getMonthOptions(new Date(2026, 6, 17), 3); // Jul 17, 2026

    expect(options.map((o) => o.label)).toEqual([
      "July 2026",
      "June 2026",
      "May 2026",
    ]);
    expect(options[0]).toMatchObject({
      value: "2026-07",
      dateAfter: "2026-07-01",
      dateBefore: "2026-07-31",
    });
    expect(options[1]).toMatchObject({
      dateAfter: "2026-06-01",
      dateBefore: "2026-06-30",
    });
  });
});

describe("getWeekOptions", () => {
  it("returns the requested number of weeks, newest first, each a Monday–Sunday range", () => {
    const options = getWeekOptions(new Date(2026, 6, 17), 3); // Fri Jul 17, 2026

    expect(options[0]).toMatchObject({
      value: "2026-07-13",
      label: "Week of Jul 13",
      dateAfter: "2026-07-13",
      dateBefore: "2026-07-19",
    });
    expect(options[1]).toMatchObject({
      value: "2026-07-06",
      dateAfter: "2026-07-06",
      dateBefore: "2026-07-12",
    });
    expect(options[2]).toMatchObject({
      value: "2026-06-29",
    });
  });
});
