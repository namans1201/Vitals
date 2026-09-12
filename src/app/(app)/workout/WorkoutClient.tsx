"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateNav } from "@/components/DateNav";
import { useToast } from "@/components/Toast";
import { createWorkout, addWorkoutSet, patchWorkoutSet } from "@/lib/api-client";
import { SESSION_LABELS, type DayPlan, type SessionType } from "@/domain/sessionTemplates";
import type { ProgressionResult } from "@/domain/progression";
import type { Exercise, WorkoutSet } from "@/generated/prisma/client";
import type { WorkoutWithSets, LastTimeForExercise } from "@/lib/workouts";

type ExerciseGroup = {
  exercise: Exercise;
  sets: WorkoutSet[];
  lastTime: LastTimeForExercise;
  progression: ProgressionResult;
};

const STARTABLE_SESSIONS: SessionType[] = ["upper_a", "lower_a", "upper_b", "lower_b", "full_body"];

export function WorkoutClient({
  date,
  plan,
  workout,
  exerciseGroups,
  allExercises,
}: {
  date: string;
  plan: DayPlan;
  workout: WorkoutWithSets | null;
  exerciseGroups: ExerciseGroup[];
  allExercises: Exercise[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function startSession(sessionType: SessionType | "custom") {
    setBusy(true);
    try {
      await createWorkout({ date, sessionType });
      router.refresh();
    } catch {
      toast("Couldn't start the session — try again");
    } finally {
      setBusy(false);
    }
  }

  const totalSets = exerciseGroups.reduce((sum, g) => sum + g.sets.length, 0);
  const doneSets = exerciseGroups.reduce(
    (sum, g) => sum + g.sets.filter((s) => s.completed).length,
    0,
  );

  return (
    <div className="mx-auto max-w-lg">
      <DateNav date={date} basePath="/workout" />

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          {workout ? SESSION_LABELS[workout.sessionType as SessionType] ?? workout.sessionType : "Session"}
        </h2>
        {workout && totalSets > 0 && (
          <>
            <div className="mb-1 text-xs text-dim">
              {doneSets} / {totalSets} sets complete
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-panel-2">
              <div
                className="h-full rounded-full bg-good transition-[width]"
                style={{ width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%` }}
              />
            </div>
          </>
        )}
        {plan.referenceSessionType && workout?.sessionType !== plan.referenceSessionType && (
          <div className="mt-2 text-xs text-faint">
            Four-day split reference: {SESSION_LABELS[plan.referenceSessionType]}
          </div>
        )}
      </div>

      {!workout && (
        <div className="mb-3 rounded-xl border border-line bg-panel p-4">
          <p className="mb-3 text-sm text-dim">No session planned today. Start one:</p>
          <div className="flex flex-wrap gap-2">
            {STARTABLE_SESSIONS.map((s) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => startSession(s)}
                className="rounded-lg border border-line bg-panel-2 px-3 py-2 text-sm text-ink disabled:opacity-50"
              >
                {SESSION_LABELS[s]}
              </button>
            ))}
            <button
              disabled={busy}
              onClick={() => startSession("custom")}
              className="rounded-lg border border-accent bg-accent/10 px-3 py-2 text-sm text-accent disabled:opacity-50"
            >
              Custom session
            </button>
          </div>
        </div>
      )}

      {workout && (
        <>
          {exerciseGroups.map((group) => (
            <ExerciseCard key={group.exercise.id} workoutId={workout.id} group={group} />
          ))}
          <AddExercise workoutId={workout.id} allExercises={allExercises} existing={exerciseGroups} />
        </>
      )}
    </div>
  );
}

function ExerciseCard({ workoutId, group }: { workoutId: number; group: ExerciseGroup }) {
  const { exercise, sets, lastTime, progression: prog } = group;

  return (
    <div className="mb-3 rounded-xl border border-line bg-panel p-4">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{exercise.name}</h3>
        <span className="shrink-0 text-xs tabular-nums text-faint">
          {sets.length} × {exercise.defaultRepsMin}-{exercise.defaultRepsMax}
        </span>
      </div>
      {exercise.cues && <p className="mb-2 text-xs text-dim">{exercise.cues}</p>}

      {lastTime && (
        <div className="mb-2 rounded-lg bg-panel-2 px-3 py-2 text-xs text-dim">
          <span className="text-faint">Last time: </span>
          {lastTime.sets
            .map((s) => (s.reps != null ? `${s.reps}${s.weightKg ? `@${s.weightKg}kg` : ""}` : "—"))
            .join(", ")}
        </div>
      )}

      <div
        className={`mb-2 rounded-lg px-3 py-2 text-xs ${
          prog.verdict === "progress"
            ? "bg-good/10 text-good"
            : prog.verdict === "regress"
              ? "bg-bad/10 text-bad"
              : "bg-panel-2 text-dim"
        }`}
      >
        {prog.message}
      </div>

      <div className="space-y-1.5">
        {sets.map((set, i) => (
          <SetRow key={set.id} workoutId={workoutId} set={set} index={i + 1} />
        ))}
      </div>
    </div>
  );
}

function SetRow({ workoutId, set, index }: { workoutId: number; set: WorkoutSet; index: number }) {
  const toast = useToast();
  const [reps, setReps] = useState(set.reps?.toString() ?? "");
  const [weightKg, setWeightKg] = useState(set.weightKg?.toString() ?? "");
  const [rir, setRir] = useState(set.rir?.toString() ?? "");
  const [completed, setCompleted] = useState(set.completed);

  function save(partial: Record<string, unknown>) {
    patchWorkoutSet(workoutId, set.id, partial).catch(() => toast("Couldn't save — check your connection"));
  }

  function toggleCompleted() {
    const next = !completed;
    setCompleted(next);
    save({ completed: next });
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggleCompleted}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${
          completed ? "border-good bg-good text-white" : "border-line bg-panel-2 text-faint"
        }`}
      >
        {index}
      </button>
      <input
        type="number"
        placeholder="reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={() => save({ reps: reps === "" ? null : Number(reps) })}
        className="h-11 w-16 rounded-lg border border-line bg-panel-2 px-2 text-center text-sm text-ink outline-none focus:border-accent"
      />
      <input
        type="number"
        placeholder="kg"
        step="0.5"
        value={weightKg}
        onChange={(e) => setWeightKg(e.target.value)}
        onBlur={() => save({ weightKg: weightKg === "" ? null : Number(weightKg) })}
        className="h-11 w-16 rounded-lg border border-line bg-panel-2 px-2 text-center text-sm text-ink outline-none focus:border-accent"
      />
      <input
        type="number"
        placeholder="RIR"
        value={rir}
        onChange={(e) => setRir(e.target.value)}
        onBlur={() => save({ rir: rir === "" ? null : Number(rir) })}
        className="h-11 w-16 rounded-lg border border-line bg-panel-2 px-2 text-center text-sm text-ink outline-none focus:border-accent"
      />
    </div>
  );
}

function AddExercise({
  workoutId,
  allExercises,
  existing,
}: {
  workoutId: number;
  allExercises: Exercise[];
  existing: ExerciseGroup[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const existingIds = new Set(existing.map((g) => g.exercise.id));
  const options = allExercises.filter((e) => !existingIds.has(e.id));

  async function add() {
    if (!selectedId) return;
    setBusy(true);
    try {
      await addWorkoutSet(workoutId, { exerciseId: Number(selectedId), targetSets: 3 });
      setSelectedId("");
      router.refresh();
    } catch {
      toast("Couldn't add that exercise");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-3 rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
        Add an exercise
      </h2>
      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-11 flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="">Choose from the library…</option>
          {options.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        <button
          onClick={add}
          disabled={!selectedId || busy}
          className="h-11 shrink-0 rounded-lg bg-accent px-4 text-sm font-medium text-white disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
