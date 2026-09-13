import { prisma } from "@/lib/db";
import { parseDateParam, todayIso } from "@/lib/date";
import { NutritionClient } from "./NutritionClient";

// Reads live DB state on every request - must never be statically prerendered.
export const dynamic = "force-dynamic";

export default async function NutritionPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const todayIsoStr = todayIso();
  const dateStr = dateParam ?? todayIsoStr;
  const date = parseDateParam(dateStr);

  const [profile, meals, presets, foods] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.meal.findMany({ where: { date }, orderBy: { time: "asc" } }),
    prisma.mealPreset.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.foodItem.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const mealPhase = profile?.mealPhase ?? "sep_eggs";
  const visiblePresets = presets.filter((p) => p.phase === "all" || p.phase === mealPhase);

  return (
    <NutritionClient
      date={dateStr}
      todayIsoStr={todayIsoStr}
      proteinTargetG={profile?.proteinTargetG ?? 125}
      calorieTargetKcal={profile?.calorieTargetKcal ?? 2450}
      fatTargetG={profile?.fatTargetG ?? 70}
      carbTargetG={profile?.carbTargetG ?? 300}
      meals={meals}
      presets={visiblePresets}
      foods={foods}
    />
  );
}
