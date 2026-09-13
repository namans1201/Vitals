import { describe, expect, it } from "vitest";
import { computeStreak } from "./streak";
import type { CalendarDay } from "./calendarStatus";

const TODAY = "2026-09-20";

function day(date: string, overrides: Partial<CalendarDay> = {}): CalendarDay {
  return {
    date,
    inMonth: true,
    run: false,
    lift: null,
    off: false,
    ranDone: false,
    liftTotalSets: 0,
    liftDoneSets: 0,
    ...overrides,
  };
}

describe("computeStreak", () => {
  it("counts a run of done days as the current streak", () => {
    const days = [
      day("2026-09-17", { run: true, ranDone: true }),
      day("2026-09-18", { run: true, ranDone: true }),
      day("2026-09-19", { run: true, ranDone: true }),
      day("2026-09-20", { run: true, ranDone: true }),
    ];
    expect(computeStreak(days, TODAY)).toEqual({ current: 4, longest: 4 });
  });

  it("treats an off day (nothing planned) as a pass, not a break", () => {
    const days = [
      day("2026-09-18", { run: true, ranDone: true }),
      day("2026-09-19", { off: true }), // nothing planned - neutral, keeps the streak alive
      day("2026-09-20", { run: true, ranDone: true }),
    ];
    expect(computeStreak(days, TODAY)).toEqual({ current: 3, longest: 3 });
  });

  it("breaks the current streak on a missed day", () => {
    const days = [
      day("2026-09-17", { run: true, ranDone: true }),
      day("2026-09-18", { run: true, ranDone: false }), // missed
      day("2026-09-19", { run: true, ranDone: true }),
      day("2026-09-20", { run: true, ranDone: true }),
    ];
    // current streak only counts the trailing run after the break
    expect(computeStreak(days, TODAY)).toEqual({ current: 2, longest: 2 });
  });

  it("remembers the longest streak even after it's been broken", () => {
    const days = [
      day("2026-09-14", { run: true, ranDone: true }),
      day("2026-09-15", { run: true, ranDone: true }),
      day("2026-09-16", { run: true, ranDone: true }),
      day("2026-09-17", { run: true, ranDone: false }), // breaks it
      day("2026-09-18", { run: true, ranDone: true }),
      day("2026-09-19", { off: true }),
      day("2026-09-20", { run: true, ranDone: true }),
    ];
    expect(computeStreak(days, TODAY)).toEqual({ current: 3, longest: 3 });
  });

  it("gives a lift day credit only once its sets are all completed", () => {
    const partial = [day("2026-09-20", { lift: "upper_a", liftTotalSets: 12, liftDoneSets: 8 })];
    expect(computeStreak(partial, TODAY)).toEqual({ current: 0, longest: 0 });

    const complete = [day("2026-09-20", { lift: "upper_a", liftTotalSets: 12, liftDoneSets: 12 })];
    expect(computeStreak(complete, TODAY)).toEqual({ current: 1, longest: 1 });
  });

  it("returns all zeros for an empty history", () => {
    expect(computeStreak([], TODAY)).toEqual({ current: 0, longest: 0 });
  });
});
