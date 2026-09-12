/**
 * Date/timezone helpers — BUILD_SPEC.md §11.1. Health Connect timestamps are
 * epoch ms UTC; Naman is UTC+05:30. Every calendar-date decision must happen
 * in Asia/Kolkata, not server-local time or raw UTC — this is called out as
 * the single most likely bug in the whole build.
 */
import { TZDate } from "@date-fns/tz";
import { format, isValid } from "date-fns";

export const APP_TIMEZONE = "Asia/Kolkata";

const DATE_PARAM_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's calendar date in Asia/Kolkata, as "YYYY-MM-DD". */
export function todayIso(timezone: string = APP_TIMEZONE): string {
  return format(new TZDate(new Date(), timezone), "yyyy-MM-dd");
}

/**
 * Parse a "YYYY-MM-DD" route/query param into a UTC-midnight Date suitable
 * for a Prisma `@db.Date` column (which has no time-of-day component).
 * Throws on anything that isn't a real calendar date.
 */
export function parseDateParam(dateStr: string): Date {
  if (!DATE_PARAM_RE.test(dateStr)) {
    throw new Error(`Invalid date: "${dateStr}" (expected YYYY-MM-DD)`);
  }
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  if (!isValid(date) || toDateParam(date) !== dateStr) {
    throw new Error(`Invalid date: "${dateStr}" (expected YYYY-MM-DD)`);
  }
  return date;
}

export function toDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Render a UTC instant as an "HH:mm" clock time in Asia/Kolkata — the
 * inverse of the bedtime half of `bedtimeToUtc`, for displaying it back. */
export function formatTimeInTz(date: Date, timezone: string = APP_TIMEZONE): string {
  return format(new TZDate(date, timezone), "HH:mm");
}

/** Weekday of a calendar date as 0 = Monday … 6 = Sunday (not JS's Sunday-first). */
export function toWeekday(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

/** The Monday of the week containing this calendar date, as a UTC-midnight Date. */
export function startOfWeekMonday(date: Date): Date {
  const monday = new Date(date);
  monday.setUTCDate(monday.getUTCDate() - toWeekday(date));
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

/** "HH:mm" → a friendly "12:30 AM" for display. */
export function formatClock12h(hhmm: string): string {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

/**
 * Combine a "YYYY-MM-DD" calendar date (the day being viewed/logged — i.e.
 * the wake date) with a "HH:mm" bedtime, both in Asia/Kolkata, into the UTC
 * instant it represents. An evening bedtime (>= noon) belongs to the night
 * *before* the wake date; a past-midnight bedtime (< noon) belongs to the
 * wake date itself. Mirrors the "sleep belongs to its wake date" convention
 * the importer will use in Phase 2 (§7.3), applied here for manual entry.
 */
export function bedtimeToUtc(
  wakeDateStr: string,
  timeStr: string,
  timezone: string = APP_TIMEZONE,
): Date {
  const [hours] = timeStr.split(":").map(Number);
  const wakeDate = parseDateParam(wakeDateStr);
  const nightDate = new Date(wakeDate);
  if (hours >= 12) {
    nightDate.setUTCDate(nightDate.getUTCDate() - 1);
  }
  const nightDateStr = toDateParam(nightDate);
  const local = new TZDate(`${nightDateStr}T${timeStr}:00`, timezone);
  return new Date(local.getTime());
}
