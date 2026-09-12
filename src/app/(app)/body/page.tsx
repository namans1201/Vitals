import { prisma } from "@/lib/db";
import { parseDateParam, todayIso } from "@/lib/date";
import { recompositionSignal, type SeriesPoint } from "@/domain/trends";
import { BodyClient } from "./BodyClient";

// Reads live DB state on every request — must never be statically prerendered.
export const dynamic = "force-dynamic";

export default async function BodyPage() {
  const dateStr = todayIso();
  const date = parseDateParam(dateStr);

  const [todayLog, historyRows] = await Promise.all([
    prisma.dailyLog.findUnique({ where: { date } }),
    prisma.dailyLog.findMany({
      where: {
        OR: [
          { weightKg: { not: null } },
          { waistCm: { not: null } },
          { bodyFatPct: { not: null } },
          { skeletalMuscleKg: { not: null } },
        ],
      },
      orderBy: { date: "asc" },
      select: {
        date: true,
        weightKg: true,
        waistCm: true,
        bodyFatPct: true,
        skeletalMuscleKg: true,
        armCm: true,
        chestCm: true,
        thighCm: true,
        maxPullups: true,
        maxPushups: true,
      },
    }),
  ]);

  const seriesOf = (key: "weightKg" | "waistCm" | "bodyFatPct" | "skeletalMuscleKg"): SeriesPoint[] =>
    historyRows
      .filter((r) => r[key] != null)
      .map((r) => ({ date: r.date, value: r[key] as number }));

  const signal = recompositionSignal({
    weight: seriesOf("weightKg"),
    bodyFat: seriesOf("bodyFatPct"),
    muscle: seriesOf("skeletalMuscleKg"),
    waist: seriesOf("waistCm"),
  });

  return (
    <BodyClient
      date={dateStr}
      today={todayLog}
      history={historyRows}
      signal={signal}
    />
  );
}
