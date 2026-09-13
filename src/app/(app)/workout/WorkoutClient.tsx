"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DateNav } from "@/components/DateNav";
import { useToast } from "@/components/Toast";
import { createWorkout, addWorkoutSet, patchWorkoutSet } from "@/lib/api-client";
import { SESSION_LABELS, type SessionType } from "@/domain/sessionTemplates";
import { IconInfo, IconMinus, IconPlus, IconRun } from "@/components/icons";
import { playCountdownBeep, playPersonalRecord, playRestOver, vibrate } from "@/lib/sounds";
import { clampWholeNumber, sanitizeWholeNumberInput } from "@/domain/setInput";
import { ExerciseFormGuideModal } from "@/components/ExerciseFormGuideModal";
import type { DayAssignment } from "@/domain/weekPlan";
import type { ProgressionResult } from "@/domain/progression";
import type { Exercise, WorkoutSet } from "@/generated/prisma/client";
import type { WorkoutWithSets, LastTimeForExercise, BestEverForExercise } from "@/lib/workouts";

export type ExerciseGroup = {
  exercise: Exercise;
  sets: WorkoutSet[];
  lastTime: LastTimeForExercise;
  bestEver: BestEverForExercise;
  progression: ProgressionResult;
};

const STARTABLE_SESSIONS: SessionType[] = ["upper_a", "lower_a", "upper_b", "lower_b", "full_body"];
const REST_DEFAULT_SECONDS = 90;
const REST_STEP_SECONDS = 15;
// A set needs at least one rep to count as done - 0 isn't a valid rep count,
// it's "didn't happen". RIR ("reps in reserve") is different: 0 is a real,
// common value - it means the set was taken all the way to failure.
const MIN_REPS = 1;
const MIN_RIR = 0;

type RestState = { active: boolean; remaining: number; total: number };

