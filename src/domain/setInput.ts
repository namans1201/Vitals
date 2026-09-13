/** Reps and RIR are always non-negative whole numbers, entered as plain
 * strings so an empty field can mean "not logged" - distinct from zero,
 * which for RIR ("reps in reserve") is a real, meaningful value (0 = went
 * to failure). Pure functions, no I/O. */

/** Strips anything that isn't a digit - typing a minus sign or a decimal
 * point into a reps/RIR field drops it immediately rather than accepting it
 * and only flagging the field invalid after the fact. */
export function sanitizeWholeNumberInput(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

/** Applied on blur, once the field already contains only digits (or is
 * empty) - the one thing sanitizeWholeNumberInput can't catch by itself is a
 * value below the field's minimum (e.g. "0" reps, when a set has to be at
 * least one rep to count as done). Empty is left alone: "not logged" is a
 * different thing from "0" and should never be silently turned into `min`. */
export function clampWholeNumber(value: string, min: number): string {
  if (value === "") return value;
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return String(Math.max(min, n));
}
