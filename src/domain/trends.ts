/** Trends and the recomposition signal - BUILD_SPEC.md §6.5. Pure functions, no I/O. */

export type SeriesPoint = { date: Date; value: number };

/** 7-day trailing mean by default; each point is the mean of itself and up
 * to `window - 1` preceding points, in date order. */
export const rollingMean = (series: SeriesPoint[], window = 7): SeriesPoint[] => {
  const sorted = [...series].sort((a, b) => a.date.getTime() - b.date.getTime());
  return sorted.map((point, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = sorted.slice(start, i + 1);
    const mean = slice.reduce((sum, p) => sum + p.value, 0) / slice.length;
    return { date: point.date, value: mean };
  });
};

export type TrendDirection = "up" | "down" | "flat";

export type LinearTrendResult = {
  /** Value change per day. */
  slope: number;
  direction: TrendDirection;
  /** Value change per 7 days - the more human-legible unit. */
  perWeek: number;
};

const FLAT_EPSILON = 1e-9;

/** Ordinary least-squares fit of value against days-since-first-point. */
export const linearTrend = (series: SeriesPoint[]): LinearTrendResult => {
  const sorted = [...series].sort((a, b) => a.date.getTime() - b.date.getTime());
  const n = sorted.length;
  if (n < 2) {
    return { slope: 0, direction: "flat", perWeek: 0 };
  }

  const DAY_MS = 24 * 60 * 60 * 1000;
  const t0 = sorted[0].date.getTime();
  const xs = sorted.map((p) => (p.date.getTime() - t0) / DAY_MS);
  const ys = sorted.map((p) => p.value);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (xs[i] - meanX) * (ys[i] - meanY);
    denominator += (xs[i] - meanX) ** 2;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const perWeek = slope * 7;
  const direction: TrendDirection =
    Math.abs(perWeek) < FLAT_EPSILON ? "flat" : perWeek > 0 ? "up" : "down";
  return { slope, direction, perWeek };
};

export type RecompositionInput = {
  weight: SeriesPoint[];
  bodyFat: SeriesPoint[];
  muscle: SeriesPoint[];
  waist: SeriesPoint[];
};

export type RecompositionSignal =
  | "recomposing"
  | "gaining_fat"
  | "losing_muscle"
  | "losing_fat"
  | "insufficient_data";

/** BIA is noisy - a two-point "trend" is meaningless. Never draw a
 * conclusion from fewer than this many weekly readings. */
export const MIN_RECOMPOSITION_POINTS = 4;

/** "Roughly flat" weight, in kg/week - used only to confirm a genuine
 * recomposition (fat down, muscle up, weight not swinging either way). */
const WEIGHT_FLAT_THRESHOLD_KG_PER_WEEK = 0.3;

export const recompositionSignal = (input: RecompositionInput): RecompositionSignal => {
  const { weight, bodyFat, muscle } = input;

  if (bodyFat.length < MIN_RECOMPOSITION_POINTS || muscle.length < MIN_RECOMPOSITION_POINTS) {
    return "insufficient_data";
  }

  const bodyFatDirection = linearTrend(bodyFat).direction;
  const muscleDirection = linearTrend(muscle).direction;
  const weightTrend =
    weight.length >= MIN_RECOMPOSITION_POINTS ? linearTrend(weight) : null;
  const weightRoughlyFlat =
    weightTrend === null || Math.abs(weightTrend.perWeek) < WEIGHT_FLAT_THRESHOLD_KG_PER_WEEK;

  if (bodyFatDirection === "down" && muscleDirection === "up" && weightRoughlyFlat) {
    return "recomposing";
  }
  if (bodyFatDirection === "up") return "gaining_fat";
  if (muscleDirection === "down") return "losing_muscle";
  if (bodyFatDirection === "down") return "losing_fat";

  // Both flat, or a recomposing-shaped trend riding on a weight swing too
  // large to call "roughly flat" - no confident signal either way.
  return "insufficient_data";
};
