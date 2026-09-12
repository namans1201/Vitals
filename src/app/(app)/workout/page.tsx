import { prisma } from "@/lib/db";
import { parseDateParam, todayIso } from "@/lib/date";
import { dayFromSchedule, getOrCreateWeekPlan } from "@/lib/weekPlans";
import { getLastTimeForExercise, getOrCreateWorkoutForDate } from "@/lib/workouts";
import { progression } from "@/domain/progression";
import { WorkoutClient } from "./WorkoutClient";

// Reads/writes live DB state on every request — must never be statically prerendered.
export const dynamic = "force-dynamic";

export default async function WorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const dateStr = dateParam ?? todayIso();
  const date = parseDateParam(dateStr);

  const weekPlan = await getOrCreateWeekPlan(date);
  const today = dayFromSchedule(weekPlan.schedule, date);
  const workout = await getOrCreateWorkoutForDate(date, today?.lift ?? null);

  const exerciseGroups = [];
  if (workout) {
    const seenExerciseIds = new Set<number>();
    for (const set of workout.sets) {
      if (seenExerciseIds.has(set.exerciseId)) continue;
      seenExerciseIds.add(set.exerciseId);

      const sets = workout.sets.filter((s) => s.exerciseId === set.exerciseId);
      const exercise = set.exercise;
      const lastTime = await getLastTimeForExercise(set.exerciseId, date);
      const loggedLastSets = (lastTime?.sets ?? []).filter(
        (s): s is { reps: number; weightKg: number | null; rir: number | null } => s.reps !== null,
      );
      const progressionResult = progression({
        sets: loggedLastSets.map((s) => ({ reps: s.reps, rir: s.rir })),
        repsMin: exercise.defaultRepsMin,
        repsMax: exercise.defaultRepsMax,
      });

      exerciseGroups.push({ exercise, sets, lastTime, progression: progressionResult });
    }
  }

  const allExercises = await prisma.exercise.findMany({ orderBy: { name: "asc" } });

  return (
    <WorkoutClient
      date={dateStr}
      today={today}
      flexChoice={weekPlan.flexChoice}
      workout={workout}
      exerciseGroups={exerciseGroups}
      allExercises={allExercises}
    />
  );
}
