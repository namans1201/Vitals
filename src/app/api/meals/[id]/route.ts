import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mealId = Number(id);
  if (!Number.isInteger(mealId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await prisma.meal.delete({ where: { id: mealId } }).catch(() => null);
  return new NextResponse(null, { status: 204 });
}
