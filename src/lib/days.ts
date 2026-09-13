import { prisma } from "@/lib/db";

export async function getDaySnapshot(date: Date) {
  const [day, checklistItems, supplements] = await Promise.all([
    prisma.dailyLog.findUnique({ where: { date } }),
    prisma.checklistItem.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.supplement.findMany({ where: { active: true } }),
  ]);

  const [checklistLogs, supplementLogs] = await Promise.all([
    prisma.checklistLog.findMany({ where: { date } }),
    prisma.supplementLog.findMany({ where: { date } }),
  ]);
  const doneByKey = new Map(checklistLogs.map((l) => [l.itemKey, l.done]));
  const takenBySupplementId = new Map(supplementLogs.map((l) => [l.supplementId, l.taken]));

  return {
    date,
    weightKg: day?.weightKg ?? null,
    waistCm: day?.waistCm ?? null,
    bodyFatPct: day?.bodyFatPct ?? null,
    skeletalMuscleKg: day?.skeletalMuscleKg ?? null,
    armCm: day?.armCm ?? null,
    chestCm: day?.chestCm ?? null,
    thighCm: day?.thighCm ?? null,
    maxPullups: day?.maxPullups ?? null,
    maxPushups: day?.maxPushups ?? null,
    notes: day?.notes ?? null,
    waterMl: day?.waterMl ?? 0,
    ranDone: day?.ranDone ?? false,
    restingHr: day?.restingHr ?? null,
    sleepMinutes: day?.sleepMinutes ?? null,
    sleepStart: day?.sleepStart ?? null,
    sleepEnd: day?.sleepEnd ?? null,
    source: day?.source ?? "manual",
    checklist: checklistItems.map((item) => ({
      key: item.key,
      label: item.label,
      priority: item.priority,
      done: doneByKey.get(item.key) ?? false,
    })),
    supplements: supplements.map((s) => ({
      id: s.id,
      name: s.name,
      dose: s.dose,
      timing: s.timing,
      status: s.status,
      taken: takenBySupplementId.get(s.id) ?? false,
    })),
  };
}

export type DaySnapshot = Awaited<ReturnType<typeof getDaySnapshot>>;
