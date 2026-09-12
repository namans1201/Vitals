import { describe, expect, it } from "vitest";
import { hrMax, zoneDistribution, zoneFor, zones } from "./zones";

describe("hrMax", () => {
  it("matches the spec's worked example for a 24-year-old", () => {
    expect(hrMax(24)).toBe(191);
  });

  it("rounds to the nearest integer", () => {
    expect(hrMax(0)).toBe(208);
  });
});

describe("zones", () => {
  it("matches the spec's worked example ranges at age 24", () => {
    const z = zones(24);
    expect(z.z2).toEqual([115, 134]);
    expect(z.z3).toEqual([134, 153]);
    expect(z.z4).toEqual([153, 172]);
    expect(z.z5).toEqual([172, 191]);
  });

  it("z1 always starts at 0", () => {
    expect(zones(24).z1[0]).toBe(0);
  });
});

describe("zoneFor", () => {
  it("classifies a clearly-Z2 heart rate", () => {
    expect(zoneFor(120, 24)).toBe("z2");
  });

  it("classifies a clearly-Z4 heart rate", () => {
    expect(zoneFor(160, 24)).toBe("z4");
  });

  it("puts an exact zone boundary in the lower zone", () => {
    // z2 upper bound at age 24 is 134
    expect(zoneFor(134, 24)).toBe("z2");
    expect(zoneFor(135, 24)).toBe("z3");
  });

  it("classifies 0 bpm as z1 and hrMax bpm as z5", () => {
    expect(zoneFor(0, 24)).toBe("z1");
    expect(zoneFor(191, 24)).toBe("z5");
  });

  it("clamps anything above hrMax to z5", () => {
    expect(zoneFor(250, 24)).toBe("z5");
  });
});

describe("zoneDistribution", () => {
  it("sums duration into each run's classified zone", () => {
    const dist = zoneDistribution(
      [
        { avgHr: 120, durationSec: 1800 }, // z2
        { avgHr: 120, durationSec: 1200 }, // z2
        { avgHr: 160, durationSec: 600 }, // z4
      ],
      24,
    );
    expect(dist.z2).toBe(3000);
    expect(dist.z4).toBe(600);
    expect(dist.z1).toBe(0);
    expect(dist.z3).toBe(0);
    expect(dist.z5).toBe(0);
  });

  it("ignores zero/negative-duration runs", () => {
    const dist = zoneDistribution([{ avgHr: 120, durationSec: 0 }], 24);
    expect(Object.values(dist).every((v) => v === 0)).toBe(true);
  });

  it("returns all-zero zones for an empty list", () => {
    const dist = zoneDistribution([], 24);
    expect(dist).toEqual({ z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 });
  });
});
