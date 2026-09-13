"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";
import { createMeal, deleteMeal, patchProfileTargets } from "@/lib/api-client";
import { DateNav } from "@/components/DateNav";
import { IconClose, IconMinus, IconPlus } from "@/components/icons";
import { scaleFoodMacros, type ScaledMacros } from "@/domain/nutrition";
import { useEscapeKey } from "@/lib/useEscapeKey";
import type { FoodItem, Meal, MealPreset } from "@/generated/prisma/client";

type Tab = "meals" | "foods" | "builder";

type Targets = {
  proteinTargetG: number;
  calorieTargetKcal: number;
  fatTargetG: number;
  carbTargetG: number;
};

export function NutritionClient({
  date,
  todayIsoStr,
  proteinTargetG,
  calorieTargetKcal,
  fatTargetG,
  carbTargetG,
  meals: initialMeals,
  presets,
  foods,
}: Targets & {
  date: string;
  todayIsoStr: string;
  meals: Meal[];
  presets: MealPreset[];
  foods: FoodItem[];
}) {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("meals");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [targets, setTargets] = useState<Targets>({
    proteinTargetG,
    calorieTargetKcal,
    fatTargetG,
    carbTargetG,
  });
  const [targetsModalOpen, setTargetsModalOpen] = useState(false);
  const [quantityFood, setQuantityFood] = useState<FoodItem | null>(null);

  const totals = meals.reduce(
    (sum, m) => ({
      proteinG: sum.proteinG + m.proteinG,
      caloriesKcal: sum.caloriesKcal + m.caloriesKcal,
      fatG: sum.fatG + m.fatG,
      carbG: sum.carbG + m.carbG,
    }),
    { proteinG: 0, caloriesKcal: 0, fatG: 0, carbG: 0 },
  );

  async function log(
    busyKey: string,
    payload: {
      time: string;
      name: string;
      description?: string | null;
      proteinG: number;
      caloriesKcal: number;
      fatG: number;
      carbG: number;
    },
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
    <div className="mx-auto max-w-2xl animate-in">
      <DateNav date={date} todayIsoStr={todayIsoStr} basePath="/nutrition" />

      <div className="card mb-3 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="micro-pill">Today&apos;s macros</span>
          <button
            onClick={() => setTargetsModalOpen(true)}
            className="text-xs font-medium text-dim hover:text-ink"
          >
            Edit targets
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <MacroBar label="Protein" value={totals.proteinG} target={targets.proteinTargetG} unit="g" />
          <MacroBar label="Calories" value={totals.caloriesKcal} target={targets.calorieTargetKcal} unit="kcal" />
          <MacroBar label="Fat" value={totals.fatG} target={targets.fatTargetG} unit="g" />
          <MacroBar label="Carbs" value={totals.carbG} target={targets.carbTargetG} unit="g" />
        </div>
      </div>

      <div className="mb-3 flex gap-1 rounded-full border border-line bg-panel-2 p-1">
        <TabButton active={tab === "meals"} onClick={() => setTab("meals")}>
          My meals
        </TabButton>
        <TabButton active={tab === "foods"} onClick={() => setTab("foods")}>
          Single foods
        </TabButton>
        <TabButton active={tab === "builder"} onClick={() => setTab("builder")}>
          Build a meal
        </TabButton>
      </div>

      {tab === "meals" && (
        <div key="meals" className="card tab-fade mb-3 p-4">
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
                    fatG: preset.fatG,
                    carbG: preset.carbG,
                  })
                }
                className="flex w-full items-center justify-between gap-2 py-2.5 text-left disabled:opacity-50"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">{preset.name}</div>
                  {preset.description && (
                    <div className="mt-0.5 text-xs text-dim">{preset.description}</div>
                  )}
                  <div className="mt-0.5 text-xs text-faint">
                    {preset.time} · {preset.proteinG} g protein · {preset.caloriesKcal} kcal
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
        <div key="foods" className="card tab-fade mb-3 p-4">
          <p className="mb-2 text-xs text-faint">Tap a food, set how much you actually had.</p>
          <div className="divide-y divide-line/60">
            {foods.map((food) => (
              <button
                key={food.id}
                onClick={() => setQuantityFood(food)}
                className="flex w-full items-center justify-between gap-2 py-2.5 text-left"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">{food.name}</div>
                  <div className="text-xs text-faint">
                    {food.servingLabel} · {food.proteinG} g protein · {food.caloriesKcal} kcal
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

      {tab === "builder" && (
        <div key="builder" className="tab-fade">
          <MealBuilder
            foods={foods}
            onLog={(payload) => {
              log("builder", { time: nowClock(), ...payload });
            }}
          />
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
                  {m.description && (
                    <div className="mt-0.5 text-xs text-dim">{m.description}</div>
                  )}
                  <div className="mt-0.5 text-xs text-faint">
                    {m.time} · {m.proteinG} g protein · {m.caloriesKcal} kcal
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

      {quantityFood && (
        <QuantityModal
          food={quantityFood}
          onClose={() => setQuantityFood(null)}
          onLog={(scaled, amount) => {
            log(`food-${quantityFood.id}`, {
              time: nowClock(),
              name: `${quantityFood.name} (${amount} ${quantityFood.unitLabel})`,
              ...scaled,
            });
            setQuantityFood(null);
          }}
        />
      )}

      {targetsModalOpen && (
        <TargetsModal
          targets={targets}
          onClose={() => setTargetsModalOpen(false)}
          onSave={async (next) => {
            const previous = targets;
            setTargets(next);
            setTargetsModalOpen(false);
            try {
              await patchProfileTargets(next);
            } catch {
              setTargets(previous);
              toast("Couldn't save targets - check your connection");
            }
          }}
        />
      )}
    </div>
  );
}

function MacroBar({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
}) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="micro text-faint">{label}</span>
        <span className="text-xs tabular-nums text-dim">
          <b className="text-ink">{Math.round(value)}</b> / {target} {unit}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-panel-2">
        <div
          className={`h-full rounded-full transition-[width] ${pct >= 100 ? "bg-good" : "bg-caution"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Quantity-based logging for a single food - protein/calories/fat/carbs all
 * scale from the food's base amount (see domain/nutrition.ts), so entering
 * "150" for paneer (base 100 g) logs 1.5x every macro, not just protein. */
function QuantityModal({
  food,
  onClose,
  onLog,
}: {
  food: FoodItem;
  onClose: () => void;
  onLog: (scaled: { proteinG: number; caloriesKcal: number; fatG: number; carbG: number }, amount: number) => void;
}) {
  const [amountStr, setAmountStr] = useState(food.baseAmount.toString());
  const amount = Number(amountStr) || 0;
  const scaled = scaleFoodMacros(food, amount);
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 px-4 overlay-in" onClick={onClose} role="presentation">
      <div className="card modal-in w-full max-w-xs p-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-heading text-sm font-bold text-ink">{food.name}</span>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-dim hover:bg-panel-2 hover:text-ink" aria-label="Close">
            <IconClose size={15} />
          </button>
        </div>

        <label className="mb-3 flex items-center gap-2">
          <input
            type="number"
            autoFocus
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            className="h-11 flex-1 rounded-xl border border-line bg-panel-2 px-3 text-center text-sm text-ink outline-none focus:border-accent"
          />
          <span className="text-sm text-dim">{food.unitLabel}</span>
        </label>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-panel-2 p-3 text-xs">
          <div>
            <div className="text-faint">Protein</div>
            <div className="tabular-nums font-semibold text-ink">{scaled.proteinG.toFixed(1)} g</div>
          </div>
          <div>
            <div className="text-faint">Calories</div>
            <div className="tabular-nums font-semibold text-ink">{scaled.caloriesKcal} kcal</div>
          </div>
          <div>
            <div className="text-faint">Fat</div>
            <div className="tabular-nums font-semibold text-ink">{scaled.fatG.toFixed(1)} g</div>
          </div>
          <div>
            <div className="text-faint">Carbs</div>
            <div className="tabular-nums font-semibold text-ink">{scaled.carbG.toFixed(1)} g</div>
          </div>
        </div>

        <button
          onClick={() => onLog(scaled, amount)}
          disabled={amount <= 0}
          className="mt-4 h-11 w-full rounded-full bg-accent text-sm font-medium text-white disabled:opacity-40"
        >
          Log it
        </button>
      </div>
    </div>
  );
}

type BuilderIngredient = { food: FoodItem; amountStr: string };

/** Compose one logged meal from several ingredients - e.g. a protein shake
 * (whey + milk + banana) - by summing each ingredient's scaled macros
 * (domain/nutrition.ts) into a single Meal row, instead of logging each
 * ingredient as its own separate entry. */
function MealBuilder({
  foods,
  onLog,
}: {
  foods: FoodItem[];
  onLog: (payload: { name: string } & ScaledMacros) => void;
}) {
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [ingredients, setIngredients] = useState<BuilderIngredient[]>([]);
  const [mealName, setMealName] = useState("");

  function addIngredient() {
    if (!selectedFoodId) return;
    const food = foods.find((f) => f.id === Number(selectedFoodId));
    if (!food) return;
    setIngredients((prev) => [...prev, { food, amountStr: food.baseAmount.toString() }]);
    setSelectedFoodId("");
  }

  function updateAmount(index: number, amountStr: string) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, amountStr } : ing)));
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  const scaledIngredients = ingredients.map((ing) => scaleFoodMacros(ing.food, Number(ing.amountStr) || 0));
  const totals = scaledIngredients.reduce(
    (sum, m) => ({
      proteinG: sum.proteinG + m.proteinG,
      caloriesKcal: sum.caloriesKcal + m.caloriesKcal,
      fatG: sum.fatG + m.fatG,
      carbG: sum.carbG + m.carbG,
    }),
    { proteinG: 0, caloriesKcal: 0, fatG: 0, carbG: 0 },
  );

  function logMeal() {
    const name = mealName.trim() || ingredients.map((ing) => ing.food.name).join(" + ");
    onLog({
      name,
      proteinG: totals.proteinG,
      caloriesKcal: Math.round(totals.caloriesKcal),
      fatG: totals.fatG,
      carbG: totals.carbG,
    });
    setIngredients([]);
    setMealName("");
  }

  return (
    <div className="card mb-3 p-4">
      <p className="mb-3 text-xs text-faint">
        Combine a few ingredients - a shake, a mixed plate - into one logged meal.
      </p>

      <div className="mb-3 flex gap-2">
        <select
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(e.target.value)}
          className="h-11 flex-1 rounded-xl border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="">Choose an ingredient…</option>
          {foods.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <button
          onClick={addIngredient}
          disabled={!selectedFoodId}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-white disabled:opacity-40"
        >
          <IconPlus size={16} />
          Add
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="mb-3 space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl bg-panel-2 p-2.5">
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{ing.food.name}</span>
              <input
                type="number"
                value={ing.amountStr}
                onChange={(e) => updateAmount(i, e.target.value)}
                className="h-9 w-16 shrink-0 rounded-lg border border-line bg-panel px-1 text-center text-sm text-ink outline-none focus:border-accent"
              />
              <span className="w-10 shrink-0 text-xs text-faint">{ing.food.unitLabel}</span>
              <button
                onClick={() => removeIngredient(i)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint hover:bg-line/60 hover:text-bad"
                aria-label={`Remove ${ing.food.name}`}
              >
                <IconMinus size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {ingredients.length > 0 && (
        <>
          <div className="mb-3 grid grid-cols-4 gap-2 rounded-xl bg-panel-2 p-3 text-center text-xs">
            <div>
              <div className="text-faint">Protein</div>
              <div className="tabular-nums font-semibold text-ink">{totals.proteinG.toFixed(1)}g</div>
            </div>
            <div>
              <div className="text-faint">Cal</div>
              <div className="tabular-nums font-semibold text-ink">{totals.caloriesKcal}</div>
            </div>
            <div>
              <div className="text-faint">Fat</div>
              <div className="tabular-nums font-semibold text-ink">{totals.fatG.toFixed(1)}g</div>
            </div>
            <div>
              <div className="text-faint">Carbs</div>
              <div className="tabular-nums font-semibold text-ink">{totals.carbG.toFixed(1)}g</div>
            </div>
          </div>

          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder={ingredients.map((ing) => ing.food.name).join(" + ")}
            className="mb-3 h-11 w-full rounded-xl border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          />

          <button
            onClick={logMeal}
            className="h-11 w-full rounded-full bg-accent text-sm font-medium text-white"
          >
            Log this meal
          </button>
        </>
      )}
    </div>
  );
}

function TargetsModal({
  targets,
  onClose,
  onSave,
}: {
  targets: Targets;
  onClose: () => void;
  onSave: (next: Targets) => void;
}) {
  const [form, setForm] = useState(targets);
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 px-4 overlay-in" onClick={onClose} role="presentation">
      <div className="card modal-in w-full max-w-xs p-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-heading text-sm font-bold text-ink">Edit targets</span>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-dim hover:bg-panel-2 hover:text-ink" aria-label="Close">
            <IconClose size={15} />
          </button>
        </div>

        <div className="space-y-2.5">
          <TargetField label="Protein (g)" value={form.proteinTargetG} onChange={(v) => setForm((f) => ({ ...f, proteinTargetG: v }))} />
          <TargetField label="Calories (kcal)" value={form.calorieTargetKcal} onChange={(v) => setForm((f) => ({ ...f, calorieTargetKcal: v }))} />
          <TargetField label="Fat (g)" value={form.fatTargetG} onChange={(v) => setForm((f) => ({ ...f, fatTargetG: v }))} />
          <TargetField label="Carbs (g)" value={form.carbTargetG} onChange={(v) => setForm((f) => ({ ...f, carbTargetG: v }))} />
        </div>

        <button onClick={() => onSave(form)} className="mt-4 h-11 w-full rounded-full bg-accent text-sm font-medium text-white">
          Save
        </button>
      </div>
    </div>
  );
}

function TargetField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm text-dim">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="h-10 w-24 rounded-xl border border-line bg-panel-2 px-2 text-center text-sm text-ink outline-none focus:border-accent"
      />
    </label>
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
