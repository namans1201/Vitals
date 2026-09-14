import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Removes a session and its sets (WorkoutSet cascades on delete).
 *
 * Only genuinely removes anything on a day the week plan doesn't call for a
 * session - on a planned day getOrCreateWorkoutForDate immediately scaffolds
 * a fresh one on the next render, so the UI only offers this where it sticks
 * (see WorkoutClient's remove button).
 */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workoutId = Number(id);
  if (!Number.isInteger(workoutId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await prisma.workout.delete({ where: { id: workoutId } }).catch(() => null);
  return new NextResponse(null, { status: 204 });
}
