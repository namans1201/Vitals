"use client";

import { useRouter } from "next/navigation";
import { addDays, format, parseISO } from "date-fns";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";

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
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-dim transition-colors hover:bg-panel-2 hover:text-ink"
        aria-label="Previous day"
      >
        <IconChevronLeft size={18} />
      </button>
      <div className="flex-1 text-center">
        <div className="font-heading text-sm font-bold text-ink">{format(current, "d MMM yyyy")}</div>
        <div className="micro text-faint">{format(current, "EEEE")}</div>
      </div>
      <button
        onClick={() => go(addDays(current, 1))}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-dim transition-colors hover:bg-panel-2 hover:text-ink"
        aria-label="Next day"
      >
        <IconChevronRight size={18} />
      </button>
      <button
        onClick={() => router.push(basePath)}
        className="h-11 shrink-0 rounded-full border border-line bg-panel px-4 text-sm font-medium text-dim transition-colors hover:bg-panel-2 hover:text-ink"
      >
        Today
      </button>
    </div>
  );
}
