import { prisma } from "@/lib/db";
import { SESSION_TEMPLATES, type SessionType } from "@/domain/sessionTemplates";
import { hasLoggedWork, shouldReplaceScaffold } from "@/domain/sessionReconcile";
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

export type LastTimeSet = { reps: number | null; weightKg: number | null; rir: number | null };
export type LastTimeForExercise = { date: Date; sets: LastTimeSet[] } | null;

/** The most recent prior session's sets for this exercise, for the
 * "last-time panel" and as input to domain/progression.ts. */
export async function getLastTimeForExercise(
  exerciseId: number,
  beforeDate: Date,
): Promise<LastTimeForExercise> {
  const lastSet = await prisma.workoutSet.findFirst({
    where: { exerciseId, workout: { date: { lt: beforeDate } } },
    orderBy: { workout: { date: "desc" } },
    include: { workout: true },
  });
  if (!lastSet) return null;

  const sets = await prisma.workoutSet.findMany({
    where: { exerciseId, workout: { date: lastSet.workout.date } },
    orderBy: { setIndex: "asc" },
  });
  return {
    date: lastSet.workout.date,
    sets: sets.map((s) => ({ reps: s.reps, weightKg: s.weightKg, rir: s.rir })),
  };
}
