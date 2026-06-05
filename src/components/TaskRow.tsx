"use client";

import { TASK_STATUSES, type Task, type TaskStatus } from "@/types/roadmap";

interface TaskRowProps {
  task: Task;
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
  disabled?: boolean;
}

export function TaskRow({ task, onStatusChange, disabled }: TaskRowProps) {
  const handleCheckbox = async () => {
    const next: TaskStatus =
      task.status === "Completed" ? "Todo" : "Completed";
    await onStatusChange(task.id, next);
  };

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await onStatusChange(task.id, e.target.value as TaskStatus);
  };

  const titleClass =
    task.status === "Completed"
      ? "text-slate-500 line-through"
      : task.status === "In Progress"
        ? "font-semibold text-sky-400"
        : "text-slate-200";

  return (
    <div className="flex items-start gap-3 rounded-lg border border-transparent px-1 py-2 transition-colors hover:border-slate-700/50 hover:bg-slate-800/40">
      <input
        type="checkbox"
        checked={task.status === "Completed"}
        disabled={disabled}
        onChange={() => void handleCheckbox()}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 disabled:opacity-50"
        aria-label={`Mark "${task.title}" complete`}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${titleClass}`}>
          {task.status === "In Progress" && (
            <span className="mr-1" aria-hidden>
              🔄
            </span>
          )}
          {task.title}
        </p>
        <select
          value={task.status}
          disabled={disabled}
          onChange={(e) => void handleSelect(e)}
          className="mt-1.5 w-full max-w-[9rem] rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          aria-label={`Status for ${task.title}`}
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
