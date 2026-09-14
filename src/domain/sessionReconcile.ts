/**
 * Rules for reconciling an already-created session against the current week
 * plan. Pure - no I/O - because getting this wrong deletes real training data.
 *
 * Re-planning a week is a normal weekly action, so a session auto-created
 * under an older plan must not linger showing the wrong thing. But anything
 * actually logged is sacred: the plan changing doesn't unmake the training
 * that happened.
 */
import type { SessionType } from "./sessionTemplates";

export type SetLike = {
  completed: boolean;
  reps: number | null;
  weightKg: number | null;
  rir: number | null;
};

/** True once anything at all has been recorded against a session. */
export function hasLoggedWork(sets: SetLike[]): boolean {
  return sets.some((s) => s.completed || s.reps !== null || s.weightKg !== null || s.rir !== null);
}

export function shouldReplaceScaffold(input: {
  existingSessionType: string;
  plannedSessionType: SessionType | null;
  existingHasLoggedWork: boolean;
  /** How many sets the existing session actually has. A session with none is
   * a failed scaffold, not a real session - see below. */
  existingSetCount: number;
}): boolean {
  const { existingSessionType, plannedSessionType, existingHasLoggedWork, existingSetCount } = input;
  if (plannedSessionType === null) return false; // nothing planned - leave it alone
  if (existingHasLoggedWork) return false; // real training data is never discarded

  // A session with zero sets is broken, whatever type it claims to be:
  // createSetsFromTemplate silently skips any template exercise missing from
  // the library (by design - a missing exercise shouldn't be fatal), so if the
  // library was empty or incomplete when the session was scaffolded, the result
  // is a session that can never populate itself. Matching the planned type
  // used to be enough to call it "already right" and leave it alone forever,
  // with no way to fix it from the UI. Rebuilding costs nothing here: there
  // are no sets to lose.
  if (existingSetCount === 0) return true;

  if (existingSessionType === plannedSessionType) return false; // already right
  return true; // untouched scaffolding under a stale plan
}
