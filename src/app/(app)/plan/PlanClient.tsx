"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { saveWeekPlan } from "@/lib/api-client";
import { SESSION_LABELS } from "@/domain/sessionTemplates";
import {
  buildWeekSchedule,
  suggestWeekOptions,
  WEEKDAY_NAMES,
  WEEKDAYS,
  type Weekday,
} from "@/domain/weekPlan";

type DayMode = "run" | "off" | "auto";

export function PlanClient({
  date,
  weekStartIso,
  runDays,
  offDays,
  flexChoice,
}: {
  date: string;
  weekStartIso: string;
  runDays: Weekday[];
  offDays: Weekday[];
  flexChoice: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [runs, setRuns] = useState<Weekday[]>(runDays);
  const [offs, setOffs] = useState<Weekday[]>(offDays);
  const [flex, setFlex] = useState<"run" | "mobility">(
    flexChoice === "mobility" ? "mobility" : "run",
  );
  const [busy, setBusy] = useState(false);

  const result = useMemo(() => buildWeekSchedule({ runDays: runs, offDays: offs }), [runs, offs]);
  const suggestions = useMemo(() => suggestWeekOptions(3), []);

  function modeOf(day: Weekday): DayMode {
    if (runs.includes(day)) return "run";
    if (offs.includes(day)) return "off";
    return "auto";
  }

  function setMode(day: Weekday, mode: DayMode) {
    setRuns((prev) => (mode === "run" ? [...prev, day].sort() : prev.filter((d) => d !== day)));
    setOffs((prev) => (mode === "off" ? [...prev, day].sort() : prev.filter((d) => d !== day)));
  }

  async function save() {
    if (!result.ok) return;
    setBusy(true);
    try {
      await saveWeekPlan({ date, runDays: runs, offDays: offs, flexChoice: flex });
      toast("Week saved");
      router.refresh();
    } catch {
      toast("Couldn't save the week");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="card mb-3 p-4">
        <span className="micro-pill mb-2">Week of {weekStartIso}</span>
        <p className="text-xs text-dim">
          Pick your <b className="text-ink">3 run days</b> and{" "}
          <b className="text-ink">2 off days</b>. The four lifting sessions get placed for you —
          never a run on legs, never a run the day after legs.
        </p>
      </div>

      <div className="card mb-3 p-4">
        <div className="space-y-1.5">
          {WEEKDAYS.map((day) => {
            const mode = modeOf(day);
            const assigned = result.ok
              ? result.schedule.days.find((d) => d.weekday === day)
              : undefined;
            return (
              <div key={day} className="flex items-center gap-2">
                <div className="w-11 shrink-0 text-xs font-medium text-ink">
                  {WEEKDAY_NAMES[day].slice(0, 3)}
                </div>
                <div className="flex shrink-0 gap-1">
                  <ModeButton active={mode === "run"} onClick={() => setMode(day, mode === "run" ? "auto" : "run")}>
                    Run
                  </ModeButton>
                  <ModeButton active={mode === "off"} onClick={() => setMode(day, mode === "off" ? "auto" : "off")}>
                    Off
                  </ModeButton>
                </div>
                <div className="min-w-0 flex-1 truncate text-right text-xs text-dim">
                  {assigned?.lift
                    ? SESSION_LABELS[assigned.lift].split(" — ")[0]
                    : assigned?.flex
                      ? flex === "run"
                        ? "Flexible — easy run/walk"
                        : "Flexible — mobility/core"
                      : assigned?.off
                        ? "Rest"
                        : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-3">Flexible day</span>
        <div className="flex gap-2">
          <ModeButton active={flex === "run"} onClick={() => setFlex("run")}>
            Easy run / walk
          </ModeButton>
          <ModeButton active={flex === "mobility"} onClick={() => setFlex("mobility")}>
            Mobility / core
          </ModeButton>
        </div>
      </div>

      {!result.ok && (
        <div className="mb-3 rounded-xl border-l-2 border-bad bg-bad/5 px-3 py-2.5 text-xs text-dim">
          <b className="text-bad">That week doesn&apos;t work yet.</b>
          <ul className="mt-1 list-disc pl-4">
            {result.problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={save}
        disabled={!result.ok || busy}
        className="mb-3 h-11 w-full rounded-full bg-accent text-sm font-medium text-white disabled:opacity-40"
      >
        Save this week
      </button>

      <div className="card mb-3 p-4">
        <span className="micro-pill mb-3">Or use one of these</span>
        <div className="space-y-2">
          {suggestions.map((option, i) => (
            <button
              key={i}
              onClick={() => {
                setRuns(option.runDays);
                setOffs(option.offDays);
              }}
              className="w-full rounded-xl border border-line bg-panel-2 p-2.5 text-left transition-colors hover:bg-line/60"
            >
              <div className="text-xs text-dim">
                {option.schedule.days
                  .map((d) => {
                    const label = d.lift
                      ? SESSION_LABELS[d.lift].split(" — ")[0].replace("Upper ", "U").replace("Lower ", "L")
                      : d.off
                        ? "rest"
                        : "flex";
                    return `${WEEKDAY_NAMES[d.weekday].slice(0, 3)} ${label}${d.run ? "+run" : ""}`;
                  })
                  .join(" · ")}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModeButton({
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
      className={`h-11 rounded-full border px-3 text-xs font-medium transition-colors ${
        active ? "border-accent bg-accent text-white" : "border-line bg-panel-2 text-dim hover:bg-line/60"
      }`}
    >
      {children}
    </button>
  );
}
