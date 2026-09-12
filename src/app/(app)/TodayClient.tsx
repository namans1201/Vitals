"use client";

import Link from "next/link";
import { useState } from "react";
import { DateNav } from "@/components/DateNav";
import { useToast } from "@/components/Toast";
import { patchDay } from "@/lib/api-client";
import { SESSION_LABELS } from "@/domain/sessionTemplates";
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
        <div className="mb-3 rounded-lg border-l-2 border-caution bg-caution/5 px-3 py-2.5 text-xs text-dim">
          This week&apos;s picks don&apos;t make a legal schedule.{" "}
          <Link href={`/plan?date=${date}`} className="text-accent underline">
            Fix the week
          </Link>
        </div>
      )}

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Today
        </h2>
        {today === null ? (
          <p className="text-sm text-dim">No plan for this day yet.</p>
        ) : (
          <div className="space-y-1.5">
            {today.run && <PlanRow tone="accent" label="Morning" value="Run — easy, Zone 2" />}
            {today.lift && (
              <PlanRow tone="ink" label="Evening" value={SESSION_LABELS[today.lift]} />
            )}
            {today.flex && (
              <PlanRow
                tone="dim"
                label="Flexible"
                value={flexChoice === "mobility" ? "Mobility / core — your call" : "Easy run or walk — your call"}
              />
            )}
            {today.off && <PlanRow tone="dim" label="Rest" value="Strictly off. Nothing to do." />}
          </div>
        )}
        {today?.lift && (
          <Link
            href={`/workout?date=${date}`}
            className="mt-3 flex h-11 items-center justify-center rounded-lg bg-accent text-sm font-medium text-white"
          >
            Open the session
          </Link>
        )}
      </div>

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[.06em] text-faint">Protein</h2>
          <Link href="/nutrition" className="text-xs text-accent">
            Log food
          </Link>
        </div>
        <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-panel-2">
          <div
            className={`h-full rounded-full transition-[width] ${proteinPct >= 100 ? "bg-good" : "bg-caution"}`}
            style={{ width: `${proteinPct}%` }}
          />
        </div>
        <div className="text-lg font-bold text-ink">
          <span className="tabular-nums">{Math.round(proteinSoFar)}</span>
          <span className="text-sm font-normal text-faint"> / {proteinTargetG} g</span>
        </div>
      </div>

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Checklist
        </h2>
        <div className="divide-y divide-line/50">
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
          <div className="my-2 border-t border-line" />
        )}
        <div className="divide-y divide-line/50">
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

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Water
        </h2>
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-panel-2">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${Math.min(100, (waterCells / WATER_CELLS) * 100)}%` }}
          />
        </div>
        <div className="mb-2 text-sm text-dim">
          <span className="tabular-nums font-semibold text-ink">{waterCells}</span> / {WATER_CELLS} ×{" "}
          {WATER_ML_PER_CELL} ml
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: WATER_CELLS }, (_, i) => (
            <button
              key={i}
              onClick={() => setWaterCells(i + 1)}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border text-sm ${
                i < waterCells
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-line bg-panel-2 text-faint"
              }`}
            >
              {i < waterCells ? "✓" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Notes
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Energy, soreness, anything…"
          rows={2}
          className="w-full resize-y rounded-lg border border-line bg-panel-2 p-3 text-sm text-ink outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}

function PlanRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "accent" | "ink" | "dim";
}) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-16 shrink-0 text-[11px] uppercase tracking-[.06em] text-faint">{label}</span>
      <span className={tone === "accent" ? "text-accent" : tone === "ink" ? "text-ink" : "text-dim"}>
        {value}
      </span>
    </div>
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
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${
          item.done ? "border-good bg-good text-white" : "border-line bg-panel-2"
        }`}
      >
        {item.done ? "✓" : ""}
      </span>
      <span className={item.done ? "text-good" : "text-dim"}>
        {label}
        {item.priority && <span className="ml-1 text-caution">★</span>}
      </span>
    </button>
  );
}
