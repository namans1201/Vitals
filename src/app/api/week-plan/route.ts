import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { parseDateParam, startOfWeekMonday } from "@/lib/date";
import { getOrCreateWeekPlan } from "@/lib/weekPlans";
import { buildWeekSchedule, type Weekday } from "@/domain/weekPlan";
import { dateParamSchema } from "@/lib/validation";

const weekdaySchema = z.number().int().min(0).max(6);

const putWeekPlanSchema = z.object({
  /** Any date inside the week being edited. */
  date: dateParamSchema,
  runDays: z.array(weekdaySchema),
  offDays: z.array(weekdaySchema),
  flexChoice: z.enum(["run", "mobility"]),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  if (!dateStr || !dateParamSchema.safeParse(dateStr).success) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  return NextResponse.json(await getOrCreateWeekPlan(parseDateParam(dateStr)));
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = putWeekPlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { date, runDays, offDays, flexChoice } = parsed.data;

  // Refuse to store picks that can't produce a legal week - better to reject
  // with the reason than to persist something the rules can't schedule.
  const check = buildWeekSchedule({
    runDays: runDays as Weekday[],
    offDays: offDays as Weekday[],
  });
  if (!check.ok) {
    return NextResponse.json({ error: "invalid_week", problems: check.problems }, { status: 422 });
  }

  const weekStart = startOfWeekMonday(parseDateParam(date));
  await prisma.weekPlan.upsert({
    where: { weekStart },
    create: { weekStart, runDays, offDays, flexChoice },
    update: { runDays, offDays, flexChoice },
  });

  return NextResponse.json(await getOrCreateWeekPlan(weekStart));
}
