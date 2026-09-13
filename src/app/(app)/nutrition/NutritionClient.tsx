"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";
import { createMeal, deleteMeal } from "@/lib/api-client";
import { IconClose, IconPlus } from "@/components/icons";
import type { FoodItem, Meal, MealPreset } from "@/generated/prisma/client";

type Tab = "meals" | "foods";

export function NutritionClient({
  date,
  proteinTargetG,
  calorieTargetKcal,
  meals: initialMeals,
  presets,
  foods,
}: {
  date: string;
  proteinTargetG: number;
  calorieTargetKcal: number;
  meals: Meal[];
  presets: MealPreset[];
  foods: FoodItem[];
}) {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("meals");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>(initialMeals);

  const totalProtein = meals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCalories = meals.reduce((sum, m) => sum + m.caloriesKcal, 0);
  const remaining = Math.max(0, proteinTargetG - totalProtein);
  const proteinPct = Math.min(100, (totalProtein / proteinTargetG) * 100);

  async function log(
    busyKey: string,
    payload: { time: string; name: string; description?: string | null; proteinG: number; caloriesKcal: number },
  ) {
    setBusyId(busyKey);
    try {
      const meal = await createMeal({ date, ...payload });
      setMeals((prev) => [meal as Meal, ...prev]);
      toast(`+${Math.round(payload.proteinG)} g protein`);
    } catch {
      toast("Couldn't log that");
    } finally {
      setBusyId(null);
    }
  }

  function nowClock() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  }

  async function remove(id: number) {
    const previous = meals;
    setMeals((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteMeal(id);
    } catch {
      setMeals(previous);
      toast("Couldn't delete that");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card mb-3 p-4">
        <span className="micro-pill mb-3">Protein - target {proteinTargetG} g</span>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-panel-2">
          <div
            className={`h-full rounded-full transition-[width] ${proteinPct >= 100 ? "bg-good" : "bg-caution"}`}
            style={{ width: `${proteinPct}%` }}
          />
        </div>
        <div className="font-heading text-2xl font-bold text-ink">
          <span className="tabular-nums">{Math.round(totalProtein)}</span>
          <span className="text-sm font-normal text-faint"> / {proteinTargetG} g</span>
        </div>
        <div className="mt-1 text-xs text-faint">
          {remaining > 0 ? (
            <>
              <span className="tabular-nums text-caution">{Math.round(remaining)} g</span> still to go ·{" "}
            </>
          ) : (
            <span className="text-good">Target hit · </span>
          )}
          {totalCalories} kcal logged · target ~{calorieTargetKcal}
        </div>
      </div>

      <div className="mb-3 flex gap-1 rounded-full border border-line bg-panel-2 p-1">
        <TabButton active={tab === "meals"} onClick={() => setTab("meals")}>
          My meals
        </TabButton>
        <TabButton active={tab === "foods"} onClick={() => setTab("foods")}>
          Single foods
        </TabButton>
      </div>

      {tab === "meals" && (
        <div className="card mb-3 p-4">
          <div className="divide-y divide-line/60">
            {presets.map((preset) => (
              <button
                key={preset.id}
                disabled={busyId === `preset-${preset.id}`}
                onClick={() =>
                  log(`preset-${preset.id}`, {
                    time: preset.time,
                    name: preset.name,
                    description: preset.description,
                    proteinG: preset.proteinG,
                    caloriesKcal: preset.caloriesKcal,
                  })
                }
                className="flex w-full items-center justify-between gap-2 py-2.5 text-left disabled:opacity-50"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">{preset.name}</div>
                  <div className="text-xs text-faint">
                    {preset.time} · {preset.proteinG} g · {preset.caloriesKcal} kcal
                  </div>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <IconPlus size={16} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "foods" && (
        <div className="card mb-3 p-4">
          <p className="mb-2 text-xs text-faint">One tap = one serving. Tap twice for two.</p>
          <div className="divide-y divide-line/60">
            {foods.map((food) => (
              <button
                key={food.id}
                disabled={busyId === `food-${food.id}`}
                onClick={() =>
                  log(`food-${food.id}`, {
                    time: nowClock(),
                    name: `${food.name} (${food.servingLabel})`,
                    proteinG: food.proteinG,
                    caloriesKcal: food.caloriesKcal,
                  })
                }
                className="flex w-full items-center justify-between gap-2 py-2.5 text-left disabled:opacity-50"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">{food.name}</div>
                  <div className="text-xs text-faint">
                    {food.servingLabel} · {food.proteinG} g · {food.caloriesKcal} kcal
                  </div>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <IconPlus size={16} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-3">Logged today</span>
        {meals.length === 0 ? (
          <p className="py-4 text-center text-sm text-faint">Nothing yet - tap something above</p>
        ) : (
          <div className="divide-y divide-line/60">
            {meals.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                  <div className="truncate text-sm text-ink">{m.name}</div>
                  <div className="text-xs text-faint">
                    {m.time} · {m.proteinG} g · {m.caloriesKcal} kcal
                  </div>
                </div>
                <button
                  onClick={() => remove(m.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-bad hover:bg-bad/10"
                >
                  <IconClose size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border-l-2 border-bad bg-bad/5 px-3 py-2.5 text-xs text-dim">
        <b className="text-bad">Rest days too.</b> Same protein every day. Muscle protein synthesis
        stays elevated 24-48h after a session, so rest days are when you actually grow.
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-10 flex-1 rounded-full text-sm font-medium transition-colors ${
        active ? "bg-accent text-white" : "text-dim hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
