import { differenceInYears } from "date-fns";
import { prisma } from "@/lib/db";
import { todayIso } from "@/lib/date";
import { RunsClient } from "./RunsClient";

// Reads live DB state on every request — must never be statically prerendered.
export const dynamic = "force-dynamic";

const HISTORY_LIMIT = 30;

export default async function RunsPage() {
  const [profile, runs, restingHrDays] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.run.findMany({ orderBy: { date: "desc" }, take: HISTORY_LIMIT }),
    prisma.dailyLog.findMany({
      where: { restingHr: { not: null } },
      orderBy: { date: "desc" },
      take: 60,
      select: { date: true, restingHr: true },
    }),
  ]);

  const age = profile ? differenceInYears(new Date(), profile.dateOfBirth) : 24;

  return (
    <RunsClient
      date={todayIso()}
      age={age}
      runs={runs}
      restingHrSeries={[...restingHrDays].reverse()}
    />
  );
}
