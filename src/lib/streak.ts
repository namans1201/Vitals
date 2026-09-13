import { prisma } from "@/lib/db";
import { parseDateParam, todayIso } from "@/lib/date";
import { getDayRange } from "@/lib/calendar";
import { computeStreak, type StreakResult } from "@/domain/streak";

const FALLBACK_LOOKBACK_DAYS = 90;

/** Routine-adherence streak from whenever the earliest logged day was, up
 * to today. Read-only, same as the calendar (no WeekPlan rows get created
 * just from checking a streak). */
export async function getWorkoutStreak(): Promise<StreakResult> {
  const todayIsoStr = todayIso();
  const today = parseDateParam(todayIsoStr);

  const [earliestLog, earliestWorkout] = await Promise.all([
    prisma.dailyLog.findFirst({ orderBy: { date: "asc" }, select: { date: true } }),
    prisma.workout.findFirst({ orderBy: { date: "asc" }, select: { date: true } }),
  ]);

  const candidates = [earliestLog?.date, earliestWorkout?.date].filter((d): d is Date => d != null);
  const start =
    candidates.length > 0
      ? candidates.reduce((earliest, d) => (d < earliest ? d : earliest))
      : (() => {
          const fallback = new Date(today);
          fallback.setUTCDate(fallback.getUTCDate() - FALLBACK_LOOKBACK_DAYS);
          return fallback;
        })();

  const days = await getDayRange(start, today);
  return computeStreak(days, todayIsoStr);
}
