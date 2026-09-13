"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { addDays, differenceInCalendarDays, format, parseISO, startOfWeek } from "date-fns";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { todayIso } from "@/lib/date";

// The full month view lives on the Week tab now (see PlanClient.tsx) - this
// bar only handles nearby-day browsing, so it doesn't need its own calendar
// trigger/overlay.
export function DateNav({ date, basePath = "/" }: { date: string; basePath?: string }) {
  const router = useRouter();
  const current = parseISO(date);
  // Both `current` and `todayDate` are parsed from a "YYYY-MM-DD" string the
  // same way (parseISO -> local midnight), so day-arithmetic/comparisons
  // between them stay internally consistent regardless of what timezone the
  // browser itself is in - only todayIso()'s own computation is pinned to
  // Asia/Kolkata (matching the server's notion of "today").
  const todayIsoStr = todayIso();
  const todayDate = useMemo(() => parseISO(todayIsoStr), [todayIsoStr]);
  const offsetFromToday = differenceInCalendarDays(current, todayDate);

  function go(target: Date) {
    router.push(`${basePath}?date=${format(target, "yyyy-MM-dd")}`);
  }

  // A fixed Monday-first week, not a rolling window centred on the selected
  // day - a rolling strip re-centred itself (and visibly jumped) every time
  // the selection changed, even for an ordinary same-week tap. The arrows
  // below step a whole week at a time; only crossing into a different week
  // ever moves these 7 days.
  const weekStart = useMemo(() => startOfWeek(current, { weekStartsOn: 1 }), [current]);
  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  return (
    <div className="mb-4 flex flex-col gap-2">
      {/* Yesterday / Today / Tomorrow - only shown near the real "today", so
          it never sits there mismatched once you've browsed further away.
          Reserved as its own row (not squeezed into the strip below) so
          removing it doesn't reflow anything else in this gap-based layout. */}
      {Math.abs(offsetFromToday) <= 1 && (
        <div className="flex gap-1.5">
          <QuickTab active={offsetFromToday === -1} onClick={() => go(addDays(todayDate, -1))}>
            Yesterday
          </QuickTab>
          <QuickTab active={offsetFromToday === 0} onClick={() => go(todayDate)}>
            Today
          </QuickTab>
          <QuickTab active={offsetFromToday === 1} onClick={() => go(addDays(todayDate, 1))}>
            Tomorrow
          </QuickTab>
        </div>
      )}

      <div className="text-center">
        <span className="font-heading text-sm font-bold text-ink">{format(current, "EEEE, d MMMM yyyy")}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => go(addDays(current, -7))}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-dim transition-colors hover:bg-panel-2 hover:text-ink"
          aria-label="Previous week"
        >
          <IconChevronLeft size={16} />
        </button>

        <div className="grid flex-1 grid-cols-7 gap-1.5">
          {week.map((day) => {
            const iso = format(day, "yyyy-MM-dd");
            const selected = iso === date;
            const isToday = iso === todayIsoStr;
            return (
              <button
                key={iso}
                onClick={() => go(day)}
                className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
                  selected
                    ? "bg-accent text-white"
                    : isToday
                      ? "bg-panel-2 text-ink outline outline-1 outline-offset-[-1px] outline-accent/40"
                      : "bg-panel-2 text-ink hover:bg-line/60"
                }`}
              >
                <span className={`micro ${selected ? "text-white/70" : "text-faint"}`}>{format(day, "EEE")}</span>
                <span className="text-sm font-bold tabular-nums">{format(day, "d")}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => go(addDays(current, 7))}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-dim transition-colors hover:bg-panel-2 hover:text-ink"
          aria-label="Next week"
        >
          <IconChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function QuickTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 flex-1 rounded-full text-xs font-medium transition-colors ${
        active ? "bg-accent text-white" : "bg-panel-2 text-dim hover:bg-line/60"
      }`}
    >
      {children}
    </button>
  );
}
