/** Food-quantity scaling - pure functions, no I/O. A FoodItem's macros are
 * stored for `baseAmount` units of `unitLabel` (e.g. 100 g of paneer, or 1
 * egg); logging a different amount scales all four macros linearly from
 * that base. */

export type ScalableFood = {
  baseAmount: number;
  proteinG: number;
  caloriesKcal: number;
  fatG: number;
  carbG: number;
};

export type ScaledMacros = {
  proteinG: number;
  caloriesKcal: number;
  fatG: number;
  carbG: number;
};

export function scaleFoodMacros(food: ScalableFood, amount: number): ScaledMacros {
  const ratio = food.baseAmount > 0 ? Math.max(0, amount) / food.baseAmount : 0;
  return {
    proteinG: food.proteinG * ratio,
    caloriesKcal: Math.round(food.caloriesKcal * ratio),
    fatG: food.fatG * ratio,
    carbG: food.carbG * ratio,
  };
}
