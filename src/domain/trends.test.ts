import { describe, expect, it } from "vitest";
import {
  linearTrend,
  MIN_RECOMPOSITION_POINTS,
  recompositionSignal,
  rollingMean,
  type SeriesPoint,
} from "./trends";

const point = (date: string, value: number): SeriesPoint => ({ date: new Date(date), value });

describe("rollingMean", () => {
  it("returns each point unchanged when window is 1", () => {
    const series = [point("2026-09-01", 10), point("2026-09-02", 20)];
    expect(rollingMean(series, 1).map((p) => p.value)).toEqual([10, 20]);
  });

  it("averages over the trailing window, growing until it's full", () => {
    const series = [point("2026-09-01", 10), point("2026-09-02", 20), point("2026-09-03", 30)];
    const result = rollingMean(series, 2);
    expect(result[0].value).toBe(10); // only itself
    expect(result[1].value).toBe(15); // (10+20)/2
    expect(result[2].value).toBe(25); // (20+30)/2
  });

  it("sorts out-of-order input by date first", () => {
    const series = [point("2026-09-03", 30), point("2026-09-01", 10), point("2026-09-02", 20)];
    const result = rollingMean(series, 7);
    expect(result.map((p) => p.date.toISOString())).toEqual(
      [point("2026-09-01", 0), point("2026-09-02", 0), point("2026-09-03", 0)].map((p) =>
        p.date.toISOString(),
      ),
    );
  });
});

describe("linearTrend", () => {
  it("reports flat with fewer than 2 points", () => {
    expect(linearTrend([]).direction).toBe("flat");
    expect(linearTrend([point("2026-09-01", 70)]).direction).toBe("flat");
  });

  it("detects a clear downward trend and computes perWeek", () => {
    const series = [
      point("2026-09-01", 70),
      point("2026-09-08", 69),
      point("2026-09-15", 68),
      point("2026-09-22", 67),
    ];
    const result = linearTrend(series);
    expect(result.direction).toBe("down");
    expect(result.perWeek).toBeCloseTo(-1, 5);
  });

  it("detects a clear upward trend", () => {
    const series = [point("2026-09-01", 40), point("2026-09-08", 41), point("2026-09-15", 42)];
    expect(linearTrend(series).direction).toBe("up");
  });

  it("detects flat when values don't change", () => {
    const series = [point("2026-09-01", 50), point("2026-09-08", 50), point("2026-09-15", 50)];
    expect(linearTrend(series).direction).toBe("flat");
    expect(linearTrend(series).perWeek).toBe(0);
  });
});

describe("recompositionSignal", () => {
  const empty: SeriesPoint[] = [];

  it("requires MIN_RECOMPOSITION_POINTS to be 4", () => {
    expect(MIN_RECOMPOSITION_POINTS).toBe(4);
  });

  it("refuses to draw a conclusion with fewer than 4 body-fat/muscle points", () => {
    const threePoints = [point("2026-09-01", 20), point("2026-09-08", 19), point("2026-09-15", 18)];
    const result = recompositionSignal({
      weight: empty,
      bodyFat: threePoints,
      muscle: threePoints,
      waist: empty,
    });
    expect(result).toBe("insufficient_data");
  });

  it("returns recomposing when body fat falls, muscle rises, weight roughly flat", () => {
    const bodyFat = [
      point("2026-08-01", 22),
      point("2026-08-08", 21.5),
      point("2026-08-15", 21),
      point("2026-08-22", 20.5),
    ];
    const muscle = [
      point("2026-08-01", 30),
      point("2026-08-08", 30.3),
      point("2026-08-15", 30.6),
      point("2026-08-22", 30.9),
    ];
    const weight = [
      point("2026-08-01", 69),
      point("2026-08-08", 69.1),
      point("2026-08-15", 68.9),
      point("2026-08-22", 69),
    ];
    expect(recompositionSignal({ weight, bodyFat, muscle, waist: empty })).toBe("recomposing");
  });

  it("returns gaining_fat when body fat is trending up", () => {
    const bodyFat = [
      point("2026-08-01", 20),
      point("2026-08-08", 21),
      point("2026-08-15", 22),
      point("2026-08-22", 23),
    ];
    const muscle = [
      point("2026-08-01", 30),
      point("2026-08-08", 30),
      point("2026-08-15", 30),
      point("2026-08-22", 30),
    ];
    expect(recompositionSignal({ weight: empty, bodyFat, muscle, waist: empty })).toBe("gaining_fat");
  });

  it("returns losing_muscle when muscle is falling and body fat isn't", () => {
    const bodyFat = [
      point("2026-08-01", 20),
      point("2026-08-08", 20),
      point("2026-08-15", 20),
      point("2026-08-22", 20),
    ];
    const muscle = [
      point("2026-08-01", 31),
      point("2026-08-08", 30.5),
      point("2026-08-15", 30),
      point("2026-08-22", 29.5),
    ];
    expect(recompositionSignal({ weight: empty, bodyFat, muscle, waist: empty })).toBe("losing_muscle");
  });

  it("returns losing_fat when body fat falls but muscle doesn't rise", () => {
    const bodyFat = [
      point("2026-08-01", 22),
      point("2026-08-08", 21),
      point("2026-08-15", 20),
      point("2026-08-22", 19),
    ];
    const muscle = [
      point("2026-08-01", 30),
      point("2026-08-08", 30),
      point("2026-08-15", 30),
      point("2026-08-22", 30),
    ];
    expect(recompositionSignal({ weight: empty, bodyFat, muscle, waist: empty })).toBe("losing_fat");
  });

  it("returns insufficient_data when both series are flat", () => {
    const flat = [
      point("2026-08-01", 20),
      point("2026-08-08", 20),
      point("2026-08-15", 20),
      point("2026-08-22", 20),
    ];
    expect(recompositionSignal({ weight: empty, bodyFat: flat, muscle: flat, waist: empty })).toBe(
      "insufficient_data",
    );
  });

  it("does not call a recomposition-shaped trend recomposing if weight is swinging hard", () => {
    const bodyFat = [
      point("2026-08-01", 22),
      point("2026-08-08", 21),
      point("2026-08-15", 20),
      point("2026-08-22", 19),
    ];
    const muscle = [
      point("2026-08-01", 30),
      point("2026-08-08", 30.5),
      point("2026-08-15", 31),
      point("2026-08-22", 31.5),
    ];
    const weight = [
      point("2026-08-01", 70),
      point("2026-08-08", 68),
      point("2026-08-15", 66),
      point("2026-08-22", 64),
    ];
    // Body fat down + muscle up, but weight is dropping ~2kg/week - not "roughly flat".
    expect(recompositionSignal({ weight, bodyFat, muscle, waist: empty })).not.toBe("recomposing");
  });
});
