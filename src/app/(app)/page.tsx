import { prisma } from "@/lib/db";
import { getDaySnapshot } from "@/lib/days";
import { formatClock12h, parseDateParam, todayIso } from "@/lib/date";
import { dayFromSchedule, getOrCreateWeekPlan } from "@/lib/weekPlans";
import { getWorkoutStreak } from "@/lib/streak";
import { TodayClient } from "./TodayClient";

// Reads live DB state on every request - must never be statically prerendered.
export const dynamic = "force-dynamic";

// Today is always today - no `?date=` browsing here (that's what Workout's
// and Nutrition's date nav are for). Deliberately ignores searchParams so a
// hand-edited URL can't reopen the date-picker this page removed.
export default async function TodayPage() {
  const dateStr = todayIso();
  const date = parseDateParam(dateStr);

  const [snapshot, weekPlan, profile, meals, streak] = await Promise.all([
    getDaySnapshot(date),
    getOrCreateWeekPlan(date),
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.meal.findMany({ where: { date } }),
    getWorkoutStreak(),
  ]);

  const today = dayFromSchedule(weekPlan.schedule, date);
  const proteinTargetG = profile?.proteinTargetG ?? 125;
  const proteinSoFar = meals.reduce((sum, m) => sum + m.proteinG, 0);

  return (
    <TodayClient
      date={dateStr}
      snapshot={snapshot}
      today={today}
      flexChoice={weekPlan.flexChoice}
      weekProblems={weekPlan.problems}
      bedtimeTarget={formatClock12h(profile?.bedtimeTarget ?? "01:00")}
      proteinTargetG={proteinTargetG}
      proteinSoFar={proteinSoFar}
      waterTargetMl={profile?.waterTargetMl ?? 3500}
      streak={streak}
    />
  );
}
