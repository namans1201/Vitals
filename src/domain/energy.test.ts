import { describe, expect, it } from "vitest";
import { bmr, proteinTarget, tdee } from "./energy";

describe("bmr", () => {
  it("matches the spec's worked example (~1654 kcal at 69kg, 172.7cm, 24, male)", () => {
    expect(bmr(69, 172.7, 24, "male")).toBeCloseTo(1654.375, 2);
  });

  it("applies the -161 offset for female", () => {
    const male = bmr(69, 172.7, 24, "male");
    const female = bmr(69, 172.7, 24, "female");
    expect(male - female).toBe(166); // +5 vs -161
  });
});

describe("tdee", () => {
  it("matches the spec's worked example (~2480 at ×1.5)", () => {
    expect(tdee(1654.375)).toBeCloseTo(2481.5625, 2);
  });

  it("defaults the activity factor to 1.5", () => {
    expect(tdee(1000)).toBe(1500);
  });

  it("accepts a custom activity factor", () => {
    expect(tdee(1000, 1.2)).toBe(1200);
  });
});

describe("proteinTarget", () => {
  it("matches the spec's default 2.1 g/kg, rounded", () => {
    expect(proteinTarget(69)).toBe(145); // 69 * 2.1 = 144.9 -> 145
  });

  it("accepts a custom g/kg", () => {
    expect(proteinTarget(70, 2.0)).toBe(140);
  });
});
