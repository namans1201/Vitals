"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useToast } from "@/components/Toast";
import { patchDay } from "@/lib/api-client";
import { CHART_COLORS } from "@/lib/chartColors";
import { MIN_RECOMPOSITION_POINTS, type RecompositionSignal } from "@/domain/trends";
import type { DailyLog } from "@/generated/prisma/client";

type HistoryRow = Pick<
  DailyLog,
  | "date"
  | "weightKg"
  | "waistCm"
  | "bodyFatPct"
  | "skeletalMuscleKg"
  | "armCm"
  | "chestCm"
  | "thighCm"
  | "maxPullups"
  | "maxPushups"
>;

const SIGNAL_COPY: Record<RecompositionSignal, { label: string; tone: "good" | "bad" | "caution" | "dim" }> = {
  recomposing: {
    label: "Recomposing — body fat down, muscle up, weight roughly flat. Exactly the goal.",
    tone: "good",
  },
  gaining_fat: { label: "Body fat is trending up.", tone: "bad" },
  losing_muscle: { label: "Muscle is trending down.", tone: "bad" },
  losing_fat: { label: "Body fat is trending down, but muscle isn't rising with it yet.", tone: "caution" },
  insufficient_data: {
    label: `Not enough data yet — need at least ${MIN_RECOMPOSITION_POINTS} weekly readings before a trend means anything.`,
    tone: "dim",
  },
};

const FIELDS = [
  { key: "weightKg", label: "Weight kg" },
  { key: "waistCm", label: "Waist cm ★" },
  { key: "bodyFatPct", label: "Body fat % ★" },
  { key: "skeletalMuscleKg", label: "Skeletal muscle kg ★" },
  { key: "armCm", label: "Arm flexed cm" },
  { key: "chestCm", label: "Chest cm" },
  { key: "thighCm", label: "Thigh cm" },
  { key: "maxPullups", label: "Max pull-ups" },
  { key: "maxPushups", label: "Max push-ups" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

export function BodyClient({
  date,
  today,
  history,
  signal,
}: {
  date: string;
  today: DailyLog | null;
  history: HistoryRow[];
  signal: RecompositionSignal;
}) {
  const toast = useToast();
  const [values, setValues] = useState<Record<FieldKey, string>>({
    weightKg: today?.weightKg?.toString() ?? "",
    waistCm: today?.waistCm?.toString() ?? "",
    bodyFatPct: today?.bodyFatPct?.toString() ?? "",
    skeletalMuscleKg: today?.skeletalMuscleKg?.toString() ?? "",
    armCm: today?.armCm?.toString() ?? "",
    chestCm: today?.chestCm?.toString() ?? "",
    thighCm: today?.thighCm?.toString() ?? "",
    maxPullups: today?.maxPullups?.toString() ?? "",
    maxPushups: today?.maxPushups?.toString() ?? "",
  });

  function save(key: FieldKey) {
    const raw = values[key];
    const value = raw.trim() === "" ? null : Number(raw);
    patchDay(date, { [key]: value }).catch(() => toast("Couldn't save — check your connection"));
  }

  const chartData = history.map((r) => ({
    date: r.date.toString().slice(5, 10),
    weight: r.weightKg,
    bodyFat: r.bodyFatPct,
    muscle: r.skeletalMuscleKg,
  }));

  const signalCopy = SIGNAL_COPY[signal];

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Weekly measurements
        </h2>
        <p className="mb-3 text-xs text-faint">
          Same conditions every week: after waking, after the toilet, before eating or drinking.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {FIELDS.map((f) => (
            <label key={f.key}>
              <span className="mb-1 block text-[11px] uppercase tracking-[.06em] text-faint">{f.label}</span>
              <input
                type="number"
                step={f.key === "maxPullups" || f.key === "maxPushups" ? 1 : 0.1}
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                onBlur={() => save(f.key)}
                className="h-11 w-full rounded-lg border border-line bg-panel-2 px-3 text-ink outline-none focus:border-accent"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3 rounded-lg border-l-2 border-accent bg-accent/5 px-3 py-2.5 text-xs text-dim">
        <b className="text-accent">BIA protocol:</b> Sunday morning, after waking, after the toilet, before
        eating or drinking. Arms up, elbows ~90°, upper arms not touching your torso. Take 3 readings, log
        the middle one. <b className="text-accent">Trend over ≥4 weeks, never a single reading.</b>
      </div>

      <div
        className={`mb-3 rounded-xl border border-line bg-panel p-4 text-sm ${
          signalCopy.tone === "good"
            ? "text-good"
            : signalCopy.tone === "bad"
              ? "text-bad"
              : signalCopy.tone === "caution"
                ? "text-caution"
                : "text-faint"
        }`}
      >
        {signalCopy.label}
      </div>

      {chartData.length > 1 && (
        <div className="mb-3 rounded-xl border border-line bg-panel p-4">
          <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
            Recomposition — weight, body fat %, muscle
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke={CHART_COLORS.line} strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke={CHART_COLORS.faint} fontSize={11} />
                <YAxis yAxisId="kg" stroke={CHART_COLORS.faint} fontSize={11} width={32} />
                <YAxis
                  yAxisId="pct"
                  orientation="right"
                  stroke={CHART_COLORS.faint}
                  fontSize={11}
                  width={32}
                />
                <Tooltip contentStyle={{ background: "#171a21", border: `1px solid ${CHART_COLORS.line}` }} />
                <Line
                  yAxisId="kg"
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke={CHART_COLORS.accent}
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                />
                <Line
                  yAxisId="kg"
                  type="monotone"
                  dataKey="muscle"
                  name="Muscle (kg)"
                  stroke={CHART_COLORS.good}
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                />
                <Line
                  yAxisId="pct"
                  type="monotone"
                  dataKey="bodyFat"
                  name="Body fat (%)"
                  stroke={CHART_COLORS.caution}
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex gap-3 text-xs">
            <span style={{ color: CHART_COLORS.accent }}>● Weight</span>
            <span style={{ color: CHART_COLORS.good }}>● Muscle</span>
            <span style={{ color: CHART_COLORS.caution }}>● Body fat</span>
          </div>
        </div>
      )}

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Measurement history
        </h2>
        {history.length === 0 ? (
          <p className="py-4 text-center text-sm text-faint">No measurements yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-faint">
                  <th className="py-1.5 text-left font-medium">Date</th>
                  <th className="py-1.5 text-right font-medium">Wt</th>
                  <th className="py-1.5 text-right font-medium">Waist</th>
                  <th className="py-1.5 text-right font-medium">BF%</th>
                  <th className="py-1.5 text-right font-medium">Muscle</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((r) => (
                  <tr key={r.date.toString()} className="border-t border-line/50 text-dim">
                    <td className="py-1.5 tabular-nums text-ink">{r.date.toString().slice(0, 10)}</td>
                    <td className="py-1.5 text-right tabular-nums">{r.weightKg ?? "—"}</td>
                    <td className="py-1.5 text-right tabular-nums">{r.waistCm ?? "—"}</td>
                    <td className="py-1.5 text-right tabular-nums">{r.bodyFatPct ?? "—"}</td>
                    <td className="py-1.5 text-right tabular-nums">{r.skeletalMuscleKg ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
