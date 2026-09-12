"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { createMeal, deleteMeal } from "@/lib/api-client";
import type { Meal, MealPreset } from "@/generated/prisma/client";

export function NutritionClient({
  date,
  proteinTargetG,
  calorieTargetKcal,
  meals,
  presets,
}: {
  date: string;
  proteinTargetG: number;
  calorieTargetKcal: number;
  meals: Meal[];
  presets: MealPreset[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [busyPresetId, setBusyPresetId] = useState<number | null>(null);
  const [time, setTime] = useState("13:30");
  const [name, setName] = useState("");
  const [proteinG, setProteinG] = useState("0");
  const [caloriesKcal, setCaloriesKcal] = useState("0");
  const [busy, setBusy] = useState(false);

  const totalProtein = meals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCalories = meals.reduce((sum, m) => sum + m.caloriesKcal, 0);

  async function quickAdd(preset: MealPreset) {
    setBusyPresetId(preset.id);
    try {
      await createMeal({
        date,
        time: preset.time,
        name: preset.name,
        description: preset.description,
        proteinG: preset.proteinG,
        caloriesKcal: preset.caloriesKcal,
      });
      toast("Logged");
      router.refresh();
    } catch {
      toast("Couldn't log that meal");
    } finally {
      setBusyPresetId(null);
    }
  }

  async function addCustom() {
    if (!name.trim()) {
      toast("Name it first");
      return;
    }
    setBusy(true);
    try {
      await createMeal({
        date,
        time,
        name: name.trim(),
        proteinG: Number(proteinG) || 0,
        caloriesKcal: Number(caloriesKcal) || 0,
      });
      setName("");
      setProteinG("0");
      setCaloriesKcal("0");
      toast("Logged");
      router.refresh();
    } catch {
      toast("Couldn't log that meal");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    try {
      await deleteMeal(id);
      router.refresh();
    } catch {
      toast("Couldn't delete that meal");
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Protein — target {proteinTargetG} g
        </h2>
        <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-panel-2">
          <div
            className="h-full rounded-full bg-good transition-[width]"
            style={{ width: `${Math.min(100, (totalProtein / proteinTargetG) * 100)}%` }}
          />
        </div>
        <div className="text-xl font-bold text-ink">
          <span className="tabular-nums">{totalProtein}</span>
          <span className="text-sm font-normal text-faint"> / {proteinTargetG} g</span>
        </div>
        <div className="mt-0.5 text-xs text-faint">
          {totalCalories} kcal logged · target ~{calorieTargetKcal}
        </div>
      </div>

      <div className="mb-3 rounded-lg border-l-2 border-bad bg-bad/5 px-3 py-2.5 text-xs text-dim">
        <b className="text-bad">Rest days too.</b> Protein stays the same every day, including Wed/Thu —
        muscle protein synthesis stays elevated 24–48h after a session. Never drop it because you didn&apos;t
        train.
      </div>

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Quick add
        </h2>
        <div className="divide-y divide-line/50">
          {presets.map((preset) => (
            <div key={preset.id} className="flex items-center justify-between gap-2 py-2">
              <div className="min-w-0">
                <div className="text-sm font-medium text-ink">{preset.name}</div>
                <div className="text-xs text-faint">
                  {preset.time} · {preset.proteinG} g · {preset.caloriesKcal} kcal
                </div>
              </div>
              <button
                onClick={() => quickAdd(preset)}
                disabled={busyPresetId === preset.id}
                className="h-9 w-9 shrink-0 rounded-lg bg-accent text-white disabled:opacity-50"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Logged today
        </h2>
        {meals.length === 0 ? (
          <p className="py-4 text-center text-sm text-faint">Nothing logged yet — use quick add above</p>
        ) : (
          <div className="divide-y divide-line/50">
            {meals.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">{m.name}</div>
                  <div className="text-xs text-faint">
                    {m.time} · {m.proteinG} g · {m.caloriesKcal} kcal
                  </div>
                </div>
                <button onClick={() => remove(m.id)} className="shrink-0 text-xs text-bad">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Log something else
        </h2>
        <div className="mb-2 flex gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-11 w-28 shrink-0 rounded-lg border border-line bg-panel-2 px-2 text-sm text-ink outline-none focus:border-accent"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. paneer bhurji"
            className="h-11 flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div className="mb-2 flex gap-2">
          <input
            type="number"
            value={proteinG}
            onChange={(e) => setProteinG(e.target.value)}
            placeholder="Protein g"
            className="h-11 flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          />
          <input
            type="number"
            value={caloriesKcal}
            onChange={(e) => setCaloriesKcal(e.target.value)}
            placeholder="Calories"
            className="h-11 flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={addCustom}
          disabled={busy}
          className="h-11 w-full rounded-lg bg-accent text-sm font-medium text-white disabled:opacity-50"
        >
          Log it
        </button>
      </div>
    </div>
  );
}
