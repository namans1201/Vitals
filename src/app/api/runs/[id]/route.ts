import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const runId = Number(id);
  if (!Number.isInteger(runId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await prisma.run.delete({ where: { id: runId } }).catch(() => null);
  return new NextResponse(null, { status: 204 });
}
