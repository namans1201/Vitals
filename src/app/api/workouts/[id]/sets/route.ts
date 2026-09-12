import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addWorkoutSetSchema } from "@/lib/validation";

/** Add an exercise (from the library) to an existing session — the
 * ad-hoc/"custom session" path from BUILD_SPEC.md §5.2, resolved to pick
 * from the Exercise library rather than a freeform name. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workoutId = Number(id);
  if (!Number.isInteger(workoutId)) {
    return NextResponse.json({ error: "Invalid workout id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = addWorkoutSetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { exerciseId, targetSets } = parsed.data;

  const [workout, exercise] = await Promise.all([
    prisma.workout.findUnique({ where: { id: workoutId } }),
    prisma.exercise.findUnique({ where: { id: exerciseId } }),
  ]);
  if (!workout) return NextResponse.json({ error: "Workout not found" }, { status: 404 });
  if (!exercise) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });

  const existingCount = await prisma.workoutSet.count({ where: { workoutId, exerciseId } });

  const created = await prisma.workoutSet.createManyAndReturn({
    data: Array.from({ length: targetSets }, (_, i) => ({
      workoutId,
      exerciseId,
      setIndex: existingCount + i + 1,
    })),
    include: { exercise: true },
  });

  return NextResponse.json(created, { status: 201 });
}
