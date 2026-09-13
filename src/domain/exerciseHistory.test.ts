import { describe, expect, it } from "vitest";
import {
  EMPTY_HISTORY,
  summariseExerciseHistory,
  summariseHistoriesByExercise,
  type HistorySetRow,
} from "./exerciseHistory";

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

function row(over: Partial<HistorySetRow> = {}): HistorySetRow {
  return {
    exerciseId: 1,
    workoutId: 10,
    date: d("2026-09-01"),
    setIndex: 1,
    reps: 10,
    weightKg: null,
    rir: null,
    ...over,
  };
}

describe("summariseExerciseHistory", () => {
  it("returns empty history when the exercise has never been logged", () => {
    expect(summariseExerciseHistory([])).toEqual(EMPTY_HISTORY);
  });

  it("reads the only session as last time", () => {
    const history = summariseExerciseHistory([
      row({ setIndex: 1, reps: 8 }),
      row({ setIndex: 2, reps: 7 }),
    ]);
    expect(history.lastTime?.date).toEqual(d("2026-09-01"));
    expect(history.lastTime?.sets.map((s) => s.reps)).toEqual([8, 7]);
  });

  it("uses only the most recent date for last time, but all history for best ever", () => {
    const history = summariseExerciseHistory([
      row({ workoutId: 10, date: d("2026-09-01"), setIndex: 1, reps: 12 }),
      row({ workoutId: 11, date: d("2026-09-08"), setIndex: 1, reps: 6 }),
      row({ workoutId: 11, date: d("2026-09-08"), setIndex: 2, reps: 5 }),
    ]);
    expect(history.lastTime?.date).toEqual(d("2026-09-08"));
    expect(history.lastTime?.sets.map((s) => s.reps)).toEqual([6, 5]);
    // 12 came from the older session and must still count as the rep record.
    expect(history.bestEver.maxReps).toBe(12);
  });

  it("orders last time's sets by setIndex regardless of input order", () => {
    const history = summariseExerciseHistory([
      row({ setIndex: 3, reps: 5 }),
      row({ setIndex: 1, reps: 9 }),
      row({ setIndex: 2, reps: 7 }),
    ]);
    expect(history.lastTime?.sets.map((s) => s.reps)).toEqual([9, 7, 5]);
  });

  it("treats two workouts on the same date as one session", () => {
    const history = summariseExerciseHistory([
      row({ workoutId: 10, date: d("2026-09-08"), setIndex: 1, reps: 10 }),
      row({ workoutId: 11, date: d("2026-09-08"), setIndex: 2, reps: 8 }),
    ]);
    expect(history.lastTime?.sets).toHaveLength(2);
  });

  it("ignores null reps and weights when taking records", () => {
    const history = summariseExerciseHistory([
      row({ setIndex: 1, reps: null, weightKg: null }),
      row({ setIndex: 2, reps: 9, weightKg: 20 }),
      row({ setIndex: 3, reps: null, weightKg: 40 }),
    ]);
    expect(history.bestEver.maxReps).toBe(9);
    expect(history.bestEver.maxWeightKg).toBe(40);
  });

  it("leaves weight and volume null when nothing has ever been weighed", () => {
    const history = summariseExerciseHistory([row({ reps: 15 }), row({ setIndex: 2, reps: 12 })]);
    expect(history.bestEver.maxWeightKg).toBeNull();
    // A bodyweight exercise must never report a misleading volume PR of 0.
    expect(history.bestEver.maxVolume).toBeNull();
    expect(history.bestEver.maxReps).toBe(15);
  });

  it("sums volume within a session and takes the best session", () => {
    const history = summariseExerciseHistory([
      // 10x20 + 10x20 = 400
      row({ workoutId: 10, date: d("2026-09-01"), setIndex: 1, reps: 10, weightKg: 20 }),
      row({ workoutId: 10, date: d("2026-09-01"), setIndex: 2, reps: 10, weightKg: 20 }),
      // 8x30 = 240, heavier but less total work
      row({ workoutId: 11, date: d("2026-09-08"), setIndex: 1, reps: 8, weightKg: 30 }),
    ]);
    expect(history.bestEver.maxVolume).toBe(400);
    expect(history.bestEver.maxWeightKg).toBe(30);
  });

  it("counts volume only from sets carrying both reps and weight", () => {
    const history = summariseExerciseHistory([
      row({ workoutId: 10, setIndex: 1, reps: 10, weightKg: 20 }),
      row({ workoutId: 10, setIndex: 2, reps: 10, weightKg: null }),
    ]);
    expect(history.bestEver.maxVolume).toBe(200);
  });
});

describe("summariseHistoriesByExercise", () => {
  it("keeps each exercise's rows separate", () => {
    const result = summariseHistoriesByExercise(
      [
        row({ exerciseId: 1, reps: 10, weightKg: 50 }),
        row({ exerciseId: 2, reps: 20, weightKg: 5 }),
      ],
      [1, 2],
    );
    expect(result.get(1)?.bestEver.maxWeightKg).toBe(50);
    expect(result.get(2)?.bestEver.maxWeightKg).toBe(5);
    expect(result.get(1)?.bestEver.maxReps).toBe(10);
    expect(result.get(2)?.bestEver.maxReps).toBe(20);
  });

  it("gives an empty history to a requested exercise with no rows", () => {
    const result = summariseHistoriesByExercise([row({ exerciseId: 1 })], [1, 99]);
    expect(result.get(99)).toEqual(EMPTY_HISTORY);
    expect(result.has(99)).toBe(true);
  });

  it("ignores rows for exercises that weren't asked for", () => {
    const result = summariseHistoriesByExercise(
      [row({ exerciseId: 1 }), row({ exerciseId: 7, reps: 99 })],
      [1],
    );
    expect(result.size).toBe(1);
    expect(result.get(1)?.bestEver.maxReps).toBe(10);
  });
});
