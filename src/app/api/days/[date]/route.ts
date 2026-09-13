import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDaySnapshot } from "@/lib/days";
import { bedtimeToUtc, parseDateParam } from "@/lib/date";
import { dailyLogPatchSchema, dateParamSchema } from "@/lib/validation";

export async function GET(_request: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date: dateStr } = await params;
  if (!dateParamSchema.safeParse(dateStr).success) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  let date: Date;
  try {
    date = parseDateParam(dateStr);
  } catch {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  return NextResponse.json(await getDaySnapshot(date));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date: dateStr } = await params;
  if (!dateParamSchema.safeParse(dateStr).success) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  let date: Date;
  try {
    date = parseDateParam(dateStr);
  } catch {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = dailyLogPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { checklist, supplements, bedtimeLocal, ...scalarFields } = parsed.data;

  const sleepStartUpdate =
    bedtimeLocal === undefined
      ? {}
      : { sleepStart: bedtimeLocal === null ? null : bedtimeToUtc(dateStr, bedtimeLocal) };

  await prisma.dailyLog.upsert({
    where: { date },
    create: { date, ...scalarFields, ...sleepStartUpdate },
    update: { ...scalarFields, ...sleepStartUpdate },
  });

  if (checklist && checklist.length > 0) {
    await prisma.$transaction(
      checklist.map((item) =>
        prisma.checklistLog.upsert({
          where: { date_itemKey: { date, itemKey: item.key } },
          create: { date, itemKey: item.key, done: item.done },
          update: { done: item.done },
        }),
      ),
    );
  }

  if (supplements && supplements.length > 0) {
    await prisma.$transaction(
      supplements.map((s) =>
        prisma.supplementLog.upsert({
          where: { date_supplementId: { date, supplementId: s.supplementId } },
          create: { date, supplementId: s.supplementId, taken: s.taken },
          update: { taken: s.taken },
        }),
      ),
    );
  }

  // The client already applies this write optimistically and never reads
  // the body (see patchDay() in lib/api-client.ts) - rebuilding the full
  // 5-query snapshot here just to throw it away made every checklist/water
  // tap pay for it, so this is intentionally the bare confirmation.
  return NextResponse.json({ ok: true });
}
