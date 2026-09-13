/** Routine-adherence streak - pure functions, no I/O. A day counts toward
 * the streak if everything planned for it actually happened ("done") or
 * nothing was planned at all ("neutral" - an off day, or a flex day with
 * nothing to log) - only a "missed" day breaks it. This is the same
 * done/missed/neutral status the month calendar already uses
 * (domain/calendarStatus.ts), just walked as a run instead of a grid. */
import { calendarDayStatus, type CalendarDay } from "./calendarStatus";

export type StreakResult = { current: number; longest: number };

/**
 * `days` must be sorted ascending by date and must not extend past
 * `todayIsoStr` - an "upcoming" day would read as neither done nor missed
 * and this function doesn't try to guess what to do with one, so the
 * caller is responsible for only ever passing history up to today.
 */
export function computeStreak(days: CalendarDay[], todayIsoStr: string): StreakResult {
  let longest = 0;
  let running = 0;

  for (const day of days) {
    const status = calendarDayStatus(day, todayIsoStr);
    if (status === "done" || status === "neutral") {
      running++;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  // The current streak is the trailing run ending at the last day given -
  // walk backward from the end until the first break.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const status = calendarDayStatus(days[i], todayIsoStr);
    if (status === "done" || status === "neutral") {
      current++;
    } else {
      break;
    }
  }

  return { current, longest };
}
