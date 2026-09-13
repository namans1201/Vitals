import { NextResponse } from "next/server";
import { getMonthCalendar } from "@/lib/calendar";

const MONTH_RE = /^\d{4}-\d{2}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  if (!month || !MONTH_RE.test(month)) {
    return NextResponse.json({ error: "Invalid month (expected YYYY-MM)" }, { status: 400 });
  }

  const days = await getMonthCalendar(month);
  return NextResponse.json({ days });
}
