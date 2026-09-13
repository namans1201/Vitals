"use client";

import { useEffect, useState } from "react";
import { addMonths, format, parseISO, startOfMonth } from "date-fns";
import { todayIso } from "@/lib/date";
import { IconChevronLeft, IconChevronRight, IconClose, IconRest, IconRun, IconWorkout } from "@/components/icons";
import { calendarDayStatus, type CalendarDay } from "@/domain/calendarStatus";

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarOverlay({
  open,
  onClose,
  selectedDate,
  onSelectDate,
}: {
  open: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(parseISO(selectedDate)));
  const [days, setDays] = useState<CalendarDay[] | null>(null);

  useEffect(() => {
    if (open) setViewMonth(startOfMonth(parseISO(selectedDate)));
  }, [open, selectedDate]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setDays(null);
    fetch(`/api/calendar?month=${format(viewMonth, "yyyy-MM")}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setDays(data.days);
      })
      .catch(() => {
        if (!cancelled) setDays([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, viewMonth]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const todayIsoStr = todayIso();

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 px-4 overlay-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="card modal-in max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Calendar"
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-dim hover:bg-panel-2 hover:text-ink"
            aria-label="Previous month"
          >
            <IconChevronLeft size={20} />
          </button>
          <span className="font-heading text-lg font-bold text-ink">{format(viewMonth, "MMMM yyyy")}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-dim hover:bg-panel-2 hover:text-ink"
              aria-label="Next month"
            >
              <IconChevronRight size={20} />
            </button>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-dim hover:bg-panel-2 hover:text-ink"
              aria-label="Close calendar"
            >
              <IconClose size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {WEEKDAY_HEADERS.map((w) => (
            <div key={w} className="micro py-1 text-faint">
              {w}
            </div>
          ))}

          {days === null
            ? Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-lg bg-panel-2" />
              ))
            : days.map((day) => (
                <DayCell
                  key={day.date}
                  day={day}
                  todayIsoStr={todayIsoStr}
                  isToday={day.date === todayIsoStr}
                  isSelected={day.date === selectedDate}
                  onSelect={() => {
                    onSelectDate(day.date);
                    onClose();
                  }}
                />
              ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs text-faint">
          <LegendDot className="bg-good" label="Done" />
          <LegendDot className="bg-caution" label="Missed" />
          <LegendDot className="border border-line bg-panel" label="Upcoming" />
          <span className="flex items-center gap-1">
            <IconRun size={13} className="text-dim" /> Run
          </span>
          <span className="flex items-center gap-1">
            <IconWorkout size={13} className="text-dim" /> Workout
          </span>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 shrink-0 rounded-full ${className}`} />
      {label}
    </span>
  );
}

function DayCell({
  day,
  todayIsoStr,
  isToday,
  isSelected,
  onSelect,
}: {
  day: CalendarDay;
  todayIsoStr: string;
  isToday: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const status = calendarDayStatus(day, todayIsoStr);
  const dayNumber = Number(day.date.slice(8, 10));

  const badgeClasses =
    status === "done"
      ? "bg-good text-white"
      : status === "missed"
        ? "bg-caution text-white"
        : status === "upcoming"
          ? "border border-line bg-panel text-ink"
          : "text-faint";

  return (
    <button
      onClick={onSelect}
      className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl transition-colors hover:bg-panel-2 ${
        day.inMonth ? "" : "opacity-30"
      } ${isSelected ? "ring-2 ring-accent ring-offset-1 ring-offset-panel" : ""}`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium tabular-nums ${badgeClasses} ${
          isToday ? "outline outline-2 outline-offset-1 outline-accent" : ""
        }`}
      >
        {dayNumber}
      </span>
      <span className="flex h-4 items-center gap-1 text-dim">
        {day.run && <IconRun size={13} />}
        {day.lift && <IconWorkout size={13} />}
        {day.off && !day.run && !day.lift && <IconRest size={12} className="text-faint" />}
      </span>
    </button>
  );
}
