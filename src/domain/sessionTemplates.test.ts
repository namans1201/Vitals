import { describe, expect, it } from "vitest";
import { planForWeekday, SESSION_TEMPLATES } from "./sessionTemplates";

describe("SESSION_TEMPLATES", () => {
  it("defines all five sessions with at least one exercise each", () => {
    for (const key of ["upper_a", "lower_a", "upper_b", "lower_b", "full_body"] as const) {
      expect(SESSION_TEMPLATES[key].length).toBeGreaterThan(0);
    }
  });
});

describe("planForWeekday", () => {
  it("under full_body_reset, only Saturday has an active session", () => {
    expect(planForWeekday(6, "full_body_reset").activeSessionType).toBe("full_body");
    expect(planForWeekday(1, "full_body_reset").activeSessionType).toBeNull();
    expect(planForWeekday(0, "full_body_reset").activeSessionType).toBeNull();
  });

  it("always exposes the four-day-split reference regardless of active program", () => {
    expect(planForWeekday(1, "full_body_reset").referenceSessionType).toBe("upper_a");
    expect(planForWeekday(2, "full_body_reset").referenceSessionType).toBe("lower_a");
    expect(planForWeekday(5, "full_body_reset").referenceSessionType).toBe("upper_b");
    expect(planForWeekday(6, "full_body_reset").referenceSessionType).toBe("lower_b");
    expect(planForWeekday(3, "full_body_reset").referenceSessionType).toBeNull(); // Wednesday: off
  });

  it("under four_day_split, active matches reference", () => {
    const plan = planForWeekday(1, "four_day_split");
    expect(plan.activeSessionType).toBe(plan.referenceSessionType);
    expect(plan.activeSessionType).toBe("upper_a");
  });

  it("flags Sunday as the measurement day regardless of program", () => {
    expect(planForWeekday(0, "full_body_reset").isMeasurementDay).toBe(true);
    expect(planForWeekday(0, "four_day_split").isMeasurementDay).toBe(true);
    expect(planForWeekday(1, "full_body_reset").isMeasurementDay).toBe(false);
  });
});
