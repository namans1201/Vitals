/**
 * Session templates - BUILD_SPEC.md §10 / 01-plan/02-full-programme.md §4.
 *
 * Not a DB model: the §4 schema only has date-bound Workout/WorkoutSet rows,
 * and §5.8 Settings never asks for session templates to be editable in the
 * UI, so this is a static, pure-data constant - no I/O, matching the rest of
 * src/domain/. Exercise names below must match `Exercise.name` in
 * prisma/seed.ts so the Workout page (Phase 1) can look up cues/rationale by
 * name.
 */

export type SessionType = "upper_a" | "lower_a" | "upper_b" | "lower_b" | "full_body";

/** How the target range in `repsMin`/`repsMax` should be read. */
export type RepUnit = "reps" | "seconds" | "metres";

export type SessionTemplateExercise = {
  exerciseName: string;
  order: number;
  targetSets: number;
  repsMin: number;
  repsMax: number;
  /** Default "reps". */
  unit?: RepUnit;
  /** True for exercises logged/loaded per arm, leg, or side. */
  perSide?: boolean;
  /** Bulgarian split squat in Lower B, suitcase carry, etc. - nice-to-have, not core. */
  optional?: boolean;
};

export const SESSION_LABELS: Record<SessionType, string> = {
  upper_a: "Upper A - push emphasis",
  lower_a: "Lower A - squat emphasis",
  upper_b: "Upper B - pull emphasis",
  lower_b: "Lower B - hinge / unilateral emphasis",
  full_body: "Full body (Week 6 reset)",
};

export const SESSION_TEMPLATES: Record<SessionType, SessionTemplateExercise[]> = {
  upper_a: [
    { exerciseName: "Pull-up", order: 1, targetSets: 4, repsMin: 1, repsMax: 1, unit: "reps" }, // AMRAP
    { exerciseName: "Deficit push-up", order: 2, targetSets: 4, repsMin: 8, repsMax: 15 },
    { exerciseName: "Pike push-up", order: 3, targetSets: 3, repsMin: 6, repsMax: 12 },
    { exerciseName: "DB floor press", order: 4, targetSets: 3, repsMin: 10, repsMax: 15 },
    { exerciseName: "Inverted row", order: 5, targetSets: 3, repsMin: 10, repsMax: 15 },
    { exerciseName: "DB lateral raise", order: 6, targetSets: 4, repsMin: 12, repsMax: 20 },
    { exerciseName: "Band pull-apart", order: 7, targetSets: 3, repsMin: 20, repsMax: 20 },
    { exerciseName: "Overhead triceps extension", order: 8, targetSets: 3, repsMin: 12, repsMax: 15 },
    { exerciseName: "Incline curl", order: 9, targetSets: 3, repsMin: 10, repsMax: 15 },
    { exerciseName: "Hollow hold", order: 10, targetSets: 3, repsMin: 30, repsMax: 30, unit: "seconds" },
    { exerciseName: "Dead hang", order: 11, targetSets: 2, repsMin: 1, repsMax: 1, unit: "seconds" }, // max time
  ],
  lower_a: [
    { exerciseName: "Goblet squat", order: 1, targetSets: 4, repsMin: 10, repsMax: 15 },
    { exerciseName: "Bulgarian split squat", order: 2, targetSets: 3, repsMin: 8, repsMax: 12, perSide: true },
    { exerciseName: "DB RDL", order: 3, targetSets: 3, repsMin: 12, repsMax: 15 },
    { exerciseName: "Nordic negative", order: 4, targetSets: 3, repsMin: 8, repsMax: 12 },
    { exerciseName: "Single-leg hip thrust", order: 5, targetSets: 3, repsMin: 12, repsMax: 20, perSide: true },
    { exerciseName: "Standing calf raise", order: 6, targetSets: 4, repsMin: 15, repsMax: 20, perSide: true },
    { exerciseName: "Pallof press", order: 7, targetSets: 3, repsMin: 12, repsMax: 12, perSide: true },
    { exerciseName: "Dead bug", order: 8, targetSets: 3, repsMin: 10, repsMax: 10, perSide: true },
    { exerciseName: "Skipping", order: 9, targetSets: 5, repsMin: 60, repsMax: 60, unit: "seconds" },
  ],
  upper_b: [
    { exerciseName: "Chin-up", order: 1, targetSets: 4, repsMin: 1, repsMax: 1, unit: "reps" }, // AMRAP
    { exerciseName: "Single-arm DB row", order: 2, targetSets: 4, repsMin: 10, repsMax: 12, perSide: true },
    { exerciseName: "Diamond push-up", order: 3, targetSets: 3, repsMin: 10, repsMax: 15 },
    { exerciseName: "Band chest fly", order: 4, targetSets: 3, repsMin: 12, repsMax: 15 },
    { exerciseName: "DB Arnold press", order: 5, targetSets: 3, repsMin: 10, repsMax: 12 },
    { exerciseName: "DB lateral raise", order: 6, targetSets: 3, repsMin: 12, repsMax: 20 },
    { exerciseName: "Band face pull", order: 7, targetSets: 3, repsMin: 15, repsMax: 20 },
    { exerciseName: "Hammer curl", order: 8, targetSets: 3, repsMin: 10, repsMax: 15 },
    { exerciseName: "Bench dip", order: 9, targetSets: 3, repsMin: 10, repsMax: 15 },
    { exerciseName: "Side plank", order: 10, targetSets: 3, repsMin: 30, repsMax: 30, unit: "seconds", perSide: true },
    { exerciseName: "Dead hang", order: 11, targetSets: 2, repsMin: 1, repsMax: 1, unit: "seconds" }, // max time
  ],
  lower_b: [
    { exerciseName: "Bulgarian split squat", order: 1, targetSets: 4, repsMin: 8, repsMax: 12, perSide: true },
    { exerciseName: "DB reverse lunge", order: 2, targetSets: 3, repsMin: 10, repsMax: 12, perSide: true },
    { exerciseName: "Single-leg RDL", order: 3, targetSets: 3, repsMin: 10, repsMax: 12, perSide: true },
    { exerciseName: "Band leg curl", order: 4, targetSets: 3, repsMin: 12, repsMax: 15 },
    { exerciseName: "DB step-up", order: 5, targetSets: 3, repsMin: 10, repsMax: 10, perSide: true },
    { exerciseName: "Seated calf raise", order: 6, targetSets: 4, repsMin: 15, repsMax: 20 },
    { exerciseName: "Hanging knee raise", order: 7, targetSets: 3, repsMin: 8, repsMax: 15 },
    { exerciseName: "Long-lever plank", order: 8, targetSets: 2, repsMin: 30, repsMax: 45, unit: "seconds" },
    { exerciseName: "Pallof press", order: 9, targetSets: 3, repsMin: 12, repsMax: 12, perSide: true },
    {
      exerciseName: "Suitcase carry",
      order: 10,
      targetSets: 2,
      repsMin: 30,
      repsMax: 40,
      unit: "metres",
      perSide: true,
      optional: true,
    },
  ],
  // The Week 6 reset (01-plan/01-current-plan.md, 11 Sep 2026) paused the
  // four-day split above in favour of one 30-minute session a week, built
  // around pull-ups. Re-enable the split once three consecutive Saturdays of
  // full_body have happened - see ACTIVE_PROGRAM below.
  full_body: [
    { exerciseName: "Pull-up", order: 1, targetSets: 3, repsMin: 1, repsMax: 1, unit: "reps" }, // AMRAP
    { exerciseName: "Deficit push-up", order: 2, targetSets: 3, repsMin: 10, repsMax: 15 },
    { exerciseName: "Bulgarian split squat", order: 3, targetSets: 3, repsMin: 8, repsMax: 12, perSide: true },
    { exerciseName: "DB RDL", order: 4, targetSets: 3, repsMin: 12, repsMax: 15 },
    { exerciseName: "DB lateral raise", order: 5, targetSets: 3, repsMin: 12, repsMax: 20 },
    { exerciseName: "Incline curl", order: 6, targetSets: 2, repsMin: 10, repsMax: 15 },
    // The reset doc says a plain "Plank 2×45s"; there's no separate "Plank"
    // exercise in the library (only Long-lever plank), so this references
    // that entry instead. Its own cue ("once a normal plank is easy") is the
    // reason to leave the load leverage as regular for this session, not the
    // walked-out long-lever version - a Phase 1 UI/logging concern, not one
    // this data file can resolve.
    { exerciseName: "Long-lever plank", order: 7, targetSets: 2, repsMin: 45, repsMax: 45, unit: "seconds" },
  ],
};

