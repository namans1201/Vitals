import { prisma } from "@/lib/db";
import { parseDateParam, todayIso } from "@/lib/date";
import { dayFromSchedule, getOrCreateWeekPlan } from "@/lib/weekPlans";
import { getExerciseHistories, getOrCreateWorkoutForDate } from "@/lib/workouts";
import { EMPTY_HISTORY } from "@/domain/exerciseHistory";
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

  // The exercise list for the "add an exercise" picker depends on nothing
  // else on this page, so it rides along with the workout lookup instead of
  // being awaited at the end as its own round-trip.
  const [workout, allExercises] = await Promise.all([
    getOrCreateWorkoutForDate(date, today?.lift ?? null),
    prisma.exercise.findMany({ orderBy: { name: "asc" } }),
  ]);

  let exerciseGroups: ExerciseGroup[] = [];
  if (workout) {
    const seenExerciseIds = new Set<number>();
    const uniqueSets = workout.sets.filter((set) => {
      if (seenExerciseIds.has(set.exerciseId)) return false;
      seenExerciseIds.add(set.exerciseId);
      return true;
    });

    // One query answers last-time and best-ever for every exercise in the
    // session - they read the same rows, so asking per exercise meant ~21
    // round-trips for a 7-exercise day.
    const histories = await getExerciseHistories(
      uniqueSets.map((set) => set.exerciseId),
      date,
    );

    exerciseGroups = uniqueSets.map((set) => {
      const sets = workout.sets.filter((s) => s.exerciseId === set.exerciseId);
      const exercise = set.exercise;
      const { lastTime, bestEver } = histories.get(set.exerciseId) ?? EMPTY_HISTORY;
      const loggedLastSets = (lastTime?.sets ?? []).filter(
        (s): s is { reps: number; weightKg: number | null; rir: number | null } => s.reps !== null,
      );
      const progressionResult = progression({
        sets: loggedLastSets.map((s) => ({ reps: s.reps, rir: s.rir })),
        repsMin: exercise.defaultRepsMin,
        repsMax: exercise.defaultRepsMax,
      });

      return { exercise, sets, lastTime, bestEver, progression: progressionResult };
    });
  }

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
