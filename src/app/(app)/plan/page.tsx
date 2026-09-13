import { parseDateParam, todayIso } from "@/lib/date";
import { getOrCreateWeekPlan } from "@/lib/weekPlans";
import { PlanClient } from "./PlanClient";

// Reads live DB state on every request - must never be statically prerendered.
export const dynamic = "force-dynamic";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const dateStr = dateParam ?? todayIso();
  const plan = await getOrCreateWeekPlan(parseDateParam(dateStr));

  return (
    <PlanClient
      date={dateStr}
      weekStartIso={plan.weekStart.toISOString().slice(0, 10)}
      runDays={plan.runDays}
      offDays={plan.offDays}
      flexChoice={plan.flexChoice}
    />
  );
}
