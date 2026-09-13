import { prisma } from "@/lib/db";
import { toDateParam, toWeekday } from "@/lib/date";
import { previewWeekSchedules, dayFromSchedule } from "@/lib/weekPlans";
import type { CalendarDay } from "@/domain/calendarStatus";

export type { CalendarDay } from "@/domain/calendarStatus";

/**
 * Every day from `start` to `end` (inclusive, both UTC-midnight Dates) with
 * its plan/completion status - the shared building block behind both the
 * month calendar grid and the streak calculation. Read-only: never creates
 * WeekPlan rows for weeks nobody has planned yet (see previewWeekSchedule).
 */
export async function getDayRange(start: Date, end: Date): Promise<CalendarDay[]> {
  const allDates: Date[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    allDates.push(new Date(d));
  }

  // Every distinct Monday the range touches, so the week schedules can be
  // fetched in one query alongside the logs rather than one per week.
  const weekStartByDate = new Map<string, Date>();
  const weekStarts: Date[] = [];
  for (const date of allDates) {
    const monday = new Date(date);
    monday.setUTCDate(monday.getUTCDate() - toWeekday(date));
    const mondayIso = toDateParam(monday);
    weekStartByDate.set(toDateParam(date), monday);
    if (!weekStarts.some((w) => toDateParam(w) === mondayIso)) weekStarts.push(monday);
  }

  const [dailyLogs, workouts, schedules] = await Promise.all([
    prisma.dailyLog.findMany({
      where: { date: { gte: start, lte: end } },
      select: { date: true, ranDone: true },
    }),
    prisma.workout.findMany({
      where: { date: { gte: start, lte: end } },
      select: { date: true, sets: { select: { completed: true } } },
    }),
    previewWeekSchedules(weekStarts),
  ]);
  const ranDoneByDate = new Map(dailyLogs.map((l) => [toDateParam(l.date), l.ranDone]));
  const workoutByDate = new Map(
    workouts.map((w) => [
      toDateParam(w.date),
      { total: w.sets.length, done: w.sets.filter((s) => s.completed).length },
    ]),
  );

  const days: CalendarDay[] = [];
  for (const date of allDates) {
    const dateIso = toDateParam(date);
    const schedule = schedules.get(toDateParam(weekStartByDate.get(dateIso)!));
    const assignment = schedule ? dayFromSchedule(schedule, date) : null;
    const workout = workoutByDate.get(dateIso);

    days.push({
      date: dateIso,
      inMonth: true,
      run: assignment?.run ?? false,
      lift: assignment?.lift ?? null,
      off: assignment?.off ?? false,
      ranDone: ranDoneByDate.get(dateIso) ?? false,
      liftTotalSets: workout?.total ?? 0,
      liftDoneSets: workout?.done ?? 0,
    });
  }

  return days;
}

/**
 * Every day shown in a month's calendar grid (the requested month plus
 * enough padding days on either end to fill complete weeks, Monday first).
 */
export async function getMonthCalendar(monthIso: string): Promise<CalendarDay[]> {
  const [year, month] = monthIso.split("-").map(Number);
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const lastOfMonth = new Date(Date.UTC(year, month, 0));

  const gridStart = new Date(firstOfMonth);
  gridStart.setUTCDate(gridStart.getUTCDate() - toWeekday(firstOfMonth));
  const gridEnd = new Date(lastOfMonth);
  const trailingGap = 6 - toWeekday(lastOfMonth);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + trailingGap);

  const days = await getDayRange(gridStart, gridEnd);
  return days.map((d) => ({ ...d, inMonth: d.date >= toDateParam(firstOfMonth) && d.date <= toDateParam(lastOfMonth) }));
}
