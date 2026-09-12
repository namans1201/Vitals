"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { createRun, deleteRun } from "@/lib/api-client";
import { zoneDistribution, zoneFor, type Zone } from "@/domain/zones";
import { CHART_COLORS } from "@/lib/chartColors";
import type { Run } from "@/generated/prisma/client";

const RUN_TYPES = [
  { value: "easy", label: "Easy / Zone 2" },
  { value: "intervals", label: "Intervals" },
  { value: "long", label: "Long run" },
  { value: "walk_run", label: "Walk-run" },
  { value: "walk", label: "Walk" },
  { value: "skipping", label: "Skipping" },
] as const;

const ZONE_LABELS: Record<Zone, string> = { z1: "Z1", z2: "Z2", z3: "Z3", z4: "Z4", z5: "Z5" };
const ZONE_COLORS: Record<Zone, string> = {
  z1: CHART_COLORS.faint,
  z2: CHART_COLORS.good,
  z3: CHART_COLORS.caution,
  z4: CHART_COLORS.bad,
  z5: "#b23a2e",
};

function paceMinPerKm(durationSec: number, distanceM: number | null): number | null {
  if (!distanceM || distanceM <= 0) return null;
  return durationSec / 60 / (distanceM / 1000);
}

function formatPace(pace: number | null): string {
  if (pace == null) return "—";
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function RunsClient({
  date,
  age,
  runs,
  restingHrSeries,
}: {
  date: string;
  age: number;
  runs: Run[];
  restingHrSeries: { date: Date; restingHr: number | null }[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [type, setType] = useState<string>("easy");
  const [durationMin, setDurationMin] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [avgHr, setAvgHr] = useState("");
  const [maxHr, setMaxHr] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const liveDurationSec = Number(durationMin) * 60;
  const liveDistanceM = Number(distanceKm) * 1000;
  const livePace = paceMinPerKm(liveDurationSec, liveDistanceM || null);
  const liveZone = avgHr ? zoneFor(Number(avgHr), age) : null;

  async function submit() {
    if (!durationMin) {
      toast("Duration is required");
      return;
    }
    setBusy(true);
    try {
      await createRun({
        date,
        type,
        durationSec: Math.round(Number(durationMin) * 60),
        distanceM: distanceKm ? Math.round(Number(distanceKm) * 1000) : null,
        avgHr: avgHr ? Number(avgHr) : null,
        maxHr: maxHr ? Number(maxHr) : null,
        notes: notes || null,
      });
      setDurationMin("");
      setDistanceKm("");
      setAvgHr("");
      setMaxHr("");
      setNotes("");
      toast("Logged");
      router.refresh();
    } catch {
      toast("Couldn't save that run");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    try {
      await deleteRun(id);
      router.refresh();
    } catch {
      toast("Couldn't delete that run");
    }
  }

  const paceChartData = useMemo(
    () =>
      [...runs]
        .reverse()
        .map((r) => ({
          date: r.date.toString().slice(5, 10),
          pace: paceMinPerKm(r.durationSec, r.distanceM),
        }))
        .filter((d) => d.pace != null),
    [runs],
  );

  const hrChartData = useMemo(
    () =>
      restingHrSeries.map((d) => ({ date: d.date.toString().slice(5, 10), hr: d.restingHr })),
    [restingHrSeries],
  );

  const distribution = useMemo(
    () =>
      zoneDistribution(
        runs.filter((r) => r.avgHr != null).map((r) => ({ avgHr: r.avgHr as number, durationSec: r.durationSec })),
        age,
      ),
    [runs, age],
  );
  const totalDistSec = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">Log a run</h2>
        <div className="mb-2 flex flex-wrap gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-11 flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          >
            {RUN_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          <input
            type="number"
            placeholder="Minutes"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            className="h-11 min-w-[90px] flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Distance km"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            className="h-11 min-w-[90px] flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          />
          <input
            type="number"
            placeholder="Avg HR"
            value={avgHr}
            onChange={(e) => setAvgHr(e.target.value)}
            className="h-11 min-w-[90px] flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          />
          <input
            type="number"
            placeholder="Max HR"
            value={maxHr}
            onChange={(e) => setMaxHr(e.target.value)}
            className="h-11 min-w-[90px] flex-1 rounded-lg border border-line bg-panel-2 px-3 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        <div className="mb-2 grid grid-cols-4 gap-1.5">
          <Kpi label="Minutes" value={durationMin || "—"} />
          <Kpi label="Km" value={distanceKm || "—"} />
          <Kpi label="Pace /km" value={formatPace(livePace)} />
          <Kpi
            label="Zone"
            value={liveZone ? ZONE_LABELS[liveZone] : "—"}
            accent={liveZone === "z2" ? CHART_COLORS.good : undefined}
          />
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel? Breathing, legs, pace…"
          rows={2}
          className="mb-2 w-full resize-y rounded-lg border border-line bg-panel-2 p-3 text-sm text-ink outline-none focus:border-accent"
        />
        <button
          onClick={submit}
          disabled={busy}
          className="h-11 w-full rounded-lg bg-accent text-sm font-medium text-white disabled:opacity-50"
        >
          Log run
        </button>
      </div>

      <div className="mb-3 rounded-xl border border-line bg-panel p-4 text-xs text-dim">
        <b className="text-accent">Zone 2 = 115–134 bpm</b> at your age — roughly 60–70% of max HR.
        ~80% of your running should live here.
      </div>

      {totalDistSec > 0 && (
        <div className="mb-3 rounded-xl border border-line bg-panel p-4">
          <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
            Zone distribution — last {runs.length} runs
          </h2>
          <div className="flex h-3 overflow-hidden rounded-full">
            {(Object.keys(distribution) as Zone[]).map((z) =>
              distribution[z] > 0 ? (
                <div
                  key={z}
                  style={{
                    width: `${(distribution[z] / totalDistSec) * 100}%`,
                    background: ZONE_COLORS[z],
                  }}
                />
              ) : null,
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-dim">
            {(Object.keys(distribution) as Zone[]).map((z) =>
              distribution[z] > 0 ? (
                <span key={z}>
                  {ZONE_LABELS[z]} {Math.round((distribution[z] / totalDistSec) * 100)}%
                </span>
              ) : null,
            )}
          </div>
        </div>
      )}

      {paceChartData.length > 1 && (
        <ChartCard title="Pace over time">
          <LineChart data={paceChartData}>
            <CartesianGrid stroke={CHART_COLORS.line} strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={CHART_COLORS.faint} fontSize={11} />
            <YAxis
              stroke={CHART_COLORS.faint}
              fontSize={11}
              tickFormatter={(v) => formatPace(v)}
              reversed
              width={40}
            />
            <Tooltip
              formatter={(v) => formatPace(typeof v === "number" ? v : null)}
              contentStyle={{ background: "#171a21", border: `1px solid ${CHART_COLORS.line}` }}
            />
            <Line type="monotone" dataKey="pace" stroke={CHART_COLORS.accent} dot={false} strokeWidth={2} />
          </LineChart>
        </ChartCard>
      )}

      {hrChartData.length > 1 && (
        <ChartCard title="Resting HR over time">
          <LineChart data={hrChartData}>
            <CartesianGrid stroke={CHART_COLORS.line} strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={CHART_COLORS.faint} fontSize={11} />
            <YAxis stroke={CHART_COLORS.faint} fontSize={11} width={30} />
            <Tooltip contentStyle={{ background: "#171a21", border: `1px solid ${CHART_COLORS.line}` }} />
            <Line type="monotone" dataKey="hr" stroke={CHART_COLORS.sleep} dot={false} strokeWidth={2} />
          </LineChart>
        </ChartCard>
      )}

      <div className="mb-3 rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">
          Recent runs
        </h2>
        {runs.length === 0 ? (
          <p className="py-4 text-center text-sm text-faint">No runs logged yet</p>
        ) : (
          <div className="divide-y divide-line/50">
            {runs.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <div className="text-dim">
                  <b className="text-ink">{r.date.toString().slice(0, 10)}</b> · {r.type} ·{" "}
                  {(r.durationSec / 60).toFixed(0)} min
                  {r.distanceM ? ` · ${(r.distanceM / 1000).toFixed(2)} km` : ""}
                  {r.distanceM ? ` · ${formatPace(paceMinPerKm(r.durationSec, r.distanceM))}/km` : ""}
                </div>
                <button onClick={() => remove(r.id)} className="shrink-0 text-xs text-bad">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg border border-line bg-panel-2 py-2 text-center">
      <div className="tabular-nums text-lg font-bold" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-[.06em] text-faint">{label}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="mb-3 rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.06em] text-faint">{title}</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
