import { describe, expect, it } from "vitest";
import {
  buildWeekSchedule,
  suggestWeekOptions,
  WEEKDAY_NAMES,
  type Weekday,
} from "./weekPlan";

const MON = 0 as Weekday;
const TUE = 1 as Weekday;
const WED = 2 as Weekday;
const THU = 3 as Weekday;
const FRI = 4 as Weekday;
const SAT = 5 as Weekday;
const SUN = 6 as Weekday;

function scheduleOf(runDays: Weekday[], offDays: Weekday[]) {
  const result = buildWeekSchedule({ runDays, offDays });
  if (!result.ok) throw new Error(`expected a schedule, got: ${result.problems.join(" / ")}`);
  return result.schedule;
}

describe("buildWeekSchedule - input validation", () => {
  it("requires exactly 3 run days", () => {
    const result = buildWeekSchedule({ runDays: [MON, WED], offDays: [SAT, SUN] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.problems.join(" ")).toContain("exactly 3 run days");
  });

  it("requires exactly 2 off days", () => {
    const result = buildWeekSchedule({ runDays: [MON, WED, FRI], offDays: [SUN] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.problems.join(" ")).toContain("exactly 2 off days");
  });

  it("rejects a day that is both a run day and an off day", () => {
    const result = buildWeekSchedule({ runDays: [MON, WED, FRI], offDays: [FRI, SUN] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.problems.join(" ")).toContain("both a run day");
  });

  it("rejects duplicate run days", () => {
    const result = buildWeekSchedule({ runDays: [MON, MON, FRI], offDays: [SAT, SUN] });
    expect(result.ok).toBe(false);
  });
});

describe("buildWeekSchedule - the no-run-after-legs rule", () => {
  it("rejects the classic Mon/Fri/Sun pattern, because Sunday's run follows Saturday legs", () => {
    // The original programme's own admitted weak point.
    const result = buildWeekSchedule({ runDays: [MON, FRI, SUN], offDays: [WED, THU] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.problems.join(" ")).toContain("Sunday");
      expect(result.problems.join(" ")).toContain("Saturday");
    }
  });

  it("accepts Mon/Thu/Sun runs with Wed/Sat off", () => {
    const schedule = scheduleOf([MON, THU, SUN], [WED, SAT]);
    const byDay = Object.fromEntries(schedule.days.map((d) => [WEEKDAY_NAMES[d.weekday], d]));

    expect(byDay.Tuesday.lift).toBe("lower_a");
    expect(byDay.Friday.lift).toBe("lower_b");
    expect(byDay.Tuesday.run).toBe(false);
    expect(byDay.Friday.run).toBe(false);
  });

  it("checks the rule across the week boundary too", () => {
    // Sunday legs + Monday run would collide every single week.
    const result = buildWeekSchedule({ runDays: [MON, WED, FRI], offDays: [TUE, THU] });
    // Leftover days are Saturday and Sunday -> legs. Sunday + 1 wraps to Monday, a run day.
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.problems.join(" ")).toContain("Monday");
  });
});

describe("buildWeekSchedule - assignments", () => {
  it("never puts a run on a leg day", () => {
    const schedule = scheduleOf([MON, THU, SUN], [WED, SAT]);
    for (const day of schedule.days) {
      if (day.lift === "lower_a" || day.lift === "lower_b") {
        expect(day.run).toBe(false);
      }
    }
  });

  it("places all four lifts, exactly once each", () => {
    const schedule = scheduleOf([MON, THU, SUN], [WED, SAT]);
    const lifts = schedule.days.map((d) => d.lift).filter(Boolean).sort();
    expect(lifts).toEqual(["lower_a", "lower_b", "upper_a", "upper_b"]);
  });

  it("never puts a lift on a strictly-off day", () => {
    const schedule = scheduleOf([MON, THU, SUN], [WED, SAT]);
    for (const day of schedule.days) {
      if (day.off) {
        expect(day.lift).toBeNull();
        expect(day.run).toBe(false);
      }
    }
  });

  it("marks exactly one flexible day, and it is a run day", () => {
    const schedule = scheduleOf([MON, THU, SUN], [WED, SAT]);
    const flex = schedule.days.filter((d) => d.flex);
    expect(flex).toHaveLength(1);
    expect(flex[0].run).toBe(true);
    expect(flex[0].lift).toBeNull();
  });

  it("pairs runs onto the upper days (the non-flex run days)", () => {
    const schedule = scheduleOf([MON, THU, SUN], [WED, SAT]);
    const uppers = schedule.days.filter((d) => d.lift === "upper_a" || d.lift === "upper_b");
    expect(uppers).toHaveLength(2);
    for (const day of uppers) expect(day.run).toBe(true);
  });

  it("orders upper_a before upper_b and lower_a before lower_b", () => {
    const schedule = scheduleOf([MON, THU, SUN], [WED, SAT]);
    const dayOf = (lift: string) => schedule.days.find((d) => d.lift === lift)!.weekday;
    expect(dayOf("upper_a")).toBeLessThan(dayOf("upper_b"));
    expect(dayOf("lower_a")).toBeLessThan(dayOf("lower_b"));
  });

  it("always returns exactly 7 days, Monday first", () => {
    const schedule = scheduleOf([MON, THU, SUN], [WED, SAT]);
    expect(schedule.days).toHaveLength(7);
    expect(schedule.days[0].weekday).toBe(MON);
    expect(schedule.days[6].weekday).toBe(SUN);
  });
});

describe("suggestWeekOptions", () => {
  it("only ever returns legal schedules", () => {
    for (const option of suggestWeekOptions(20)) {
      const rebuilt = buildWeekSchedule({ runDays: option.runDays, offDays: option.offDays });
      expect(rebuilt.ok).toBe(true);
    }
  });

  it("finds at least one workable week", () => {
    expect(suggestWeekOptions().length).toBeGreaterThan(0);
  });

  it("ranks well-spaced weeks first", () => {
    const options = suggestWeekOptions(10);
    expect(options[0].score).toBeLessThanOrEqual(options[options.length - 1].score);
  });
});
