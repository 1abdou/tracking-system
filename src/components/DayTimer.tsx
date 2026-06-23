"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "roadmap-day-timer-start-v2";
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** 12-week roadmap begins June 1, 2026 — day 8 is June 8, 2026. */
function getRoadmapStartMs(): number {
  const start = new Date(2026, 5, 1);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

function loadStartedAt(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { startedAt?: number };
    return typeof parsed.startedAt === "number" ? parsed.startedAt : null;
  } catch {
    return null;
  }
}

function saveStartedAt(startedAt: number | null): void {
  if (startedAt == null) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ startedAt }));
}

/** Inclusive calendar days: June 1 = day 1, June 8 = day 8. */
function calcDays(startedAt: number | null): number {
  if (startedAt == null) return 0;

  const start = new Date(startedAt);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = Math.floor(((today.getTime() - start.getTime()) / MS_PER_DAY) / 7);
  return Math.max(diff + 1, 1);
}

export function DayTimer() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [days, setDays] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored = loadStartedAt();
    if (stored == null) {
      stored = getRoadmapStartMs();
      saveStartedAt(stored);
    }
    setStartedAt(stored);
    setDays(calcDays(stored));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const tick = () => setDays(calcDays(startedAt));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [startedAt, ready]);

  const handleStart = () => {
    if (startedAt != null) return;
    const start = getRoadmapStartMs();
    setStartedAt(start);
    setDays(calcDays(start));
    saveStartedAt(start);
  };

  const handleRestart = () => {
    const start = getRoadmapStartMs();
    setStartedAt(start);
    setDays(calcDays(start));
    saveStartedAt(start);
  };

  const isRunning = startedAt != null;

  if (!ready) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-center rounded-xl border border-slate-700/80 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-4xl font-bold tabular-nums leading-none text-slate-50">
        {days}
      </p>
      <p className="mb-3 mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {"Current Week"}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleStart}
          disabled={isRunning}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
