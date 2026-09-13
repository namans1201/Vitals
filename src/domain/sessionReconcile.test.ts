import { describe, expect, it } from "vitest";
import { hasLoggedWork, shouldReplaceScaffold } from "./sessionReconcile";

const emptySet = { completed: false, reps: null, weightKg: null, rir: null };

describe("hasLoggedWork", () => {
  it("is false for freshly-created scaffolding", () => {
    expect(hasLoggedWork([emptySet, emptySet, emptySet])).toBe(false);
  });

  it("is true once a set is ticked", () => {
    expect(hasLoggedWork([emptySet, { ...emptySet, completed: true }])).toBe(true);
  });

  it("is true once reps, weight or RIR is entered, even untick", () => {
    expect(hasLoggedWork([{ ...emptySet, reps: 8 }])).toBe(true);
    expect(hasLoggedWork([{ ...emptySet, weightKg: 10 }])).toBe(true);
    expect(hasLoggedWork([{ ...emptySet, rir: 2 }])).toBe(true);
  });

  it("is false for a session with no sets at all", () => {
    expect(hasLoggedWork([])).toBe(false);
  });
});

describe("shouldReplaceScaffold", () => {
  it("replaces untouched scaffolding when the plan now says something else", () => {
    expect(
      shouldReplaceScaffold({
        existingSessionType: "full_body",
        plannedSessionType: "upper_a",
        existingHasLoggedWork: false,
      }),
    ).toBe(true);
  });

  it("NEVER discards a session that has logged work", () => {
    expect(
      shouldReplaceScaffold({
        existingSessionType: "full_body",
        plannedSessionType: "upper_a",
        existingHasLoggedWork: true,
      }),
    ).toBe(false);
  });

  it("leaves a session alone when it already matches the plan", () => {
    expect(
      shouldReplaceScaffold({
        existingSessionType: "upper_a",
        plannedSessionType: "upper_a",
        existingHasLoggedWork: false,
      }),
    ).toBe(false);
  });

  it("leaves a session alone on a day with nothing planned", () => {
    // e.g. an ad-hoc session logged on a rest day - the plan doesn't unmake it.
    expect(
      shouldReplaceScaffold({
        existingSessionType: "custom",
        plannedSessionType: null,
        existingHasLoggedWork: false,
      }),
    ).toBe(false);
  });
});
