import { prisma } from "@/lib/db";
import { parseDateParam, todayIso } from "@/lib/date";
import { dayFromSchedule, getOrCreateWeekPlan } from "@/lib/weekPlans";
import { getLastTimeForExercise, getOrCreateWorkoutForDate } from "@/lib/workouts";
import { progression } from "@/domain/progression";
import { WorkoutClient, type ExerciseGroup } from "./WorkoutClient";

// Reads/writes live DB state on every request - must never be statically prerendered.
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

  let exerciseGroups: ExerciseGroup[] = [];
  if (workout) {
    const seenExerciseIds = new Set<number>();
    const uniqueSets = workout.sets.filter((set) => {
      if (seenExerciseIds.has(set.exerciseId)) return false;
      seenExerciseIds.add(set.exerciseId);
      return true;
    });

    // One exercise's last-time lookup doesn't depend on another's, so fetch
    // them all in parallel instead of serially awaiting inside the loop -
    // with 4-8 exercises per session this was 4-8 sequential DB round-trips.
    const lastTimes = await Promise.all(
      uniqueSets.map((set) => getLastTimeForExercise(set.exerciseId, date)),
    );

    exerciseGroups = uniqueSets.map((set, i) => {
      const sets = workout.sets.filter((s) => s.exerciseId === set.exerciseId);
      const exercise = set.exercise;
      const lastTime = lastTimes[i];
      const loggedLastSets = (lastTime?.sets ?? []).filter(
        (s): s is { reps: number; weightKg: number | null; rir: number | null } => s.reps !== null,
      );
      const progressionResult = progression({
        sets: loggedLastSets.map((s) => ({ reps: s.reps, rir: s.rir })),
        repsMin: exercise.defaultRepsMin,
        repsMax: exercise.defaultRepsMax,
      });

      return { exercise, sets, lastTime, progression: progressionResult };
    });
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
