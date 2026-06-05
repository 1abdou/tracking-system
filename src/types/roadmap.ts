export const TASK_STATUSES = ["Todo", "In Progress", "Completed"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Phase {
  id: number;
  title: string;
  timeframe: string | null;
}

export interface Milestone {
  id: number;
  phase_id: number;
  name: string;
}

export interface Task {
  id: number;
  milestone_id: number;
  title: string;
  status: TaskStatus;
  updated_at: string;
}

export interface MilestoneWithTasks extends Milestone {
  tasks: Task[];
}

export interface PhaseDetail {
  phase: Phase;
  milestones: MilestoneWithTasks[];
}

export interface TaskWithContext extends Task {
  milestones: {
    id: number;
    name: string;
    phase_id: number;
    phases: { id: number; title: string } | null;
  } | null;
}

export interface DashboardMetrics {
  total: number;
  completed: number;
  inProgress: number;
  pct: number;
  currentPhase: string;
}
