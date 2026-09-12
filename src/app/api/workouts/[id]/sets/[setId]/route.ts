import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { patchWorkoutSetSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; setId: string }> },
) {
  const { id, setId } = await params;
  const workoutId = Number(id);
  const setIdNum = Number(setId);
  if (!Number.isInteger(workoutId) || !Number.isInteger(setIdNum)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchWorkoutSetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.workoutSet.findUnique({ where: { id: setIdNum } });
  if (!existing || existing.workoutId !== workoutId) {
    return NextResponse.json({ error: "Set not found" }, { status: 404 });
  }

  const updated = await prisma.workoutSet.update({
    where: { id: setIdNum },
    data: parsed.data,
    include: { exercise: true },
  });
  return NextResponse.json(updated);
}
