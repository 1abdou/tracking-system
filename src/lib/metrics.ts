import type { DashboardMetrics, Phase, TaskWithContext } from "@/types/roadmap";

export function computeMetrics(
  phases: Phase[],
  tasks: TaskWithContext[],
): DashboardMetrics {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pct = total ? (completed / total) * 100 : 0;

  const phaseTaskMap = new Map<number, TaskWithContext[]>();
  for (const task of tasks) {
    const phaseId = task.milestones?.phase_id;
    if (phaseId != null) {
      const list = phaseTaskMap.get(phaseId) ?? [];
      list.push(task);
      phaseTaskMap.set(phaseId, list);
    }
  }

  let currentPhase = "—";
  const sortedPhases = [...phases].sort((a, b) => a.id - b.id);
  for (const phase of sortedPhases) {
    const phaseTasks = phaseTaskMap.get(phase.id) ?? [];
    if (!phaseTasks.length) continue;
    if (phaseTasks.some((t) => t.status !== "Completed")) {
      currentPhase = phase.title;
      break;
    }
  }
  if (currentPhase === "—" && sortedPhases.length) {
    currentPhase = sortedPhases[sortedPhases.length - 1].title;
  }

  return { total, completed, inProgress, pct, currentPhase };
}
