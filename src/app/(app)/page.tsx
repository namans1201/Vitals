import { prisma } from "@/lib/db";
import { getDaySnapshot } from "@/lib/days";
import { formatClock12h, parseDateParam, todayIso } from "@/lib/date";
import { dayFromSchedule, getOrCreateWeekPlan } from "@/lib/weekPlans";
import { TodayClient } from "./TodayClient";

// Reads live DB state on every request - must never be statically prerendered.
export const dynamic = "force-dynamic";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const dateStr = dateParam ?? todayIso();
  const date = parseDateParam(dateStr);

  const [snapshot, weekPlan, profile, meals] = await Promise.all([
    getDaySnapshot(date),
    getOrCreateWeekPlan(date),
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.meal.findMany({ where: { date } }),
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
      bedtimeTarget={formatClock12h(profile?.bedtimeTarget ?? "00:30")}
      proteinTargetG={proteinTargetG}
      proteinSoFar={proteinSoFar}
    />
  );
}
