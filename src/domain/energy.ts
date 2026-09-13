/** Energy needs - BUILD_SPEC.md §6.2. Pure functions, no I/O. Recompute from
 * current weight; never hardcode a value from the spec's worked example. */

/** Mifflin-St Jeor. */
export const bmr = (kg: number, cm: number, age: number, sex: "male" | "female"): number =>
  10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);

export const tdee = (bmrVal: number, activityFactor = 1.5): number => bmrVal * activityFactor;

export const proteinTarget = (kg: number, gPerKg = 2.1): number => Math.round(kg * gPerKg);
