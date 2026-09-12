/**
 * Weekly schedule allocator.
 *
 * You pick your run days and your strictly-off days; this works out where the
 * four lifting sessions go. Pure functions, no I/O.
 *
 * The rules, as agreed:
 *  - Week runs Monday → Sunday
 *  - 4 lifts (Upper A, Lower A, Upper B, Lower B) + 2 strictly-off + 1 flexible = 7
 *  - 3 runs a week, in the morning, paired onto upper days (lift that evening)
 *  - Never a run on a leg day
 *  - Never a run the day *after* a leg day (checked across the week boundary
 *    too, since the same shape repeats every week)
 *  - Leg days spaced apart; upper days spaced apart
 *
 * A consequence worth knowing: with 3 runs, 2 off days and no running on or
 * after legs, the two leg days are fully determined — they're whatever is
 * left once run days and off days are chosen. The only real choice left is
 * which of the three run days is the flexible one.
 */

/** 0 = Monday … 6 = Sunday. Deliberately not JS's Sunday-first convention. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export type LiftSession = "upper_a" | "lower_a" | "upper_b" | "lower_b";

export const LEG_SESSIONS: LiftSession[] = ["lower_a", "lower_b"];

export const RUNS_PER_WEEK = 3;
export const OFF_DAYS_PER_WEEK = 2;

export type DayAssignment = {
  weekday: Weekday;
  /** The lifting session that lands on this day, if any. */
  lift: LiftSession | null;
  /** A morning run happens on this day. */
  run: boolean;
  /** Strictly off — no lift, no run. */
  off: boolean;
  /** The one flexible day: an easy run/walk, or mobility/core, your call. */
  flex: boolean;
};

export type WeekSchedule = {
  /** Always length 7, Monday first. */
  days: DayAssignment[];
};

export type ScheduleResult =
  | { ok: true; schedule: WeekSchedule }
  | { ok: false; problems: string[] };

const dayName = (d: Weekday) => WEEKDAY_NAMES[d];
const nextDay = (d: Weekday): Weekday => (((d + 1) % 7) as Weekday);

/** Smaller of the two arcs between two days on a 7-day cycle. */
function circularGap(a: Weekday, b: Weekday): number {
  const raw = Math.abs(a - b);
  return Math.min(raw, 7 - raw);
}

/** 3 or 4 days apart is the ideal spacing for a pair of sessions in a week. */
function spacingPenalty(a: Weekday, b: Weekday): number {
  return Math.abs(circularGap(a, b) - 3.5);
}

function validateInputs(runDays: Weekday[], offDays: Weekday[]): string[] {
  const problems: string[] = [];

  const uniqueRuns = new Set(runDays);
  const uniqueOffs = new Set(offDays);

  if (uniqueRuns.size !== runDays.length) problems.push("A day is listed twice as a run day.");
  if (uniqueOffs.size !== offDays.length) problems.push("A day is listed twice as an off day.");

  if (uniqueRuns.size !== RUNS_PER_WEEK) {
    problems.push(`Pick exactly ${RUNS_PER_WEEK} run days (you picked ${uniqueRuns.size}).`);
  }
  if (uniqueOffs.size !== OFF_DAYS_PER_WEEK) {
    problems.push(`Pick exactly ${OFF_DAYS_PER_WEEK} off days (you picked ${uniqueOffs.size}).`);
  }

  const clash = [...uniqueRuns].filter((d) => uniqueOffs.has(d));
  for (const d of clash) {
    problems.push(`${dayName(d)} can't be both a run day and a strictly-off day.`);
  }

  return problems;
}

/**
 * Work out the week. Returns either a schedule or the specific reasons the
 * chosen days can't produce a legal one — never a silently-broken plan.
 */