export function WorkoutClient({
  date,
  todayIsoStr,
  today,
  flexChoice,
  workout,
  exerciseGroups,
  allExercises,
}: {
  date: string;
  todayIsoStr: string;
  today: DayAssignment | null;
  flexChoice: string;
  workout: WorkoutWithSets | null;
  exerciseGroups: ExerciseGroup[];
  allExercises: Exercise[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  // Rest timer - shared across every exercise card, since only one rest
  // ever happens at a time regardless of which set just finished.
  const [rest, setRest] = useState<RestState>({ active: false, remaining: 0, total: REST_DEFAULT_SECONDS });
  const [restRunning, setRestRunning] = useState(true);
  const [restDefault, setRestDefault] = useState(REST_DEFAULT_SECONDS);

  useEffect(() => {
    if (!rest.active || !restRunning) return;
    const id = setInterval(() => {
      setRest((r) => (r.remaining <= 1 ? { ...r, remaining: 0, active: false } : { ...r, remaining: r.remaining - 1 }));
    }, 1000);
    return () => clearInterval(id);
  }, [rest.active, restRunning]);

  useEffect(() => {
    if (!rest.active) {
      if (rest.remaining === 0 && rest.total > 0) {
        playRestOver();
        vibrate([80, 60, 80]);
      }
      return;
    }
    if (rest.remaining > 0 && rest.remaining <= 3) playCountdownBeep();
  }, [rest.remaining, rest.active, rest.total]);

  function startRest() {
    setRest({ active: true, remaining: restDefault, total: restDefault });
    setRestRunning(true);
  }
  function adjustRest(delta: number) {
    setRest((r) => ({ ...r, remaining: Math.max(0, r.remaining + delta), total: Math.max(1, r.total + delta) }));
    setRestDefault((d) => Math.max(15, d + delta));
  }
  function skipRest() {
    setRest((r) => ({ ...r, active: false }));
  }

  async function startSession(sessionType: SessionType | "custom") {
    setBusy(true);
    try {
      await createWorkout({ date, sessionType });
      router.refresh();
    } catch {
      toast("Couldn't start the session - try again");
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
    <div className="mx-auto max-w-2xl animate-in">
      <DateNav date={date} todayIsoStr={todayIsoStr} basePath="/workout" />

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-2">
          {workout ? SESSION_LABELS[workout.sessionType as SessionType] ?? workout.sessionType : "Session"}
        </span>
        {workout && totalSets > 0 && (
          <>
            <div className="mb-1 mt-1 text-xs text-dim">
              {doneSets} / {totalSets} sets complete
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-panel-2">
              <div
                className="h-full rounded-full bg-good transition-[width]"
                style={{ width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%` }}
              />
            </div>
          </>
        )}
        {today?.run && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-dim">
            <IconRun size={14} className="text-accent" />
            Morning run today - easy, Zone 2.
          </div>
        )}
      </div>

      {!workout && (
        <div className="card mb-3 p-4">
          <p className="mb-3 text-sm text-dim">
            {today?.off
              ? "Strictly off today. Nothing to do - that's the plan working."
              : today?.flex
                ? flexChoice === "mobility"
                  ? "Flexible day - mobility/core if you want it. Or start something:"
                  : "Flexible day - an easy run or walk. Or start something:"
                : "No session planned today. Start one:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {STARTABLE_SESSIONS.map((s) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => startSession(s)}
                className="rounded-full border border-line bg-panel-2 px-4 py-2 text-sm text-ink transition-colors hover:bg-line disabled:opacity-50"
              >
                {SESSION_LABELS[s]}
              </button>
            ))}
            <button
              disabled={busy}
              onClick={() => startSession("custom")}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Custom session
            </button>
          </div>
        </div>
      )}

      {workout && (
        <>
          {rest.active && (
            <div className="sticky top-2 z-10 mb-3">
              <RestTimerBar rest={rest} running={restRunning} onToggleRunning={() => setRestRunning((r) => !r)} onAdjust={adjustRest} onSkip={skipRest} />
            </div>
          )}
          {exerciseGroups.map((group) => (
            <ExerciseCard key={group.exercise.id} workoutId={workout.id} group={group} onSetCompleted={startRest} />
          ))}
          <AddExercise workoutId={workout.id} allExercises={allExercises} existing={exerciseGroups} />
        </>
      )}
    </div>
  );
}

function RestTimerBar({
  rest,
  running,
  onToggleRunning,
  onAdjust,
  onSkip,
}: {
  rest: RestState;
  running: boolean;
  onToggleRunning: () => void;
  onAdjust: (delta: number) => void;
  onSkip: () => void;
}) {
  const circumference = 2 * Math.PI * 26;
  const progress = rest.total > 0 ? (rest.total - rest.remaining) / rest.total : 0;
  const minutes = Math.floor(rest.remaining / 60);
  const seconds = rest.remaining % 60;

  return (
    <div className="card flex items-center gap-3 p-3">
      <div className="relative h-14 w-14 shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" fill="none" stroke="var(--panel-2)" strokeWidth="5" />
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className={`transition-[stroke-dashoffset] duration-500 ${rest.remaining <= 3 ? "text-bad" : "text-accent"}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-heading text-xs font-bold tabular-nums ${rest.remaining <= 3 ? "text-bad" : "text-ink"}`}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <div className="micro text-faint">Rest</div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAdjust(-REST_STEP_SECONDS)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-dim hover:bg-panel-2"
            aria-label="15 seconds less"
          >
            <IconMinus size={12} />
          </button>
          <span className="micro w-9 text-center text-faint">±15s</span>
          <button
            onClick={() => onAdjust(REST_STEP_SECONDS)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-dim hover:bg-panel-2"
            aria-label="15 seconds more"
          >
            <IconPlus size={12} />
          </button>
        </div>
      </div>

      <button
        onClick={onToggleRunning}
        className="h-9 shrink-0 rounded-full border border-line px-3 text-xs font-medium text-dim hover:bg-panel-2"
      >
        {running ? "Pause" : "Resume"}
      </button>
      <button onClick={onSkip} className="h-9 shrink-0 rounded-full bg-accent px-3 text-xs font-medium text-white">
        Skip
      </button>
    </div>
  );
}

type PRType = "reps" | "weight" | "volume";

function ExerciseCard({
  workoutId,
  group,
  onSetCompleted,
}: {
  workoutId: number;
  group: ExerciseGroup;
  onSetCompleted: () => void;
}) {
  const { exercise, sets, lastTime, bestEver, progression: prog } = group;
  const toast = useToast();
  const [formGuideOpen, setFormGuideOpen] = useState(false);
  // Reps are lifted here (not left inside each set row) purely so a PR can
  // be checked against the exercise's whole current session - RIR and the
  // completed toggle don't affect any PR metric, so those stay local to
  // SetRow. Weight has no input on this screen anymore (see the removed
  // "+ Kg" pill) - this only reads whatever weightKg a set already has, so
  // an existing weight/volume PR can still be detected; it's never written
  // from here, hence a plain derived value rather than its own state.
  const [reps, setReps] = useState(() => new Map(sets.map((s) => [s.id, s.reps?.toString() ?? ""])));
  const weights = new Map(sets.map((s) => [s.id, s.weightKg?.toString() ?? ""]));
  const celebratedPRs = useRef<Set<PRType>>(new Set());

  function checkPRs(nextReps: Map<number, string>) {
    let maxReps = 0;
    let maxWeight = 0;
    let volume = 0;
    for (const id of nextReps.keys()) {
      const r = Number(nextReps.get(id));
      const w = Number(weights.get(id));
      if (nextReps.get(id) && r > maxReps) maxReps = r;
      if (weights.get(id) && w > maxWeight) maxWeight = w;
      if (nextReps.get(id) && weights.get(id)) volume += r * w;
    }

    const prs: { type: PRType; message: string }[] = [];
    if (!celebratedPRs.current.has("reps") && bestEver.maxReps != null && maxReps > bestEver.maxReps) {
      prs.push({ type: "reps", message: `New PR - ${maxReps} reps (prev best ${bestEver.maxReps})` });
    }
    if (!celebratedPRs.current.has("weight") && bestEver.maxWeightKg != null && maxWeight > bestEver.maxWeightKg) {
      prs.push({ type: "weight", message: `New PR - ${maxWeight} kg (prev best ${bestEver.maxWeightKg})` });
    }
    if (!celebratedPRs.current.has("volume") && bestEver.maxVolume != null && volume > bestEver.maxVolume) {
      prs.push({ type: "volume", message: `New PR - session volume ${Math.round(volume)} (prev best ${Math.round(bestEver.maxVolume)})` });
    }
    if (prs.length > 0) {
      for (const pr of prs) {
        celebratedPRs.current.add(pr.type);
        toast(pr.message);
      }
      playPersonalRecord();
      vibrate([60, 40, 60, 40, 120]);
    }
  }

  function handleRepsChange(setId: number, value: string) {
    setReps((prev) => new Map(prev).set(setId, value));
  }
  function handleRepsBlur(setId: number, value: string) {
    // A set needs at least one rep to count as done - "0" typed and blurred
    // gets bumped up to 1 rather than saved as-is; empty (never touched)
    // stays empty, since that means "not logged", not "zero".
    const clamped = clampWholeNumber(value, MIN_REPS);
    if (clamped !== value) setReps((prev) => new Map(prev).set(setId, clamped));
    patchWorkoutSet(workoutId, setId, { reps: clamped === "" ? null : Number(clamped) }).catch(() =>
      toast("Couldn't save - check your connection"),
    );
    checkPRs(new Map(reps).set(setId, clamped));
  }

  return (
    <div className="card mb-3 p-4">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <h3 className="font-heading text-sm font-bold text-ink">{exercise.name}</h3>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs tabular-nums text-faint">
            {sets.length} × {exercise.defaultRepsMin}-{exercise.defaultRepsMax}
          </span>
          <button
            type="button"
            onClick={() => setFormGuideOpen(true)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-faint transition-colors hover:bg-panel-2 hover:text-dim"
            aria-label="Form guide"
          >
            <IconInfo size={15} />
          </button>
        </div>
      </div>
      {exercise.cues && <p className="mb-2 text-xs text-dim">{exercise.cues}</p>}

      {lastTime && (
        <div className="mb-2 rounded-lg bg-panel-2 px-3 py-2 text-xs text-dim">
          <span className="text-faint">Last time: </span>
          {lastTime.sets
            .map((s) => (s.reps != null ? `${s.reps}${s.weightKg ? `@${s.weightKg}kg` : ""}` : "-"))
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
          <SetRow
            key={set.id}
            workoutId={workoutId}
            set={set}
            index={i + 1}
            reps={reps.get(set.id) ?? ""}
            onRepsChange={(v) => handleRepsChange(set.id, v)}
            onRepsBlur={(v) => handleRepsBlur(set.id, v)}
            onSetCompleted={onSetCompleted}
          />
        ))}
      </div>

      {formGuideOpen && (
        <ExerciseFormGuideModal exerciseName={exercise.name} onClose={() => setFormGuideOpen(false)} />
      )}
    </div>
  );
}

function SetRow({
  workoutId,
  set,
  index,
  reps,
  onRepsChange,
  onRepsBlur,
  onSetCompleted,
}: {
  workoutId: number;
  set: WorkoutSet;
  index: number;
  reps: string;
  onRepsChange: (value: string) => void;
  onRepsBlur: (value: string) => void;
  onSetCompleted: () => void;
}) {
  const toast = useToast();
  const [rir, setRir] = useState(set.rir?.toString() ?? "");
  const [completed, setCompleted] = useState(set.completed);

  function save(partial: Record<string, unknown>) {
    patchWorkoutSet(workoutId, set.id, partial).catch(() => toast("Couldn't save - check your connection"));
  }

  function toggleCompleted() {
    const next = !completed;
    setCompleted(next);
    save({ completed: next });
    if (next) onSetCompleted();
  }

  function handleRirBlur() {
    // 0 RIR is a real, common value (the set was taken to failure) - only a
    // negative or non-numeric value gets corrected here, never bumped up.
    const clamped = clampWholeNumber(rir, MIN_RIR);
    if (clamped !== rir) setRir(clamped);
    save({ rir: clamped === "" ? null : Number(clamped) });
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggleCompleted}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
          completed ? "border-good bg-good text-white" : "border-line bg-panel-2 text-faint"
        }`}
      >
        {index}
      </button>
      <LabeledField label="Reps" value={reps} onChange={onRepsChange} onBlur={() => onRepsBlur(reps)} min={MIN_REPS} />
      <LabeledField label="RIR" value={rir} onChange={setRir} onBlur={handleRirBlur} min={MIN_RIR} />
    </div>
  );
}

function LabeledField({
  label,
  value,
  onChange,
  onBlur,
  min = 0,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  /** The field's floor - 1 for Reps (a set needs at least one to count),
   * 0 for RIR (going to failure is a real value, not a missing one). Also
   * set as the input's own `min`, so the native step buttons won't go
   * below it either. */
  min?: number;
}) {
  return (
    <label className="flex shrink-0 flex-col items-center gap-1">
      <span className="micro text-faint">{label}</span>
      <input
        type="number"
        min={min}
        step={1}
        inputMode="numeric"
        placeholder="-"
        value={value}
        onChange={(e) => onChange(sanitizeWholeNumberInput(e.target.value))}
        onBlur={onBlur}
        className="h-11 w-14 rounded-xl border border-line bg-panel-2 px-1 text-center text-sm text-ink outline-none focus:border-accent"
      />
    </label>
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
    <div className="card mb-3 p-4">
      <span className="micro-pill mb-3">Add an exercise</span>
      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-11 flex-1 rounded-xl border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
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
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-white disabled:opacity-50"
        >
          <IconPlus size={16} />
          Add
        </button>
      </div>
    </div>
  );
}
