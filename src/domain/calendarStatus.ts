/** Pure day-status logic for the calendar view - no I/O, safe to import from
 * client components (unlike lib/calendar.ts, which pulls in Prisma). */
import type { LiftSession } from "@/domain/weekPlan";

export type CalendarDay = {
  date: string;
  /** Whether this date falls in the requested month (padding days from the
   * adjacent month, shown to fill out the grid, are marked false). */
  inMonth: boolean;
  run: boolean;
  lift: LiftSession | null;
  off: boolean;
  ranDone: boolean;
  liftTotalSets: number;
  liftDoneSets: number;
};

export function calendarDayStatus(
  day: CalendarDay,
  todayIsoStr: string,
): "upcoming" | "done" | "missed" | "neutral" {
  if (day.date > todayIsoStr) return "upcoming";

  const hasRun = day.run;
  const hasLift = day.lift !== null;
  if (!hasRun && !hasLift) return "neutral";

  const runOk = !hasRun || day.ranDone;
  const liftOk = !hasLift || (day.liftTotalSets > 0 && day.liftDoneSets === day.liftTotalSets);
  return runOk && liftOk ? "done" : "missed";
}
