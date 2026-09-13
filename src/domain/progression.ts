/** Double progression - BUILD_SPEC.md §6.4. Pure functions, no I/O. */

export const PROGRESSION_LEVERS = [
  "add_rep",
  "slow_eccentric",
  "add_pause",
  "add_set",
  "harder_variation",
  "add_band",
  "add_load",
] as const;

export type Lever = (typeof PROGRESSION_LEVERS)[number];

export type LoggedSet = { reps: number; rir: number | null };

export type ProgressionInput = {
  sets: LoggedSet[];
  repsMin: number;
  repsMax: number;
};

export type ProgressionVerdict = "progress" | "regress" | "hold";

export type ProgressionResult = {
  verdict: ProgressionVerdict;
  lever: Lever | null;
  message: string;
};

/**
 * The lever to suggest after `previous` in the fixed order §6.4 defines.
 * `previous` is whatever lever this exercise last progressed on (null the
 * first time, or once it has regressed/held since) - the caller is
 * responsible for tracking that; this function only knows the sequence.
 */
export const nextLever = (previous: Lever | null): Lever => {
  if (previous === null) return PROGRESSION_LEVERS[0];
  const index = PROGRESSION_LEVERS.indexOf(previous);
  return PROGRESSION_LEVERS[Math.min(index + 1, PROGRESSION_LEVERS.length - 1)];
};

function messageFor(lever: Lever): string {
  switch (lever) {
    case "add_rep":
      return "Hit the top of the range with reps still in reserve - add a rep next time.";
    case "slow_eccentric":
      return "Still cruising at the top of the range - slow the lowering phase (3s → 4s).";
    case "add_pause":
      return "Add a pause at the hardest point of the rep.";
    case "add_set":
      return "Add a set next session.";
    case "harder_variation":
      return "Time to move to a harder variation of this exercise.";
    case "add_band":
      return "Add band resistance.";
    case "add_load":
      return "Add load - more weight next session.";
  }
}

export const progression = (
  input: ProgressionInput,
  previousLever: Lever | null = null,
): ProgressionResult => {
  const { sets, repsMin, repsMax } = input;

  if (sets.length === 0) {
    return {
      verdict: "hold",
      lever: null,
      message: "No sets logged last time - nothing to compare against yet.",
    };
  }

  const anyBelowMin = sets.some((s) => s.reps < repsMin);
  if (anyBelowMin) {
    return {
      verdict: "regress",
      lever: null,
      message: "A set fell below the target rep range - reduce load or use an easier variation.",
    };
  }

  // RIR must be explicitly logged and >= 2 - an unlogged RIR can't confirm
  // reps in reserve, so it doesn't count as a pass.
  const allAtMaxWithReserve = sets.every((s) => s.reps >= repsMax && s.rir !== null && s.rir >= 2);
  if (allAtMaxWithReserve) {
    const lever = nextLever(previousLever);
    return { verdict: "progress", lever, message: messageFor(lever) };
  }

  return {
    verdict: "hold",
    lever: null,
    message: "Right in the target range - repeat the same weight and reps.",
  };
};
