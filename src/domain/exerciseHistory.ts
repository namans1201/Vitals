/** Per-exercise training history summaries - pure functions, no I/O.
 *
 * "Last time" (what the progression coach compares against) and "best ever"
 * (what PR detection compares against) both read the same underlying rows:
 * every set logged for an exercise before the session being viewed. They
 * used to be two separate queries per exercise, which meant a 7-exercise
 * session issued ~21 round-trips to answer questions one query can. The I/O
 * now happens once in lib/workouts.ts and the shaping happens here, where
 * it can be tested directly.
 */

export type HistorySetRow = {
  exerciseId: number;
  workoutId: number;
  /** The parent workout's date, not the set's own timestamp. */
  date: Date;
  setIndex: number;
  reps: number | null;
  weightKg: number | null;
  rir: number | null;
};

export type LastTimeSet = { reps: number | null; weightKg: number | null; rir: number | null };
export type LastTimeForExercise = { date: Date; sets: LastTimeSet[] } | null;

export type BestEverForExercise = {
  /** Heaviest single set ever logged, or null if weight has never been logged. */
  maxWeightKg: number | null;
  /** Most reps in a single set ever logged. */
  maxReps: number | null;
  /** Best single past session's total volume (sum of reps x weightKg across
   * that session's sets) - only counts sets where both are present, so an
   * exercise with no weight history never gets a misleading 0 "PR". */
  maxVolume: number | null;
};

export type ExerciseHistory = { lastTime: LastTimeForExercise; bestEver: BestEverForExercise };

export const EMPTY_HISTORY: ExerciseHistory = {
  lastTime: null,
  bestEver: { maxWeightKg: null, maxReps: null, maxVolume: null },
};

/**
 * Summarise one exercise's prior sets. `rows` must already be filtered to a
 * single exercise and to workouts before the session being viewed; order
 * doesn't matter.
 *
 * "Last time" is keyed on the most recent *date*, not the most recent
 * workout id, so two workouts logged on the same day are read as one
 * session - matching how the day is presented everywhere else in the app.
 */
export function summariseExerciseHistory(rows: HistorySetRow[]): ExerciseHistory {
  if (rows.length === 0) return EMPTY_HISTORY;

  let maxWeightKg: number | null = null;
  let maxReps: number | null = null;
  const volumeByWorkout = new Map<number, number>();
  let latest = -Infinity;

  for (const row of rows) {
    if (row.weightKg != null) {
      maxWeightKg = maxWeightKg == null ? row.weightKg : Math.max(maxWeightKg, row.weightKg);
    }
    if (row.reps != null) {
      maxReps = maxReps == null ? row.reps : Math.max(maxReps, row.reps);
    }
    if (row.reps != null && row.weightKg != null) {
      volumeByWorkout.set(
        row.workoutId,
        (volumeByWorkout.get(row.workoutId) ?? 0) + row.reps * row.weightKg,
      );
    }
    const time = row.date.getTime();
    if (time > latest) latest = time;
  }

  const lastRows = rows
    .filter((r) => r.date.getTime() === latest)
    .sort((a, b) => a.setIndex - b.setIndex);

  return {
    lastTime: {
      date: lastRows[0].date,
      sets: lastRows.map((r) => ({ reps: r.reps, weightKg: r.weightKg, rir: r.rir })),
    },
    bestEver: {
      maxWeightKg,
      maxReps,
      maxVolume: volumeByWorkout.size > 0 ? Math.max(...volumeByWorkout.values()) : null,
    },
  };
}

/**
 * The same summary for several exercises at once. Every id in
 * `exerciseIds` gets an entry, so an exercise with no history reads as
 * EMPTY_HISTORY rather than a missing key.
 */
export function summariseHistoriesByExercise(
  rows: HistorySetRow[],
  exerciseIds: number[],
): Map<number, ExerciseHistory> {
  const rowsByExercise = new Map<number, HistorySetRow[]>();
  for (const row of rows) {
    const existing = rowsByExercise.get(row.exerciseId);
    if (existing) existing.push(row);
    else rowsByExercise.set(row.exerciseId, [row]);
  }

  const result = new Map<number, ExerciseHistory>();
  for (const id of exerciseIds) {
    result.set(id, summariseExerciseHistory(rowsByExercise.get(id) ?? []));
  }
  return result;
}
