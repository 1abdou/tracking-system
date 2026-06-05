import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  MilestoneWithTasks,
  Phase,
  PhaseDetail,
  Task,
  TaskStatus,
  TaskWithContext,
} from "@/types/roadmap";

function assertNoError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchAllPhases(
  supabase: SupabaseClient,
): Promise<Phase[]> {
  const { data, error } = await supabase
    .from("phases")
    .select("id, title, timeframe")
    .order("id");

  assertNoError(error);
  return (data ?? []) as Phase[];
}

export async function fetchTasksWithContext(
  supabase: SupabaseClient,
): Promise<TaskWithContext[]> {
  const { data, error } = await supabase.from("tasks").select(`
      id,
      milestone_id,
      title,
      status,
      updated_at,
      milestones (
        id,
        name,
        phase_id,
        phases ( id, title )
      )
    `);

  assertNoError(error);
  return (data ?? []) as unknown as TaskWithContext[];
}

export async function fetchPhaseDetail(
  supabase: SupabaseClient,
  phaseId: number,
): Promise<PhaseDetail> {
  const { data: phase, error: phaseError } = await supabase
    .from("phases")
    .select("id, title, timeframe")
    .eq("id", phaseId)
    .single();

  assertNoError(phaseError);
  if (!phase) {
    throw new Error("Phase not found.");
  }

  const { data: milestones, error: milestoneError } = await supabase
    .from("milestones")
    .select(
      `
      id,
      phase_id,
      name,
      tasks (
        id,
        milestone_id,
        title,
        status,
        updated_at
      )
    `,
    )
    .eq("phase_id", phaseId)
    .order("id");

  assertNoError(milestoneError);

  const normalized = ((milestones ?? []) as MilestoneWithTasks[]).map((m) => ({
    ...m,
    tasks: [...(m.tasks ?? [])].sort((a, b) => a.id - b.id),
  }));

  return {
    phase: phase as Phase,
    milestones: normalized,
  };
}

export async function updateTaskStatus(
  supabase: SupabaseClient,
  taskId: number,
  status: TaskStatus,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select("id, milestone_id, title, status, updated_at")
    .single();

  assertNoError(error);
  if (!data) {
    throw new Error("Task update returned no row.");
  }
  return data as Task;
}
