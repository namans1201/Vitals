import { prisma } from "@/lib/db";
import { startOfWeekMonday, toDateParam, toWeekday } from "@/lib/date";
import {
  buildWeekSchedule,
  type DayAssignment,
  type Weekday,
  type WeekSchedule,
} from "@/domain/weekPlan";

/**
 * Default week: keeps the lift days the original programme used
 * (Mon Upper A, Tue Lower A, Fri Upper B, Sat Lower B) and fixes its one
 * admitted flaw by moving the Sunday long run to Thursday, so no run ever
 * lands the day after legs.
 */
export const DEFAULT_RUN_DAYS: Weekday[] = [0, 3, 4]; // Mon, Thu, Fri
export const DEFAULT_OFF_DAYS: Weekday[] = [2, 6]; // Wed, Sun
export const DEFAULT_FLEX_CHOICE = "run";

export type WeekPlanWithSchedule = {
  weekStart: Date;
  runDays: Weekday[];
  offDays: Weekday[];
  flexChoice: string;
  schedule: WeekSchedule;
  /** Set when the stored picks no longer produce a legal week. */
  problems: string[];
};

function asWeekdays(values: number[]): Weekday[] {
  return values.filter((v) => v >= 0 && v <= 6) as Weekday[];
}

/**
 * The plan for the week containing `date`, creating it from the defaults the
 * first time that week is opened. The schedule itself is always recomputed
 * from the rules, never read from storage.
 */
export async function getOrCreateWeekPlan(date: Date): Promise<WeekPlanWithSchedule> {
  const weekStart = startOfWeekMonday(date);

  const stored =
    (await prisma.weekPlan.findUnique({ where: { weekStart } })) ??
    (await prisma.weekPlan.create({
      data: {
        weekStart,
        runDays: DEFAULT_RUN_DAYS,
        offDays: DEFAULT_OFF_DAYS,
        flexChoice: DEFAULT_FLEX_CHOICE,
      },
    }));

  const runDays = asWeekdays(stored.runDays);
  const offDays = asWeekdays(stored.offDays);
  const result = buildWeekSchedule({ runDays, offDays });

  return {
    weekStart,
    runDays,
    offDays,
    flexChoice: stored.flexChoice,
    schedule: result.ok ? result.schedule : { days: [] },
    problems: result.ok ? [] : result.problems,
  };
}

/**
 * Same schedule `getOrCreateWeekPlan` would produce, but never writes a
 * WeekPlan row - for the calendar overview, which can be scrolled across
 * months that were never actually planned (before the programme started,
 * or far in the future) and shouldn't silently seed default rows for every
 * week just because someone looked at it.
 */
export async function previewWeekSchedule(date: Date): Promise<WeekSchedule> {
  const weekStart = startOfWeekMonday(date);
  const stored = await prisma.weekPlan.findUnique({ where: { weekStart } });
  return scheduleFromStored(stored);
}

/** The schedule a week's stored picks produce, falling back to the defaults
 * for a week that was never planned. Pure - no I/O. */
function scheduleFromStored(
  stored: { runDays: number[]; offDays: number[] } | null,
): WeekSchedule {
  const runDays = stored ? asWeekdays(stored.runDays) : DEFAULT_RUN_DAYS;
  const offDays = stored ? asWeekdays(stored.offDays) : DEFAULT_OFF_DAYS;
  const result = buildWeekSchedule({ runDays, offDays });
  return result.ok ? result.schedule : { days: [] };
}

/**
 * `previewWeekSchedule` for many weeks in one query, keyed by the week's
 * Monday as an ISO date string.
 *
 * The calendar and the streak both walk a contiguous range of days, and the
 * streak's range starts at the earliest thing ever logged - so asking per
 * week meant a serialized round-trip for every week of history, growing
 * forever as the log got longer. Weeks with no stored row still get an
 * entry, built from the defaults, exactly as the single-week version does.
 */
export async function previewWeekSchedules(
  weekStarts: Date[],
): Promise<Map<string, WeekSchedule>> {
  if (weekStarts.length === 0) return new Map();

  const stored = await prisma.weekPlan.findMany({
    where: { weekStart: { in: weekStarts } },
  });
  const storedByWeek = new Map(stored.map((s) => [toDateParam(s.weekStart), s]));

  const schedules = new Map<string, WeekSchedule>();
  for (const weekStart of weekStarts) {
    const key = toDateParam(weekStart);
    if (schedules.has(key)) continue;
    schedules.set(key, scheduleFromStored(storedByWeek.get(key) ?? null));
  }
  return schedules;
}

/** What today specifically holds, pulled out of the week's schedule. */
export function dayFromSchedule(
  schedule: WeekSchedule,
  date: Date,
): DayAssignment | null {
  const weekday = toWeekday(date);
  return schedule.days.find((d) => d.weekday === weekday) ?? null;
}