export function buildWeekSchedule(input: {
  runDays: Weekday[];
  offDays: Weekday[];
}): ScheduleResult {
  const { runDays, offDays } = input;

  const problems = validateInputs(runDays, offDays);
  if (problems.length > 0) return { ok: false, problems };

  const runSet = new Set(runDays);
  const offSet = new Set(offDays);

  // Legs can't be on a run day or an off day, so they're whatever is left.
  const legDays = WEEKDAYS.filter((d) => !runSet.has(d) && !offSet.has(d));
  if (legDays.length !== 2) {
    return {
      ok: false,
      problems: [
        `That leaves ${legDays.length} day(s) for leg sessions, but two are needed.`,
      ],
    };
  }

  // No run the day after a leg day.
  const afterLegProblems = legDays
    .filter((legDay) => runSet.has(nextDay(legDay)))
    .map(
      (legDay) =>
        `${dayName(nextDay(legDay))} is a run day, but it falls the day after leg day ${dayName(
          legDay,
        )}. Move that run, or shift an off day.`,
    );
  if (afterLegProblems.length > 0) return { ok: false, problems: afterLegProblems };

  const [lowerADay, lowerBDay] = legDays as [Weekday, Weekday];

  // The only choice left: which run day is the flexible one, and therefore
  // which two carry the upper sessions.
  let best: { schedule: WeekSchedule; score: number } | null = null;

  for (const flexDay of runDays) {
    const upperDays = runDays.filter((d) => d !== flexDay).sort((a, b) => a - b) as [
      Weekday,
      Weekday,
    ];
    const [upperADay, upperBDay] = upperDays;

    const liftByDay = new Map<Weekday, LiftSession>([
      [upperADay, "upper_a"],
      [lowerADay, "lower_a"],
      [upperBDay, "upper_b"],
      [lowerBDay, "lower_b"],
    ]);

    const days: DayAssignment[] = WEEKDAYS.map((weekday) => ({
      weekday,
      lift: liftByDay.get(weekday) ?? null,
      run: runSet.has(weekday),
      off: offSet.has(weekday),
      flex: weekday === flexDay,
    }));

    const score =
      spacingPenalty(upperADay, upperBDay) +
      spacingPenalty(lowerADay, lowerBDay) +
      consecutiveLiftPenalty(days);

    if (best === null || score < best.score) {
      best = { schedule: { days }, score };
    }
  }

  // `best` is always set: runDays has exactly 3 entries by this point.
  return { ok: true, schedule: best!.schedule };
}

/** Three lifting days in a row is a lot of accumulated fatigue — nudge away from it. */
function consecutiveLiftPenalty(days: DayAssignment[]): number {
  let penalty = 0;
  for (const d of WEEKDAYS) {
    const a = days[d].lift !== null;
    const b = days[nextDay(d)].lift !== null;
    const c = days[nextDay(nextDay(d))].lift !== null;
    if (a && b && c) penalty += 1;
  }
  return penalty;
}

export type WeekOption = {
  runDays: Weekday[];
  offDays: Weekday[];
  schedule: WeekSchedule;
  score: number;
};

/**
 * Every combination of run days and off days that produces a legal week,
 * best-spaced first. Used to offer suggestions rather than leaving you to
 * guess which picks happen to work.
 */
export function suggestWeekOptions(limit = 5): WeekOption[] {
  const options: WeekOption[] = [];

  for (const runDays of combinations(WEEKDAYS, RUNS_PER_WEEK)) {
    const remaining = WEEKDAYS.filter((d) => !runDays.includes(d));
    for (const offDays of combinations(remaining, OFF_DAYS_PER_WEEK)) {
      const result = buildWeekSchedule({ runDays, offDays });
      if (!result.ok) continue;

      const liftDays = result.schedule.days.filter((d) => d.lift !== null);
      const uppers = liftDays.filter((d) => d.lift === "upper_a" || d.lift === "upper_b");
      const legs = liftDays.filter((d) => d.lift === "lower_a" || d.lift === "lower_b");
      const score =
        spacingPenalty(uppers[0].weekday, uppers[1].weekday) +
        spacingPenalty(legs[0].weekday, legs[1].weekday) +
        consecutiveLiftPenalty(result.schedule.days);

      options.push({ runDays, offDays, schedule: result.schedule, score });
    }
  }

  return options.sort((a, b) => a.score - b.score).slice(0, limit);
}

function combinations<T>(items: T[], k: number): T[][] {
  if (k === 0) return [[]];
  const out: T[][] = [];
  for (let i = 0; i <= items.length - k; i++) {
    for (const rest of combinations(items.slice(i + 1), k - 1)) {
      out.push([items[i], ...rest]);
    }
  }
  return out;
}
