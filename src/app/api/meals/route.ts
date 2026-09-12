import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDateParam } from "@/lib/date";
import { createMealSchema, dateParamSchema } from "@/lib/validation";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.MealWhereInput = {};
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

  const meals = await prisma.meal.findMany({
    where,
    orderBy: [{ date: "desc" }, { time: "asc" }],
    take: 200,
  });
  return NextResponse.json(meals);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createMealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date: dateStr, ...rest } = parsed.data;
  const date = parseDateParam(dateStr);

  await prisma.dailyLog.upsert({ where: { date }, create: { date }, update: {} });

  const meal = await prisma.meal.create({ data: { date, ...rest } });
  return NextResponse.json(meal, { status: 201 });
}
