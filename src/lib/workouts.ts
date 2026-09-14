import { prisma } from "@/lib/db";
import { SESSION_TEMPLATES, type SessionType } from "@/domain/sessionTemplates";
import { hasLoggedWork, shouldReplaceScaffold } from "@/domain/sessionReconcile";
import {
  summariseHistoriesByExercise,
  type ExerciseHistory,
} from "@/domain/exerciseHistory";
import type { Prisma } from "@/generated/prisma/client";

export const workoutInclude = {
  sets: {
    include: { exercise: true },
    orderBy: [{ exerciseId: "asc" }, { setIndex: "asc" }],
  },
} satisfies Prisma.WorkoutInclude;

export type WorkoutWithSets = Prisma.WorkoutGetPayload<{ include: typeof workoutInclude }>;

export function isSessionType(value: string): value is SessionType {
  return value in SESSION_TEMPLATES;
}

export async function createSetsFromTemplate(workoutId: number, sessionType: SessionType) {
  const template = SESSION_TEMPLATES[sessionType];
  const exercises = await prisma.exercise.findMany({
    where: { name: { in: template.map((t) => t.exerciseName) } },
  });
  const exerciseByName = new Map(exercises.map((e) => [e.name, e]));

  const data: Prisma.WorkoutSetCreateManyInput[] = [];
  for (const item of template) {
    const exercise = exerciseByName.get(item.exerciseName);
    // An exercise named in the template but missing from the library is
    // logged and skipped, never fatal - same philosophy as the importer (§7.2).
    if (!exercise) {
      console.warn(`Session template exercise not found in library: ${item.exerciseName}`);
      continue;
    }
    for (let i = 0; i < item.targetSets; i++) {
      data.push({ workoutId, exerciseId: exercise.id, setIndex: i + 1 });
    }
  }
  if (data.length > 0) {
    await prisma.workoutSet.createMany({ data });
  }
}

/**
 * The day's primary workout, reconciled against what the week plan currently
 * says should happen that day.
 *
 * Re-planning a week is a normal weekly action, so a session auto-created
 * under an older plan must not stick around showing the wrong thing. Empty
 * auto-created scaffolding is therefore replaced when the plan changes -
 * but a session with *any* logged work is never touched, because that's real
 * data and the plan changing doesn't unmake the training that happened.
 *
 * Returns null when nothing is planned and nothing exists yet.
 */
export async function getOrCreateWorkoutForDate(
  date: Date,
  activeSessionType: SessionType | null,
): Promise<WorkoutWithSets | null> {
  const existing = await prisma.workout.findFirst({
    where: { date },
    include: workoutInclude,
    orderBy: { id: "asc" },
  });

  if (existing) {
    const replace = shouldReplaceScaffold({
      existingSessionType: existing.sessionType,
      plannedSessionType: activeSessionType,
      existingHasLoggedWork: hasLoggedWork(existing.sets),
      existingSetCount: existing.sets.length,
    });
    if (!replace) return existing;
    // Untouched scaffolding from a previous plan - safe to discard.
    await prisma.workout.delete({ where: { id: existing.id } });
  }

  if (!activeSessionType) return null;

  await prisma.dailyLog.upsert({ where: { date }, create: { date }, update: {} });
  const created = await prisma.workout.create({ data: { date, sessionType: activeSessionType } });
  await createSetsFromTemplate(created.id, activeSessionType);

  return prisma.workout.findUniqueOrThrow({ where: { id: created.id }, include: workoutInclude });
}

export type {
  LastTimeSet,
  LastTimeForExercise,
  BestEverForExercise,
  ExerciseHistory,
} from "@/domain/exerciseHistory";

/**
 * "Last time" and "best ever" for several exercises at once.
 *
 * Both answers come from the same set of rows - every set logged for these
 * exercises before `beforeDate` - so this is one query for the whole
 * session rather than three per exercise (a findFirst plus a findMany for
 * last-time, plus a findMany for best-ever). A 7-exercise session went from
 * ~21 round-trips to 1. The shaping is pure and tested in
 * domain/exerciseHistory.ts.
 *
 * Requires the WorkoutSet.exerciseId index - without it this filter is a
 * sequential scan that grows with total training history.
 */
export async function getExerciseHistories(
  exerciseIds: number[],
  beforeDate: Date,
): Promise<Map<number, ExerciseHistory>> {
  if (exerciseIds.length === 0) return new Map();

  const rows = await prisma.workoutSet.findMany({
    where: { exerciseId: { in: exerciseIds }, workout: { date: { lt: beforeDate } } },
    select: {
      exerciseId: true,
      workoutId: true,
      setIndex: true,
      reps: true,
      weightKg: true,
      rir: true,
      workout: { select: { date: true } },
    },
  });

  return summariseHistoriesByExercise(
    rows.map((r) => ({
      exerciseId: r.exerciseId,
      workoutId: r.workoutId,
      date: r.workout.date,
      setIndex: r.setIndex,
      reps: r.reps,
      weightKg: r.weightKg,
      rir: r.rir,
    })),
    exerciseIds,
  );
}
