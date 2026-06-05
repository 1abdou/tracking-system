import type { PhaseDetail, TaskStatus } from "@/types/roadmap";

import { MilestoneColumn } from "./MilestoneColumn";

interface PhaseWorkspaceProps {
  detail: PhaseDetail | null;
  loading: boolean;
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
  updatingTaskId: number | null;
}

export function PhaseWorkspace({
  detail,
  loading,
  onStatusChange,
  updatingTaskId,
}: PhaseWorkspaceProps) {
  if (loading) {
    return (
      <p className="text-slate-400" role="status">
        Loading phase…
      </p>
    );
  }

  if (!detail) {
    return null;
  }

  const { phase, milestones } = detail;
  const timeframe = phase.timeframe ?? "Timeframe not set";

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white shadow-lg">
        <h2 className="text-2xl font-bold">{phase.title}</h2>
        <p className="mt-1 text-sm text-indigo-100">📅 {timeframe}</p>
      </div>

      {milestones.length === 0 ? (
        <p className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 text-slate-400">
          No milestones for this phase. Run{" "}
          <code className="text-emerald-400">python sync_plan.py</code> to import
          from plan.md.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {milestones.map((milestone) => (
            <MilestoneColumn
              key={milestone.id}
              milestone={milestone}
              onStatusChange={onStatusChange}
              updatingTaskId={updatingTaskId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
