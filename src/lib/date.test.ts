import { describe, expect, it } from "vitest";
import { bedtimeToUtc, parseDateParam, toDateParam } from "./date";

describe("parseDateParam / toDateParam", () => {
  it("round-trips a valid date", () => {
    expect(toDateParam(parseDateParam("2026-09-13"))).toBe("2026-09-13");
  });

  it("rejects a malformed string", () => {
    expect(() => parseDateParam("13-09-2026")).toThrow();
    expect(() => parseDateParam("2026/09/13")).toThrow();
  });

  it("rejects a calendar date that doesn't exist (JS Date silently rolls over)", () => {
    // Feb 30 would silently become Mar 2 if we didn't guard against it.
    expect(() => parseDateParam("2026-02-30")).toThrow();
  });
});

describe("bedtimeToUtc - the midnight-boundary gotcha (§11.1)", () => {
  it("assigns an evening bedtime to the night before the wake date", () => {
    // 11 PM IST on 12 Sep, viewed from the "13 Sep" Today page (wake date).
    const result = bedtimeToUtc("2026-09-13", "23:00");
    expect(result.toISOString()).toBe("2026-09-12T17:30:00.000Z");
  });

  it("assigns a past-midnight bedtime to the wake date itself", () => {
    // 12:30 AM IST on 13 Sep is still "that night", same wake date.
    const result = bedtimeToUtc("2026-09-13", "00:30");
    expect(result.toISOString()).toBe("2026-09-12T19:00:00.000Z");
  });

  it("handles the exact midnight boundary consistently", () => {
    const before = bedtimeToUtc("2026-09-13", "11:59");
    const after = bedtimeToUtc("2026-09-13", "12:00");
    // 11:59 -> still "wake date" (hours < 12); 12:00 -> night before.
    expect(before.toISOString()).toBe("2026-09-13T06:29:00.000Z");
    expect(after.toISOString()).toBe("2026-09-12T06:30:00.000Z");
  });
});
