import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDateParam } from "@/lib/date";
import { createRunSchema, dateParamSchema } from "@/lib/validation";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limitParam = searchParams.get("limit");

  const where: Prisma.RunWhereInput = {};
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

  const runs = await prisma.run.findMany({
    where,
    orderBy: { date: "desc" },
    take: limitParam ? Math.min(Number(limitParam) || 20, 200) : 50,
  });
  return NextResponse.json(runs);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createRunSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date: dateStr, ...rest } = parsed.data;
  const date = parseDateParam(dateStr);

  await prisma.dailyLog.upsert({ where: { date }, create: { date }, update: {} });

  const run = await prisma.run.create({
    data: {
      date,
      type: rest.type,
      durationSec: rest.durationSec,
      distanceM: rest.distanceM ?? null,
      avgHr: rest.avgHr ?? null,
      maxHr: rest.maxHr ?? null,
      notes: rest.notes ?? null,
    },
  });
  return NextResponse.json(run, { status: 201 });
}
