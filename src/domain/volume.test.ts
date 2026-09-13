import { describe, expect, it } from "vitest";
import { volumeFlag, weeklySetsByMuscle, type CountableSet } from "./volume";

const set = (
  muscleGroup: CountableSet["muscleGroup"],
  date: string,
  completed = true,
): CountableSet => ({ muscleGroup, date: new Date(date), completed });

describe("weeklySetsByMuscle", () => {
  const from = new Date("2026-09-07");
  const to = new Date("2026-09-13");

  it("counts each completed set once against its muscle group", () => {
    const sets = [set("chest", "2026-09-08"), set("chest", "2026-09-10"), set("side_delt", "2026-09-08")];
    const result = weeklySetsByMuscle(sets, from, to);
    expect(result.chest).toBe(2);
    expect(result.side_delt).toBe(1);
  });

  it("excludes uncompleted sets", () => {
    const sets = [set("chest", "2026-09-08", false), set("chest", "2026-09-08", true)];
    expect(weeklySetsByMuscle(sets, from, to).chest).toBe(1);
  });

  it("excludes sets outside the date range", () => {
    const sets = [set("chest", "2026-09-01"), set("chest", "2026-09-08"), set("chest", "2026-09-20")];
    expect(weeklySetsByMuscle(sets, from, to).chest).toBe(1);
  });

  it("counts a unilateral exercise's sets the same as any other - once per row", () => {
    // Bulgarian split squat, 3 sets logged (each set implicitly both legs) -
    // must count as 3, not 6.
    const sets = [set("quads", "2026-09-08"), set("quads", "2026-09-08"), set("quads", "2026-09-08")];
    expect(weeklySetsByMuscle(sets, from, to).quads).toBe(3);
  });

  it("returns an empty record for no sets", () => {
    expect(weeklySetsByMuscle([], from, to)).toEqual({});
  });
});

describe("volumeFlag", () => {
  it("flags under 10 as under", () => {
    expect(volumeFlag(9)).toBe("under");
    expect(volumeFlag(0)).toBe("under");
  });

  it("flags 10 through 20 inclusive as ok", () => {
    expect(volumeFlag(10)).toBe("ok");
    expect(volumeFlag(15)).toBe("ok");
    expect(volumeFlag(20)).toBe("ok");
  });

  it("flags over 20 as over", () => {
    expect(volumeFlag(21)).toBe("over");
  });
});
