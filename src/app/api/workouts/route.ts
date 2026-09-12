import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDateParam } from "@/lib/date";
import { createWorkoutSchema, dateParamSchema } from "@/lib/validation";
import { createSetsFromTemplate, isSessionType, workoutInclude } from "@/lib/workouts";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const exerciseIdStr = searchParams.get("exerciseId");

  const where: Prisma.WorkoutWhereInput = {};
  if (dateStr) {
    if (!dateParamSchema.safeParse(dateStr).success) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    where.date = parseDateParam(dateStr);
  } else if (from || to) {
    where.date = {
      ...(from ? { gte: parseDateParam(from) } : {}),
      ...(to ? { lte: parseDateParam(to) } : {}),
    };
  }
  if (exerciseIdStr) {
    where.sets = { some: { exerciseId: Number(exerciseIdStr) } };
  }

  const workouts = await prisma.workout.findMany({
    where,
    include: workoutInclude,
    orderBy: { date: "desc" },
    take: 50,
  });
  return NextResponse.json(workouts);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createWorkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date: dateStr, sessionType, durationMin, notes } = parsed.data;
  const date = parseDateParam(dateStr);

  await prisma.dailyLog.upsert({ where: { date }, create: { date }, update: {} });

  const workout = await prisma.workout.create({
    data: { date, sessionType, durationMin: durationMin ?? null, notes: notes ?? null },
  });

  if (isSessionType(sessionType)) {
    await createSetsFromTemplate(workout.id, sessionType);
  }

  const full = await prisma.workout.findUnique({ where: { id: workout.id }, include: workoutInclude });
  return NextResponse.json(full, { status: 201 });
}
