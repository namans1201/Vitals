"use client";

import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import { patchDay } from "@/lib/api-client";
import { SESSION_LABELS } from "@/domain/sessionTemplates";
import { IconCheck, IconChevronDown, IconFlame, IconFood, IconMinus, IconPlus, IconRest, IconRun, IconStar, IconWorkout } from "@/components/icons";
import type { DayAssignment } from "@/domain/weekPlan";
import type { DaySnapshot } from "@/lib/days";
import type { StreakResult } from "@/domain/streak";

const WATER_STEP_ML = 250;

export function TodayClient({
  date,
  snapshot,
  today,
  flexChoice,
  weekProblems,
  bedtimeTarget,
  proteinTargetG,
  proteinSoFar,
  waterTargetMl,
  streak,
}: {
  date: string;
  snapshot: DaySnapshot;
  today: DayAssignment | null;
  flexChoice: string;
  weekProblems: string[];
  bedtimeTarget: string;
  proteinTargetG: number;
  proteinSoFar: number;
  waterTargetMl: number;
  streak: StreakResult;
}) {
  const toast = useToast();
  const [checklist, setChecklist] = useState(snapshot.checklist);
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [waterMl, setWaterMl] = useState(snapshot.waterMl);

  function toggleChecklist(key: string) {
    const next = checklist.map((c) => (c.key === key ? { ...c, done: !c.done } : c));
    setChecklist(next);
    const item = next.find((c) => c.key === key)!;
    patchDay(date, { checklist: [{ key, done: item.done }] }).catch(() =>
      toast("Couldn't save - check your connection"),
    );
  }

  function adjustWater(deltaMl: number) {
    const next = Math.max(0, waterMl + deltaMl);
    setWaterMl(next);
    patchDay(date, { waterMl: next }).catch(() => toast("Couldn't save - check your connection"));
  }

  const waterPct = Math.min(100, (waterMl / waterTargetMl) * 100);
  const waterRemaining = Math.max(0, waterTargetMl - waterMl);
  const priorityItems = checklist.filter((c) => c.priority);
  const otherItems = checklist.filter((c) => !c.priority);
  const proteinPct = Math.min(100, (proteinSoFar / proteinTargetG) * 100);

  const workoutSummary =
    today === null
      ? "No plan yet"
      : today.lift
        ? SESSION_LABELS[today.lift].split(" - ")[0]
        : today.run
          ? "Morning run"
          : today.flex
            ? flexChoice === "mobility"
              ? "Mobility / core"
              : "Easy run / walk"
            : "Rest day";

  return (
    <div className="mx-auto max-w-2xl animate-in">
      {/* Today is always today - no date to browse, no planning, one tap
          into whichever half of the day you're actually about to do. */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <ShortcutCard
          href="/workout"
          Icon={IconWorkout}
          label="Workout"
          detail={workoutSummary}
        />
        <ShortcutCard
          href="/nutrition"
          Icon={IconFood}
          label="Diet"
          detail={`${Math.round(proteinSoFar)} / ${proteinTargetG} g protein`}
        />
      </div>

      {streak.current > 0 && (
        <div className="card mb-3 flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-panel-2 text-accent">
            <IconFlame size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-heading text-xl font-bold text-ink">
              <span className="tabular-nums">{streak.current}</span>
              <span className="text-sm font-normal text-faint"> day{streak.current === 1 ? "" : "s"}</span>
            </div>
            <div className="text-xs text-faint">
              Current streak
              {streak.longest > streak.current && (
                <>
                  {" "}
                  · best <span className="tabular-nums">{streak.longest}</span>
                </>
              )}
              {streak.current > 0 && streak.current === streak.longest && streak.longest > 1 && " · personal best"}
            </div>
          </div>
        </div>
      )}

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
                a run - show one unified row with the toggle, not two. */}
            {today.run && !today.flex && (
              <PlanRowRun date={date} label="Morning" initialDone={snapshot.ranDone} />
            )}
            {today.lift && (
              <PlanRow Icon={IconWorkout} tone="ink" label="Evening" value={SESSION_LABELS[today.lift]} />
            )}
            {today.flex &&
              (flexChoice === "mobility" ? (
                <PlanRow Icon={IconRest} tone="dim" label="Flexible" value="Mobility / core - your call" />
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
        <button
          onClick={() => setChecklistOpen((o) => !o)}
          className="flex w-full items-center justify-between"
        >
          <span className="micro-pill">Checklist</span>
          <span className="flex items-center gap-1 text-xs font-medium text-dim">
            {checklistOpen ? "Hide" : "Show"}
            <IconChevronDown
              size={14}
              className={`transition-transform ${checklistOpen ? "rotate-180" : ""}`}
            />
          </span>
        </button>
        {!checklistOpen && <p className="py-2 text-sm text-faint">Dropdown to see today&apos;s to-dos</p>}

        <div className={`collapse-rows ${checklistOpen ? "is-open" : ""}`}>
          <div>
            <div className="mt-1">
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
          </div>
        </div>
      </div>

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-3">Water</span>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-panel-2">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${waterPct}%` }}
          />
        </div>
        <div className="mb-3 flex items-baseline justify-between">
          <div className="font-heading text-xl font-bold text-ink">
            <span className="tabular-nums">{waterMl}</span>
            <span className="text-sm font-normal text-faint"> / {waterTargetMl} ml</span>
          </div>
          <div className="text-xs text-faint">
            {waterRemaining > 0 ? (
              <>
                <span className="tabular-nums text-caution">{waterRemaining} ml</span> left
              </>
            ) : (
              <span className="text-good">Target hit</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => adjustWater(-WATER_STEP_ML)}
            disabled={waterMl <= 0}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-panel-2 text-sm font-medium text-dim transition-colors hover:bg-line/60 disabled:opacity-40"
          >
            <IconMinus size={15} />
            {WATER_STEP_ML} ml
          </button>
          <button
            onClick={() => adjustWater(WATER_STEP_ML)}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-accent text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <IconPlus size={15} />
            {WATER_STEP_ML} ml
          </button>
        </div>
      </div>
    </div>
  );
}

function ShortcutCard({
  href,
  Icon,
  label,
  detail,
}: {
  href: string;
  Icon: (props: { size?: number; className?: string }) => React.ReactElement;
  label: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="card flex flex-col gap-2.5 p-4 transition-colors hover:bg-panel-2"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-panel-2 text-accent">
        <Icon size={18} />
      </span>
      <span className="font-heading text-sm font-bold text-ink">{label}</span>
      <span className="truncate text-xs text-dim">{detail}</span>
    </Link>
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

/** The run row on Today - no duration/distance/HR fields, the watch owns
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
    patchDay(date, { ranDone: next }).catch(() => toast("Couldn't save - check your connection"));
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
        {done ? "Run done" : "Run - easy, Zone 2"}
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
