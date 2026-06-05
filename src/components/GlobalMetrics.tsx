import type { DashboardMetrics } from "@/types/roadmap";

interface GlobalMetricsProps {
  metrics: DashboardMetrics;
}

export function GlobalMetrics({ metrics }: GlobalMetricsProps) {
  const progress = metrics.total ? metrics.pct / 100 : 0;

  return (
    <header className="mb-8 space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">
          🧭 12-Week AI Engineering Roadmap
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          <span className="font-semibold text-slate-200">{metrics.completed}</span>{" "}
          /{" "}
          <span className="font-semibold text-slate-200">{metrics.total}</span> tasks
          completed ({metrics.pct.toFixed(1)}%)
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Current Phase" value={metrics.currentPhase} compact />
        <MetricCard
          label="Tasks In Progress"
          value={String(metrics.inProgress)}
        />
        <MetricCard
          label="Completed Tasks"
          value={String(metrics.completed)}
        />
      </div>
    </header>
  );
}

function MetricCard({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-700/80 bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-center shadow-lg">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={`mt-2 font-bold text-slate-50 ${compact ? "text-base leading-snug" : "text-3xl"}`}
      >
        {value}
      </p>
    </div>
  );
}
