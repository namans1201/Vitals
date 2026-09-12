import { prisma } from "@/lib/db";
import { parseDateParam, todayIso } from "@/lib/date";
import { NutritionClient } from "./NutritionClient";

// Reads live DB state on every request — must never be statically prerendered.
export const dynamic = "force-dynamic";

export default async function NutritionPage() {
  const dateStr = todayIso();
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
      proteinTargetG={profile?.proteinTargetG ?? 125}
      calorieTargetKcal={profile?.calorieTargetKcal ?? 2450}
      meals={meals}
      presets={visiblePresets}
      foods={foods}
    />
  );
}
