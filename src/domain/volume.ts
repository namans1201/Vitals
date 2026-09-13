/** Weekly set volume per muscle group - BUILD_SPEC.md §6.3. Pure functions, no I/O. */

export const VOLUME_BAND = { min: 10, max: 20 } as const;

export type MuscleGroup =
  | "chest"
  | "back_vertical"
  | "back_horizontal"
  | "front_delt"
  | "side_delt"
  | "rear_delt"
  | "biceps"
  | "triceps"
  | "quads"
  | "hams_hinge"
  | "hams_knee"
  | "glutes"
  | "calves"
  | "core_antiext"
  | "core_antilat"
  | "core_antirot";

export type CountableSet = {
  completed: boolean;
  muscleGroup: MuscleGroup;
  /** Date of the workout this set belongs to (not the set's own id/index). */
  date: Date;
};

/**
 * Count a completed set once against its exercise's muscleGroup. A
 * WorkoutSet row already represents one full set regardless of whether the
 * exercise is unilateral (weight/reps aren't tracked per side in the
 * schema) - so unilateral exercises count once per set, not once per limb,
 * simply by never inflating the row count for them upstream of this
 * function. There is no separate multiplier to apply here.
 */
export const weeklySetsByMuscle = (
  sets: CountableSet[],
  from: Date,
  to: Date,
): Record<MuscleGroup, number> => {
  const result = {} as Record<MuscleGroup, number>;
  for (const set of sets) {
    if (!set.completed) continue;
    if (set.date < from || set.date > to) continue;
    result[set.muscleGroup] = (result[set.muscleGroup] ?? 0) + 1;
  }
  return result;
};

export const volumeFlag = (n: number): "under" | "ok" | "over" =>
  n < VOLUME_BAND.min ? "under" : n > VOLUME_BAND.max ? "over" : "ok";
