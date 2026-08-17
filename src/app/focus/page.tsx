"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Clock,
  Zap,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useFocusStore } from "@/stores/focus-store";
import { ProgressRing } from "@/components/shared/progress-ring";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/layout/header";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function FocusPage() {
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    isRunning,
    isPaused,
    currentType,
    timeRemaining,
    sessionCount,
    workDuration,
    breakDuration,
    longBreakDuration,
    sessionsBeforeLongBreak,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeSession,
    tick,
    setWorkDuration,
    setBreakDuration,
    getDailyFocus,
    getWeeklyFocus,
    getMonthlyFocus,
    getTodaySessions,
  } = useFocusStore();

  useEffect(() => {
    setMounted(true);
    if (isRunning) {
      resetTimer();
    }
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, tick]);

  const totalDuration =
    currentType === "work" ? workDuration * 60 : breakDuration * 60;
  const progress =
    totalDuration > 0
      ? ((totalDuration - timeRemaining) / totalDuration) * 100
      : 0;

  const todaySessions = mounted ? getTodaySessions() : [];
  const dailyFocus = mounted ? getDailyFocus() : 0;
  const weeklyFocus = mounted ? getWeeklyFocus() : 0;
  const monthlyFocus = mounted ? getMonthlyFocus() : 0;
  const todayWorkSessions = todaySessions.filter((s) => s.type === "work");

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Focus"
        description="Stay focused with the Pomodoro technique"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Timer */}
        <div className="lg:col-span-2 space-y-8">
          {/* Timer Card */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 lg:p-12">
            <div className="flex flex-col items-center">
              {/* Timer Ring */}
              <ProgressRing
                progress={progress}
                size={280}
                strokeWidth={12}
                color={
                  currentType === "work"
                    ? "hsl(var(--primary))"
                    : "hsl(var(--chart2))"
                }
              >
                <span className="text-5xl font-bold text-[hsl(var(--card-foreground))] tracking-tight tabular-nums">
                  {formatTime(timeRemaining)}
                </span>
                <span
                  className={`text-sm font-medium mt-2 ${
                    currentType === "work"
                      ? "text-[hsl(var(--primary))]"
                      : "text-[hsl(var(--chart2))]"
                  }`}
                >
                  {currentType === "work" ? "Work" : "Break"}
                </span>
              </ProgressRing>

              {/* Session Counter */}
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-6 mb-8">
                Session {(sessionCount % sessionsBeforeLongBreak) + 1} of{" "}
                {sessionsBeforeLongBreak}
              </p>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={resetTimer}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Reset"
                >
                  <RotateCcw size={18} />
                </button>

                <button
                  onClick={() => {
                    if (!isRunning) startTimer();
                    else if (isPaused) resumeTimer();
                    else pauseTimer();
                  }}
                  className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 shadow-lg ${
                    currentType === "work"
                      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[hsl(var(--primary)/0.3)] hover:shadow-[hsl(var(--primary)/0.5)]"
                      : "bg-[hsl(var(--chart2))] text-white shadow-[hsl(var(--chart2)/0.3)]"
                  }`}
                >
                  {isRunning && !isPaused ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} className="ml-1" />
                  )}
                </button>

                <button
                  onClick={completeSession}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                  title="Skip"
                >
                  <SkipForward size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-5">
              Timer Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    Work Duration
                  </label>
                  <span className="text-xs font-bold text-[hsl(var(--foreground))]">
                    {workDuration}min
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-[hsl(var(--primary))] h-2 rounded-full appearance-none bg-[hsl(var(--muted))] disabled:opacity-50"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    Break Duration
                  </label>
                  <span className="text-xs font-bold text-[hsl(var(--foreground))]">
                    {breakDuration}min
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={15}
                  step={1}
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-[hsl(var(--primary))] h-2 rounded-full appearance-none bg-[hsl(var(--muted))] disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Session History */}
          {todaySessions.length > 0 && (
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">
                Today&apos;s Sessions
              </h3>
              <div className="space-y-2">
                {[...todaySessions].reverse().map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                      session.type === "work"
                        ? "bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.1)]"
                        : "bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          session.type === "work"
                            ? "bg-[hsl(var(--primary))]"
                            : "bg-[hsl(var(--muted-foreground))]"
                        }`}
                      />
                      <span className="text-sm font-medium text-[hsl(var(--card-foreground))] capitalize">
                        {session.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {new Date(session.startTime).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "2-digit" }
                        )}
                      </span>
                      <span className="text-xs font-medium text-[hsl(var(--foreground))]">
                        {session.duration}min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Stats */}
        <div className="space-y-4">
          <StatCard
            title="Focus Today"
            value={formatMinutes(dailyFocus)}
            icon="Zap"
            subtitle={`${todayWorkSessions.length} work sessions`}
          />
          <StatCard
            title="This Week"
            value={formatMinutes(weeklyFocus)}
            icon="Calendar"
            subtitle="Total focus time"
          />
          <StatCard
            title="This Month"
            value={formatMinutes(monthlyFocus)}
            icon="BarChart3"
            subtitle="Total focus time"
          />
          <StatCard
            title="Total Sessions"
            value={sessionCount}
            icon="Clock"
            subtitle="All time work sessions"
          />
        </div>
      </div>
    </div>
  );
}
