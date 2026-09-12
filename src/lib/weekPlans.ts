import { prisma } from "@/lib/db";
import { startOfWeekMonday, toWeekday } from "@/lib/date";
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

/** What today specifically holds, pulled out of the week's schedule. */
export function dayFromSchedule(
  schedule: WeekSchedule,
  date: Date,
): DayAssignment | null {
  const weekday = toWeekday(date);
  return schedule.days.find((d) => d.weekday === weekday) ?? null;
}
