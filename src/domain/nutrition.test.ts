import { describe, expect, it } from "vitest";
import { scaleFoodMacros } from "./nutrition";

describe("scaleFoodMacros", () => {
  const paneer = { baseAmount: 100, proteinG: 18, caloriesKcal: 265, fatG: 20, carbG: 1.5 };

  it("returns the base macros unchanged at the base amount", () => {
    expect(scaleFoodMacros(paneer, 100)).toEqual({
      proteinG: 18,
      caloriesKcal: 265,
      fatG: 20,
      carbG: 1.5,
    });
  });

  it("scales linearly for a smaller amount", () => {
    const result = scaleFoodMacros(paneer, 50);
    expect(result.proteinG).toBe(9);
    expect(result.fatG).toBe(10);
    expect(result.caloriesKcal).toBe(133); // rounded from 132.5
  });

  it("scales linearly for a larger amount", () => {
    const result = scaleFoodMacros(paneer, 150);
    expect(result.proteinG).toBe(27);
    expect(result.caloriesKcal).toBe(398); // rounded from 397.5
  });

  it("treats a negative amount as zero rather than inverting macros", () => {
    const result = scaleFoodMacros(paneer, -50);
    expect(result).toEqual({ proteinG: 0, caloriesKcal: 0, fatG: 0, carbG: 0 });
  });

  it("returns all-zero macros for a zero baseAmount rather than dividing by it", () => {
    const broken = { baseAmount: 0, proteinG: 10, caloriesKcal: 100, fatG: 5, carbG: 5 };
    expect(scaleFoodMacros(broken, 100)).toEqual({ proteinG: 0, caloriesKcal: 0, fatG: 0, carbG: 0 });
  });

  it("scales a piece-based food (e.g. one egg) the same way", () => {
    const egg = { baseAmount: 1, proteinG: 6, caloriesKcal: 78, fatG: 5.5, carbG: 0.6 };
    const result = scaleFoodMacros(egg, 3);
    expect(result.proteinG).toBe(18);
    expect(result.caloriesKcal).toBe(234);
  });
});
