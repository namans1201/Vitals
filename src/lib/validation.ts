import { z } from "zod";

export const dateParamSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

/** Partial update to a DailyLog's own scalar fields - everything on the
 * model except its PK (`date`) and provenance (`source`/`importedAt`),
 * which only the importer (Phase 2) touches. */
export const dailyLogPatchSchema = z.object({
  weightKg: z.number().min(20).max(300).nullable().optional(),
  waistCm: z.number().min(30).max(300).nullable().optional(),
  bodyFatPct: z.number().min(1).max(70).nullable().optional(),
  skeletalMuscleKg: z.number().min(1).max(100).nullable().optional(),
  armCm: z.number().min(10).max(100).nullable().optional(),
  chestCm: z.number().min(30).max(200).nullable().optional(),
  thighCm: z.number().min(10).max(150).nullable().optional(),
  maxPullups: z.number().int().min(0).max(200).nullable().optional(),
  maxPushups: z.number().int().min(0).max(500).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  waterMl: z.number().int().min(0).max(20000).optional(),
  ranDone: z.boolean().optional(),
  restingHr: z.number().int().min(20).max(220).nullable().optional(),
  sleepMinutes: z.number().int().min(0).max(1440).nullable().optional(),
  /** "HH:mm" bedtime in Asia/Kolkata - converted server-side via bedtimeToUtc. */
  bedtimeLocal: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),
  checklist: z
    .array(z.object({ key: z.string(), done: z.boolean() }))
    .optional(),
  supplements: z
    .array(z.object({ supplementId: z.number().int(), taken: z.boolean() }))
    .optional(),
});

export const createWorkoutSchema = z.object({
  date: dateParamSchema,
  sessionType: z.enum(["upper_a", "lower_a", "upper_b", "lower_b", "full_body", "minimum", "custom"]),
  durationMin: z.number().int().min(0).max(600).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const addWorkoutSetSchema = z.object({
  exerciseId: z.number().int(),
  targetSets: z.number().int().min(1).max(10).default(3),
});

/** Swap one exercise in a session for another from the library. */
export const replaceWorkoutExerciseSchema = z.object({
  toExerciseId: z.number().int(),
});

export const patchWorkoutSetSchema = z.object({
  reps: z.number().int().min(0).max(500).nullable().optional(),
  weightKg: z.number().min(0).max(500).nullable().optional(),
  rir: z.number().int().min(0).max(10).nullable().optional(),
  tempo: z.string().max(20).nullable().optional(),
  completed: z.boolean().optional(),
});

export const runTypeSchema = z.enum(["easy", "intervals", "long", "walk_run", "walk", "skipping"]);

export const createRunSchema = z.object({
  date: dateParamSchema,
  type: runTypeSchema,
  durationSec: z.number().int().min(1).max(36000),
  distanceM: z.number().int().min(0).max(200000).nullable().optional(),
  avgHr: z.number().int().min(20).max(230).nullable().optional(),
  maxHr: z.number().int().min(20).max(230).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const createMealSchema = z.object({
  date: dateParamSchema,
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  name: z.string().min(1).max(200),
  description: z.string().max(500).nullable().optional(),
  proteinG: z.number().min(0).max(500).default(0),
  caloriesKcal: z.number().int().min(0).max(10000).default(0),
  fatG: z.number().min(0).max(500).default(0),
  carbG: z.number().min(0).max(1000).default(0),
});

export const profileTargetsPatchSchema = z.object({
  proteinTargetG: z.number().int().min(0).max(1000).optional(),
  calorieTargetKcal: z.number().int().min(0).max(10000).optional(),
  fatTargetG: z.number().int().min(0).max(1000).optional(),
  carbTargetG: z.number().int().min(0).max(2000).optional(),
});