/** Which four-day-split session (if any) is planned for a given weekday. Sunday=0 … Saturday=6. */
export const WEEKDAY_SESSION_PLAN: Partial<Record<number, SessionType>> = {
  1: "upper_a", // Monday
  2: "lower_a", // Tuesday
  5: "upper_b", // Friday
  6: "lower_b", // Saturday
};

export type ActiveProgram = "four_day_split" | "full_body_reset";

/**
 * Which program is actually running right now. Flip to "four_day_split" once
 * full_body has happened three Saturdays in a row (01-plan/01-current-plan.md).
 */
export const ACTIVE_PROGRAM: ActiveProgram = "full_body_reset";

export type DayPlan = {
  /** What the four-day split assigns to this weekday, shown as a reference
   * even while `full_body_reset` is active - Naman's call at Phase 1 kickoff. */
  referenceSessionType: SessionType | null;
  /** What's actually planned given ACTIVE_PROGRAM - null means no lifting
   * session is planned (during the reset, that's every day but Saturday). */
  activeSessionType: SessionType | null;
  /** Sunday - nudge to log weekly weight/waist/BIA (01-plan/01-current-plan.md). */
  isMeasurementDay: boolean;
};

/** JS weekday convention: Sunday=0 … Saturday=6. */
export function planForWeekday(weekday: number, activeProgram: ActiveProgram = ACTIVE_PROGRAM): DayPlan {
  const referenceSessionType = WEEKDAY_SESSION_PLAN[weekday] ?? null;
  const activeSessionType: SessionType | null =
    activeProgram === "four_day_split" ? referenceSessionType : weekday === 6 ? "full_body" : null;
  return { referenceSessionType, activeSessionType, isMeasurementDay: weekday === 0 };
}
