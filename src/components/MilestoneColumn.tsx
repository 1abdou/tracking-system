import type { MilestoneWithTasks, TaskStatus } from "@/types/roadmap";

import { TaskRow } from "./TaskRow";

interface MilestoneColumnProps {
  milestone: MilestoneWithTasks;
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
  updatingTaskId: number | null;
}

export function MilestoneColumn({
  milestone,
  onStatusChange,
  updatingTaskId,
}: MilestoneColumnProps) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="border-b-2 border-indigo-500 pb-2 text-base font-semibold text-slate-100">
        {milestone.name}
      </h3>
      <div className="mt-3 space-y-1">
        {milestone.tasks.length === 0 ? (
          <p className="text-sm italic text-slate-500">
            No tasks yet — run sync_plan.py
          </p>
        ) : (
          milestone.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              disabled={updatingTaskId === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
