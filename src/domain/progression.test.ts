import { describe, expect, it } from "vitest";
import { nextLever, progression, PROGRESSION_LEVERS } from "./progression";

describe("nextLever", () => {
  it("starts at add_rep when there is no previous lever", () => {
    expect(nextLever(null)).toBe("add_rep");
  });

  it("advances through the fixed order", () => {
    expect(nextLever("add_rep")).toBe("slow_eccentric");
    expect(nextLever("slow_eccentric")).toBe("add_pause");
    expect(nextLever("add_pause")).toBe("add_set");
    expect(nextLever("add_set")).toBe("harder_variation");
    expect(nextLever("harder_variation")).toBe("add_band");
    expect(nextLever("add_band")).toBe("add_load");
  });

  it("stays at add_load once at the end of the sequence", () => {
    expect(nextLever("add_load")).toBe("add_load");
  });

  it("covers every lever in PROGRESSION_LEVERS", () => {
    expect(PROGRESSION_LEVERS).toHaveLength(7);
  });
});

describe("progression", () => {
  const repsMin = 8;
  const repsMax = 15;

  it("holds with no logged sets", () => {
    const result = progression({ sets: [], repsMin, repsMax });
    expect(result.verdict).toBe("hold");
    expect(result.lever).toBeNull();
  });

  it("progresses when every set hit repsMax with RIR >= 2, defaulting to add_rep", () => {
    const result = progression({
      sets: [
        { reps: 15, rir: 2 },
        { reps: 15, rir: 3 },
      ],
      repsMin,
      repsMax,
    });
    expect(result.verdict).toBe("progress");
    expect(result.lever).toBe("add_rep");
  });

  it("advances to the next lever when given the previously-used one", () => {
    const result = progression(
      { sets: [{ reps: 15, rir: 2 }], repsMin, repsMax },
      "add_rep",
    );
    expect(result.lever).toBe("slow_eccentric");
  });

  it("regresses when any set falls below repsMin, even if others are fine", () => {
    const result = progression({
      sets: [
        { reps: 15, rir: 2 },
        { reps: 6, rir: 2 },
      ],
      repsMin,
      repsMax,
    });
    expect(result.verdict).toBe("regress");
    expect(result.lever).toBeNull();
  });

  it("holds when sets are within range but not all at repsMax", () => {
    const result = progression({
      sets: [{ reps: 12, rir: 2 }],
      repsMin,
      repsMax,
    });
    expect(result.verdict).toBe("hold");
  });

  it("does not progress when a set hit repsMax but RIR wasn't logged", () => {
    const result = progression({
      sets: [{ reps: 15, rir: null }],
      repsMin,
      repsMax,
    });
    expect(result.verdict).toBe("hold");
  });

  it("does not progress when RIR is logged but below 2", () => {
    const result = progression({
      sets: [{ reps: 15, rir: 1 }],
      repsMin,
      repsMax,
    });
    expect(result.verdict).toBe("hold");
  });

  it("regress takes priority even if some sets also hit repsMax", () => {
    const result = progression({
      sets: [
        { reps: 15, rir: 3 },
        { reps: 5, rir: 3 },
      ],
      repsMin,
      repsMax,
    });
    expect(result.verdict).toBe("regress");
  });
});
