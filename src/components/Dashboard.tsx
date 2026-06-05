"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchAllPhases,
  fetchPhaseDetail,
  fetchTasksWithContext,
  updateTaskStatus,
} from "@/lib/data";
import { computeMetrics } from "@/lib/metrics";
import { createClient } from "@/lib/supabase/client";
import type { Phase, PhaseDetail, TaskStatus, TaskWithContext } from "@/types/roadmap";

import { GlobalMetrics } from "./GlobalMetrics";
import { PhaseWorkspace } from "./PhaseWorkspace";
import { Sidebar } from "./Sidebar";

export function Dashboard() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [allTasks, setAllTasks] = useState<TaskWithContext[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const [phaseDetail, setPhaseDetail] = useState<PhaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [phaseLoading, setPhaseLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  const metrics = useMemo(
    () => computeMetrics(phases, allTasks),
    [phases, allTasks],
  );

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const [phaseRows, taskRows] = await Promise.all([
        fetchAllPhases(supabase),
        fetchTasksWithContext(supabase),
      ]);
      setPhases(phaseRows);
      setAllTasks(taskRows);
      if (phaseRows.length) {
        setSelectedPhaseId((prev) => prev ?? phaseRows[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load roadmap data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPhase = useCallback(async (phaseId: number) => {
    setPhaseLoading(true);
    try {
      const supabase = createClient();
      const detail = await fetchPhaseDetail(supabase, phaseId);
      setPhaseDetail(detail);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load phase data.",
      );
      setPhaseDetail(null);
    } finally {
      setPhaseLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (selectedPhaseId != null) {
      void loadPhase(selectedPhaseId);
    }
  }, [selectedPhaseId, loadPhase]);

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    const previousTasks = allTasks;
    const previousDetail = phaseDetail;

    setUpdatingTaskId(taskId);
    setError(null);

    setAllTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
    setPhaseDetail((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        milestones: prev.milestones.map((m) => ({
          ...m,
          tasks: m.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t,
          ),
        })),
      };
    });

    try {
      const supabase = createClient();
      const updated = await updateTaskStatus(supabase, taskId, status);
      setAllTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: updated.status, updated_at: updated.updated_at }
            : t,
        ),
      );
    } catch (err) {
      setAllTasks(previousTasks);
      setPhaseDetail(previousDetail);
      setError(
        err instanceof Error ? err.message : "Failed to update task status.",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading roadmap…
      </div>
    );
  }

  if (!phases.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 p-8 text-center">
        <p className="text-lg text-slate-300">No phases in the database.</p>
        <p className="text-sm text-slate-500">
          Run <code className="text-emerald-400">python sync_plan.py</code> from
          the project root, then refresh.
        </p>
      </div>
    );
  }

  const activePhaseId = selectedPhaseId ?? phases[0].id;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 lg:flex-row">
      <Sidebar
        phases={phases}
        selectedPhaseId={activePhaseId}
        onSelectPhase={setSelectedPhaseId}
      />

      <main className="flex-1 overflow-x-auto p-6 lg:p-8">
        {error && (
          <div
            className="mb-6 rounded-lg border border-red-800/80 bg-red-950/50 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        <GlobalMetrics metrics={metrics} />

        <PhaseWorkspace
          detail={phaseDetail}
          loading={phaseLoading}
          onStatusChange={handleStatusChange}
          updatingTaskId={updatingTaskId}
        />
      </main>
    </div>
  );
}
