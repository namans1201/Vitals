"use client";

import Link from "next/link";
import { useState } from "react";
import { DateNav } from "@/components/DateNav";
import { useToast } from "@/components/Toast";
import { patchDay } from "@/lib/api-client";
import { SESSION_LABELS } from "@/domain/sessionTemplates";
import { IconCheck, IconFood, IconRest, IconRun, IconStar, IconWorkout } from "@/components/icons";
import type { DayAssignment } from "@/domain/weekPlan";
import type { DaySnapshot } from "@/lib/days";

const WATER_CELLS = 7;
const WATER_ML_PER_CELL = 500;

export function TodayClient({
  date,
  snapshot,
  today,
  flexChoice,
  weekProblems,
  bedtimeTarget,
  proteinTargetG,
  proteinSoFar,
}: {
  date: string;
  snapshot: DaySnapshot;
  today: DayAssignment | null;
  flexChoice: string;
  weekProblems: string[];
  bedtimeTarget: string;
  proteinTargetG: number;
  proteinSoFar: number;
}) {
  const toast = useToast();
  const [checklist, setChecklist] = useState(snapshot.checklist);
  const [waterMl, setWaterMl] = useState(snapshot.waterMl);
  const [notes, setNotes] = useState(snapshot.notes ?? "");

  function toggleChecklist(key: string) {
    const next = checklist.map((c) => (c.key === key ? { ...c, done: !c.done } : c));
    setChecklist(next);
    const item = next.find((c) => c.key === key)!;
    patchDay(date, { checklist: [{ key, done: item.done }] }).catch(() =>
      toast("Couldn't save — check your connection"),
    );
  }

  function setWaterCells(n: number) {
    const currentCells = waterMl / WATER_ML_PER_CELL;
    const nextCells = currentCells === n ? n - 1 : n;
    const nextMl = Math.max(0, nextCells) * WATER_ML_PER_CELL;
    setWaterMl(nextMl);
    patchDay(date, { waterMl: nextMl }).catch(() => toast("Couldn't save — check your connection"));
  }

  function saveNotes() {
    patchDay(date, { notes: notes.trim() === "" ? null : notes })
      .then(() => toast("Saved"))
      .catch(() => toast("Couldn't save — check your connection"));
  }

  const waterCells = Math.round(waterMl / WATER_ML_PER_CELL);
  const priorityItems = checklist.filter((c) => c.priority);
  const otherItems = checklist.filter((c) => !c.priority);
  const proteinPct = Math.min(100, (proteinSoFar / proteinTargetG) * 100);

  return (
    <div className="mx-auto max-w-lg">
      <DateNav date={date} basePath="/" />

      {weekProblems.length > 0 && (
        <div className="mb-3 rounded-xl border-l-2 border-caution bg-caution/5 px-3 py-2.5 text-xs text-dim">
          This week&apos;s picks don&apos;t make a legal schedule.{" "}
          <Link href={`/plan?date=${date}`} className="font-medium text-ink underline">
            Fix the week
          </Link>
        </div>
      )}

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-3">Today</span>
        {today === null ? (
          <p className="text-sm text-dim">No plan for this day yet.</p>
        ) : (
          <div className="space-y-2">
            {/* A run and the flex day are the same slot when flex is chosen as
                a run — show one unified row with the toggle, not two. */}
            {today.run && !today.flex && (
              <PlanRowRun date={date} label="Morning" initialDone={snapshot.ranDone} />
            )}
            {today.lift && (
              <PlanRow Icon={IconWorkout} tone="ink" label="Evening" value={SESSION_LABELS[today.lift]} />
            )}
            {today.flex &&
              (flexChoice === "mobility" ? (
                <PlanRow Icon={IconRest} tone="dim" label="Flexible" value="Mobility / core — your call" />
              ) : (
                <PlanRowRun date={date} label="Flexible" initialDone={snapshot.ranDone} />
              ))}
            {today.off && <PlanRow Icon={IconRest} tone="dim" label="Rest" value="Strictly off." />}
          </div>
        )}
        {today?.lift && (
          <Link
            href={`/workout?date=${date}`}
            className="mt-4 flex h-11 items-center justify-center rounded-full bg-accent text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Open the session
          </Link>
        )}
      </div>

      <div className="card mb-3 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="micro-pill">Protein</span>
          <Link
            href="/nutrition"
            className="flex items-center gap-1.5 text-xs font-medium text-ink hover:text-dim"
          >
            <IconFood size={14} />
            Log food
          </Link>
        </div>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-panel-2">
          <div
            className={`h-full rounded-full transition-[width] ${proteinPct >= 100 ? "bg-good" : "bg-caution"}`}
            style={{ width: `${proteinPct}%` }}
          />
        </div>
        <div className="font-heading text-xl font-bold text-ink">
          <span className="tabular-nums">{Math.round(proteinSoFar)}</span>
          <span className="text-sm font-normal text-faint"> / {proteinTargetG} g</span>
        </div>
      </div>

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-1">Checklist</span>
        <div className="divide-y divide-line/60">
          {priorityItems.map((item) => (
            <ChecklistRow
              key={item.key}
              item={item}
              bedtimeTarget={bedtimeTarget}
              onToggle={toggleChecklist}
            />
          ))}
        </div>
        {priorityItems.length > 0 && otherItems.length > 0 && (
          <div className="my-1 border-t border-line" />
        )}
        <div className="divide-y divide-line/60">
          {otherItems.map((item) => (
            <ChecklistRow
              key={item.key}
              item={item}
              bedtimeTarget={bedtimeTarget}
              onToggle={toggleChecklist}
            />
          ))}
        </div>
      </div>

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-3">Water</span>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-panel-2">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${Math.min(100, (waterCells / WATER_CELLS) * 100)}%` }}
          />
        </div>
        <div className="mb-3 text-sm text-dim">
          <span className="tabular-nums font-semibold text-ink">{waterCells}</span> / {WATER_CELLS} ×{" "}
          {WATER_ML_PER_CELL} ml
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: WATER_CELLS }, (_, i) => (
            <button
              key={i}
              onClick={() => setWaterCells(i + 1)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                i < waterCells
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-panel-2 text-transparent"
              }`}
            >
              <IconCheck size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-3">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Energy, soreness, anything…"
          rows={2}
          className="w-full resize-y rounded-xl border border-line bg-panel-2 p-3 text-sm text-ink outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}

function PlanRow({
  label,
  value,
  tone,
  Icon,
}: {
  label: string;
  value: string;
  tone: "accent" | "ink" | "dim";
  Icon: (props: { size?: number; className?: string }) => React.ReactElement;
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-panel-2 ${
          tone === "accent" ? "text-accent" : tone === "ink" ? "text-ink" : "text-faint"
        }`}
      >
        <Icon size={16} />
      </span>
      <span className="w-16 shrink-0 micro text-faint">{label}</span>
      <span className={tone === "accent" ? "text-accent" : tone === "ink" ? "font-medium text-ink" : "text-dim"}>
        {value}
      </span>
    </div>
  );
}

/** The run row on Today — no duration/distance/HR fields, the watch owns
 * those once the importer exists. This is only "did it happen", exactly
 * like ticking a workout set. */
function PlanRowRun({
  date,
  label,
  initialDone,
}: {
  date: string;
  label: string;
  initialDone: boolean;
}) {
  const toast = useToast();
  const [done, setDone] = useState(initialDone);

  function toggle() {
    const next = !done;
    setDone(next);
    patchDay(date, { ranDone: next }).catch(() => toast("Couldn't save — check your connection"));
  }

  return (
    <button onClick={toggle} className="flex w-full items-center gap-2.5 text-left text-sm">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
          done ? "bg-good text-white" : "bg-panel-2 text-accent"
        }`}
      >
        <IconRun size={16} />
      </span>
      <span className="w-16 shrink-0 micro text-faint">{label}</span>
      <span className={`flex-1 ${done ? "font-medium text-good" : "text-accent"}`}>
        {done ? "Run done" : "Run — easy, Zone 2"}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
          done ? "border-good bg-good text-white" : "border-line bg-panel-2 text-transparent"
        }`}
      >
        <IconCheck size={13} />
      </span>
    </button>
  );
}

function ChecklistRow({
  item,
  bedtimeTarget,
  onToggle,
}: {
  item: { key: string; label: string; priority: boolean; done: boolean };
  bedtimeTarget: string;
  onToggle: (key: string) => void;
}) {
  const label = item.key === "bed" ? `In bed by ${bedtimeTarget}` : item.label;
  return (
    <button
      onClick={() => onToggle(item.key)}
      className="flex w-full items-center gap-2.5 py-2.5 text-left text-sm"
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
          item.done ? "border-good bg-good text-white" : "border-line bg-panel-2 text-transparent"
        }`}
      >
        <IconCheck size={13} />
      </span>
      <span className={`flex items-center gap-1.5 ${item.done ? "text-good" : "text-dim"}`}>
        {label}
        {item.priority && <IconStar size={11} className="text-caution" />}
      </span>
    </button>
  );
}
