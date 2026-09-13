/**
 * Rules for reconciling an already-created session against the current week
 * plan. Pure — no I/O — because getting this wrong deletes real training data.
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
}): boolean {
  const { existingSessionType, plannedSessionType, existingHasLoggedWork } = input;
  if (plannedSessionType === null) return false; // nothing planned — leave it alone
  if (existingSessionType === plannedSessionType) return false; // already right
  return !existingHasLoggedWork; // only ever discard untouched scaffolding
}
