"use client";

import { useRouter } from "next/navigation";
import { addDays, format, parseISO } from "date-fns";

export function DateNav({ date, basePath = "/" }: { date: string; basePath?: string }) {
  const router = useRouter();
  const current = parseISO(date);

  function go(target: Date) {
    router.push(`${basePath}?date=${format(target, "yyyy-MM-dd")}`);
  }

  return (
    <div className="mb-4 flex items-center gap-2">
      <button
        onClick={() => go(addDays(current, -1))}
        className="h-11 w-11 shrink-0 rounded-lg border border-line bg-panel-2 text-ink"
        aria-label="Previous day"
      >
        ←
      </button>
      <div className="flex-1 text-center">
        <div className="text-sm font-semibold text-ink">{format(current, "d MMM yyyy")}</div>
        <div className="text-[11px] uppercase tracking-[.06em] text-faint">{format(current, "EEEE")}</div>
      </div>
      <button
        onClick={() => go(addDays(current, 1))}
        className="h-11 w-11 shrink-0 rounded-lg border border-line bg-panel-2 text-ink"
        aria-label="Next day"
      >
        →
      </button>
      <button
        onClick={() => router.push(basePath)}
        className="h-11 shrink-0 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink"
      >
        Today
      </button>
    </div>
  );
}
