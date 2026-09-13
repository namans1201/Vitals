"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DateNav } from "@/components/DateNav";
import { useToast } from "@/components/Toast";
import { createWorkout, addWorkoutSet, patchWorkoutSet } from "@/lib/api-client";
import { SESSION_LABELS, type SessionType } from "@/domain/sessionTemplates";
import { IconClose, IconInfo, IconMinus, IconPlus, IconRun } from "@/components/icons";
import { useEscapeKey } from "@/lib/useEscapeKey";
import { playCountdownBeep, playPersonalRecord, playRestOver, vibrate } from "@/lib/sounds";
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

type RestState = { active: boolean; remaining: number; total: number };

export function WorkoutClient({
  date,
  today,
  flexChoice,
  workout,
  exerciseGroups,
  allExercises,
}: {
  date: string;
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
      <DateNav date={date} basePath="/workout" />

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
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [formGuideOpen, setFormGuideOpen] = useState(false);
  // Reps and weight are lifted here (not left inside each set row / the
  // weight modal) purely so a PR can be checked against the exercise's
  // whole current session - RIR and the completed toggle don't affect any
  // PR metric, so those stay local to SetRow as before.
  const [reps, setReps] = useState(() => new Map(sets.map((s) => [s.id, s.reps?.toString() ?? ""])));
  const [weights, setWeights] = useState(() => new Map(sets.map((s) => [s.id, s.weightKg?.toString() ?? ""])));
  const celebratedPRs = useRef<Set<PRType>>(new Set());

  function checkPRs(nextReps: Map<number, string>, nextWeights: Map<number, string>) {
    let maxReps = 0;
    let maxWeight = 0;
    let volume = 0;
    for (const id of nextReps.keys()) {
      const r = Number(nextReps.get(id));
      const w = Number(nextWeights.get(id));
      if (nextReps.get(id) && r > maxReps) maxReps = r;
      if (nextWeights.get(id) && w > maxWeight) maxWeight = w;
      if (nextReps.get(id) && nextWeights.get(id)) volume += r * w;
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
    patchWorkoutSet(workoutId, setId, { reps: value === "" ? null : Number(value) }).catch(() =>
      toast("Couldn't save - check your connection"),
    );
    checkPRs(new Map(reps).set(setId, value), weights);
  }
  function handleWeightChange(setId: number, value: string) {
    setWeights((prev) => new Map(prev).set(setId, value));
  }
  function handleWeightBlur(setId: number, value: string) {
    patchWorkoutSet(workoutId, setId, { weightKg: value === "" ? null : Number(value) }).catch(() =>
      toast("Couldn't save - check your connection"),
    );
    checkPRs(reps, new Map(weights).set(setId, value));
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
          {/* Weight is opt-in and off to the side on purpose - reps/sets
              against the plan above are the point of this screen. Logging a
              weight opens one small modal for the whole exercise instead of
              a pill wedged onto every set row. */}
          <button
            type="button"
            onClick={() => setWeightModalOpen(true)}
            className="micro rounded-full border border-line px-2 py-1 text-faint transition-colors hover:border-dim hover:text-dim"
          >
            + Kg
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

      {weightModalOpen && (
        <WeightModal
          exerciseName={exercise.name}
          sets={sets}
          weights={weights}
          onChange={handleWeightChange}
          onBlur={handleWeightBlur}
          onClose={() => setWeightModalOpen(false)}
        />
      )}
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
      <LabeledField label="Reps" value={reps} onChange={onRepsChange} onBlur={() => onRepsBlur(reps)} />
      <LabeledField
        label="RIR"
        value={rir}
        onChange={(v) => setRir(v)}
        onBlur={() => save({ rir: rir === "" ? null : Number(rir) })}
      />
    </div>
  );
}

/** Weight logging for a whole exercise in one place, off the main set rows -
 * kg is opt-in and not the point of this screen (see the "+ Kg" button in
 * ExerciseCard), but still per-set once you do want it. Controlled by
 * ExerciseCard (not its own local state) so a weight entered here can feed
 * the same-card PR check. */
function WeightModal({
  exerciseName,
  sets,
  weights,
  onChange,
  onBlur,
  onClose,
}: {
  exerciseName: string;
  sets: WorkoutSet[];
  weights: Map<number, string>;
  onChange: (setId: number, value: string) => void;
  onBlur: (setId: number, value: string) => void;
  onClose: () => void;
}) {
  useEscapeKey(onClose);

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 px-4 overlay-in"
      onClick={onClose}
      role="presentation"
    >
      <div className="card modal-in w-full max-w-xs p-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-heading text-sm font-bold text-ink">{exerciseName}</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-dim hover:bg-panel-2 hover:text-ink"
            aria-label="Close"
          >
            <IconClose size={15} />
          </button>
        </div>
        <div className="space-y-2">
          {sets.map((set, i) => (
            <div key={set.id} className="flex items-center justify-between gap-3">
              <span className="text-sm text-dim">Set {i + 1}</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  placeholder="-"
                  value={weights.get(set.id) ?? ""}
                  onChange={(e) => onChange(set.id, e.target.value)}
                  onBlur={(e) => onBlur(set.id, e.target.value)}
                  className="h-11 w-20 rounded-xl border border-line bg-panel-2 px-2 text-center text-sm text-ink outline-none focus:border-accent"
                />
                <span className="text-xs text-faint">kg</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 h-10 w-full rounded-full bg-accent text-sm font-medium text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function LabeledField({
  label,
  value,
  onChange,
  onBlur,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  step?: string;
}) {
  return (
    <label className="flex shrink-0 flex-col items-center gap-1">
      <span className="micro text-faint">{label}</span>
      <input
        type="number"
        step={step}
        placeholder="-"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
