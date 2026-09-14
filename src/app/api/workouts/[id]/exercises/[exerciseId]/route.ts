import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { replaceWorkoutExerciseSchema } from "@/lib/validation";

/**
 * Swap one exercise in a session for another from the library, keeping the
 * session's shape: the same number of sets, in the same position.
 *
 * The sets are re-pointed rather than deleted and recreated, so their ids
 * survive and anything holding one (an in-flight PATCH from a rep box that
 * just lost focus) still addresses a real row instead of 404-ing.
 *
 * Every logged value is cleared in the same write. Those numbers were reps of
 * the OLD exercise - carrying them across would file them under the new one,
 * and last-time, best-ever and PR detection all read straight off these rows,
 * so a single careless swap would quietly corrupt the new exercise's history.
 * The client warns before calling this when there is anything to lose.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; exerciseId: string }> },
) {
  const { id, exerciseId } = await params;
  const workoutId = Number(id);
  const fromExerciseId = Number(exerciseId);
  if (!Number.isInteger(workoutId) || !Number.isInteger(fromExerciseId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = replaceWorkoutExerciseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { toExerciseId } = parsed.data;

  if (toExerciseId === fromExerciseId) {
    return NextResponse.json({ error: "That exercise is already here" }, { status: 400 });
  }

  const [target, existingSets, alreadyPresent] = await Promise.all([
    prisma.exercise.findUnique({ where: { id: toExerciseId } }),
    prisma.workoutSet.findMany({ where: { workoutId, exerciseId: fromExerciseId } }),
    prisma.workoutSet.count({ where: { workoutId, exerciseId: toExerciseId } }),
  ]);

  if (!target) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  if (existingSets.length === 0) {
    return NextResponse.json({ error: "That exercise isn't in this session" }, { status: 404 });
  }
  // Allowing this would merge two groups into one card with duplicated set
  // indexes; the picker already hides exercises in the session, so reaching
  // here means a stale page.
  if (alreadyPresent > 0) {
    return NextResponse.json(
      { error: "That exercise is already in this session" },
      { status: 409 },
    );
  }

  const updated = await prisma.workoutSet.updateMany({
    where: { workoutId, exerciseId: fromExerciseId },
    data: { exerciseId: toExerciseId, reps: null, weightKg: null, rir: null, completed: false },
  });

  return NextResponse.json({ replaced: updated.count, exercise: target });
}

/**
 * Drop an exercise out of a session entirely, sets and all.
 *
 * Refuses to remove the last one. An empty session is not a neutral state
 * here: shouldReplaceScaffold treats zero sets as a failed scaffold and
 * rebuilds the whole thing from the template on the very next render, so
 * removing the final exercise would appear to do nothing while quietly
 * resurrecting every exercise you had already removed. The UI disables the
 * control in that case; this is the backstop for a stale page.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; exerciseId: string }> },
) {
  const { id, exerciseId } = await params;
  const workoutId = Number(id);
  const targetExerciseId = Number(exerciseId);
  if (!Number.isInteger(workoutId) || !Number.isInteger(targetExerciseId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const sets = await prisma.workoutSet.findMany({
    where: { workoutId },
    select: { exerciseId: true },
  });
  if (sets.length === 0) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (!sets.some((s) => s.exerciseId === targetExerciseId)) {
    return NextResponse.json({ error: "That exercise isn't in this session" }, { status: 404 });
  }
  if (new Set(sets.map((s) => s.exerciseId)).size === 1) {
    return NextResponse.json(
      { error: "A session needs at least one exercise" },
      { status: 409 },
    );
  }

  const { count } = await prisma.workoutSet.deleteMany({
    where: { workoutId, exerciseId: targetExerciseId },
  });
  return NextResponse.json({ removed: count });
}
