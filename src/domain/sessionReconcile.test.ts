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
        existingSetCount: 11,
      }),
    ).toBe(true);
  });

  it("NEVER discards a session that has logged work", () => {
    expect(
      shouldReplaceScaffold({
        existingSessionType: "full_body",
        plannedSessionType: "upper_a",
        existingHasLoggedWork: true,
        existingSetCount: 11,
      }),
    ).toBe(false);
  });

  it("leaves a session alone when it already matches the plan", () => {
    expect(
      shouldReplaceScaffold({
        existingSessionType: "upper_a",
        plannedSessionType: "upper_a",
        existingHasLoggedWork: false,
        existingSetCount: 11,
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
        existingSetCount: 11,
      }),
    ).toBe(false);
  });

  it("rebuilds a session that has zero sets, even when its type matches the plan", () => {
    // The real failure this guards: a session scaffolded while the exercise
    // library was empty/incomplete gets zero sets, and matching the planned
    // type used to mean "already right" - leaving it permanently empty with
    // no way to fix it from the UI.
    expect(
      shouldReplaceScaffold({
        existingSessionType: "upper_a",
        plannedSessionType: "upper_a",
        existingHasLoggedWork: false,
        existingSetCount: 0,
      }),
    ).toBe(true);
  });

  it("still won't rebuild an empty session that somehow has logged work", () => {
    // Defensive: logged work always wins over the empty-scaffold rule.
    expect(
      shouldReplaceScaffold({
        existingSessionType: "upper_a",
        plannedSessionType: "upper_a",
        existingHasLoggedWork: true,
        existingSetCount: 0,
      }),
    ).toBe(false);
  });

  it("leaves an empty session alone when nothing is planned that day", () => {
    expect(
      shouldReplaceScaffold({
        existingSessionType: "custom",
        plannedSessionType: null,
        existingHasLoggedWork: false,
        existingSetCount: 0,
      }),
    ).toBe(false);
  });
});
