import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { profileTargetsPatchSchema } from "@/lib/validation";

/** Editable macro/calorie targets - everything else on Profile (name, DOB,
 * timezone, …) has no UI yet and isn't exposed here. */
export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = profileTargetsPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  await prisma.profile.update({ where: { id: 1 }, data: parsed.data });
  return NextResponse.json({ ok: true });
}
