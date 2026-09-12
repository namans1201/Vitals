"use client";

import { useState } from "react";
import { DateNav } from "@/components/DateNav";
import { useToast } from "@/components/Toast";
import { patchDay } from "@/lib/api-client";
import { SESSION_LABELS, type DayPlan } from "@/domain/sessionTemplates";
import type { DaySnapshot } from "@/lib/days";

type TodaySnapshot = DaySnapshot & { sleepHours: number | null; bedtimeLocal: string | null };

const WATER_CELLS = 7;
const WATER_ML_PER_CELL = 500;

export function TodayClient({
  date,
  snapshot,
  plan,
}: {
  date: string;
  snapshot: TodaySnapshot;
  plan: DayPlan;
}) {
  const toast = useToast();
  const [checklist, setChecklist] = useState(snapshot.checklist);
  const [waterMl, setWaterMl] = useState(snapshot.waterMl);
  const [notes, setNotes] = useState(snapshot.notes ?? "");
  const [restingHr, setRestingHr] = useState(snapshot.restingHr?.toString() ?? "");
  const [sleepHours, setSleepHours] = useState(snapshot.sleepHours?.toString() ?? "");
  const [bedtimeLocal, setBedtimeLocal] = useState(snapshot.bedtimeLocal ?? "");

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

  function saveRestingHr() {
    const value = restingHr.trim() === "" ? null : Number(restingHr);
    patchDay(date, { restingHr: Number.isNaN(value) ? null : value }).catch(() =>
      toast("Couldn't save — check your connection"),
    );
  }

  function saveSleep() {
    const hours = sleepHours.trim() === "" ? null : Number(sleepHours);
    const sleepMinutes = hours == null || Number.isNaN(hours) ? null : Math.round(hours * 60);
    patchDay(date, { sleepMinutes }).catch(() => toast("Couldn't save — check your connection"));
  }

  function saveBedtime() {
    patchDay(date, { bedtimeLocal: bedtimeLocal.trim() === "" ? null : bedtimeLocal }).catch(() =>
      toast("Couldn't save — check your connection"),
    );
  }

  const waterCells = Math.round(waterMl / WATER_ML_PER_CELL);
  const priorityItems = checklist.filter((c) => c.priority);
  const otherItems = checklist.filter((c) => !c.priority);

  return (
    <div className="mx-auto max-w-lg">
      <DateNav date={date} basePath="/" />

      <Card title="Today's plan">
        {plan.activeSessionType ? (
          <div className="text-sm text-ink">{SESSION_LABELS[plan.activeSessionType]}</div>
        ) : (
          <div className="text-sm text-dim">No lifting session planned — run or rest, your call.</div>
        )}
        {plan.referenceSessionType && plan.referenceSessionType !== plan.activeSessionType && (
          <div className="mt-1 text-xs text-faint">
            Four-day split reference: {SESSION_LABELS[plan.referenceSessionType]}
          </div>
        )}
        {plan.isMeasurementDay && (
          <div className="mt-2 rounded-lg border-l-2 border-accent bg-accent/10 px-3 py-2 text-xs text-dim">
            Weekly measurements — weight, waist, BIA. See the Body tab.
          </div>
        )}
      </Card>

      <Card title="Checklist">
        <div className="divide-y divide-line/50">
          {priorityItems.map((item) => (
            <ChecklistRow key={item.key} item={item} onToggle={toggleChecklist} />
          ))}
        </div>
        {priorityItems.length > 0 && otherItems.length > 0 && <div className="my-2 border-t border-line" />}
        <div className="divide-y divide-line/50">
          {otherItems.map((item) => (
            <ChecklistRow key={item.key} item={item} onToggle={toggleChecklist} />
          ))}
        </div>
      </Card>

      <Card title="Water">
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
      </Card>

      <Card title="From the watch (manual for now)">
        <div className="flex flex-wrap gap-3">
          <Field label="Resting HR (bpm)">
            <input
              type="number"
              value={restingHr}
              onChange={(e) => setRestingHr(e.target.value)}
              onBlur={saveRestingHr}
              className="h-11 w-full rounded-lg border border-line bg-panel-2 px-3 text-ink outline-none focus:border-accent"
            />
          </Field>
          <Field label="Sleep (hours)">
            <input
              type="number"
              step="0.1"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              onBlur={saveSleep}
              className="h-11 w-full rounded-lg border border-line bg-panel-2 px-3 text-ink outline-none focus:border-accent"
            />
          </Field>
          <Field label="Bedtime">
            <input
              type="time"
              value={bedtimeLocal}
              onChange={(e) => setBedtimeLocal(e.target.value)}
              onBlur={saveBedtime}
              className="h-11 w-full rounded-lg border border-line bg-panel-2 px-3 text-ink outline-none focus:border-accent"
            />
          </Field>
        </div>
      </Card>

      <Card title="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Energy, soreness, sleep quality, mood, anything…"
          rows={3}
          className="w-full resize-y rounded-lg border border-line bg-panel-2 p-3 text-sm text-ink outline-none focus:border-accent"
        />
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="min-w-[95px] flex-1">
      <span className="mb-1 block text-[11px] uppercase tracking-[.06em] text-faint">{label}</span>
      {children}
    </label>
  );
}

function ChecklistRow({
  item,
  onToggle,
}: {
  item: { key: string; label: string; priority: boolean; done: boolean };
  onToggle: (key: string) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 py-2.5 text-sm ${
        item.done ? "text-faint line-through" : "text-dim"
      }`}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item.key)}
        className="h-[18px] w-[18px] shrink-0 accent-good"
      />
      <span>
        {item.label}
        {item.priority && <span className="ml-1 text-caution">★</span>}
      </span>
    </label>
  );
}
