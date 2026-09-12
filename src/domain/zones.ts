/** Heart rate zones — BUILD_SPEC.md §6.1. Pure functions, no I/O. */

export type Zone = "z1" | "z2" | "z3" | "z4" | "z5";

/** Tanaka et al. (2001) — more accurate than 220−age for adults. */
export const hrMax = (age: number): number => Math.round(208 - 0.7 * age);

export type ZoneRanges = Record<Zone, [number, number]>;

export const zones = (age: number): ZoneRanges => {
  const m = hrMax(age);
  return {
    z1: [0, Math.round(m * 0.6)],
    z2: [Math.round(m * 0.6), Math.round(m * 0.7)],
    z3: [Math.round(m * 0.7), Math.round(m * 0.8)],
    z4: [Math.round(m * 0.8), Math.round(m * 0.9)],
    z5: [Math.round(m * 0.9), m],
  };
};

/** Boundary bpm values fall in the lower of the two adjacent zones. */
export const zoneFor = (bpm: number, age: number): Zone => {
  const z = zones(age);
  if (bpm <= z.z1[1]) return "z1";
  if (bpm <= z.z2[1]) return "z2";
  if (bpm <= z.z3[1]) return "z3";
  if (bpm <= z.z4[1]) return "z4";
  return "z5";
};

export type RunForZoneDistribution = { avgHr: number; durationSec: number };

/**
 * Seconds spent in each zone across a set of runs, classifying each run as a
 * whole by its average HR — manual logging only captures one avgHr per run,
 * not a per-second HR stream, so a true intra-run breakdown isn't possible
 * yet (would need real samples from the Health Connect importer, Phase 2).
 */
export const zoneDistribution = (
  runs: RunForZoneDistribution[],
  age: number,
): Record<Zone, number> => {
  const totals: Record<Zone, number> = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
  for (const run of runs) {
    if (run.durationSec <= 0) continue;
    totals[zoneFor(run.avgHr, age)] += run.durationSec;
  }
  return totals;
};
