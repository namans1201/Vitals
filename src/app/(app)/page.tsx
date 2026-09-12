import { getDaySnapshot } from "@/lib/days";
import { formatTimeInTz, parseDateParam, todayIso } from "@/lib/date";
import { planForWeekday } from "@/domain/sessionTemplates";
import { TodayClient } from "./TodayClient";

// Reads live DB state on every request — must never be statically prerendered.
export const dynamic = "force-dynamic";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const dateStr = dateParam ?? todayIso();
  const date = parseDateParam(dateStr);
  const snapshot = await getDaySnapshot(date);
  const plan = planForWeekday(date.getUTCDay());

  return (
    <TodayClient
      date={dateStr}
      snapshot={{
        ...snapshot,
        sleepHours: snapshot.sleepMinutes != null ? snapshot.sleepMinutes / 60 : null,
        bedtimeLocal: snapshot.sleepStart ? formatTimeInTz(snapshot.sleepStart) : null,
      }}
      plan={plan}
    />
  );
}
