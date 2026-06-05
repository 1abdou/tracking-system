import type { Phase } from "@/types/roadmap";

interface SidebarProps {
  phases: Phase[];
  selectedPhaseId: number;
  onSelectPhase: (phaseId: number) => void;
}

export function Sidebar({
  phases,
  selectedPhaseId,
  onSelectPhase,
}: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-slate-800 bg-slate-900/60 p-6 lg:w-72 lg:border-b-0 lg:border-r">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Navigation
        </h2>
        <nav className="mt-4 space-y-2" aria-label="Phases">
          {phases.map((phase) => {
            const active = phase.id === selectedPhaseId;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onSelectPhase(phase.id)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "bg-indigo-600 font-medium text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {phase.title}
              </button>
            );
          })}
        </nav>
      </div>

      {/*
        Future: GitHub-style contribution consistency heatmap
        - Aggregate tasks where status = 'Completed' by date(updated_at)
        - Render a 12-week grid with intensity by count (e.g. react-calendar-heatmap)
      */}
      <div className="hidden rounded-lg border border-dashed border-slate-700 p-4 lg:block">
        <p className="text-xs font-medium text-slate-500">Activity Heatmap</p>
        <p className="mt-1 text-xs text-slate-600">Coming soon</p>
      </div>

      <div className="mt-auto rounded-lg bg-slate-800/80 p-4">
        <p className="text-xs text-slate-400">Sync roadmap from plan.md</p>
        <code className="mt-2 block rounded bg-slate-950 px-2 py-1.5 text-xs text-emerald-400">
          python sync_plan.py
        </code>
      </div>
    </aside>
  );
}
