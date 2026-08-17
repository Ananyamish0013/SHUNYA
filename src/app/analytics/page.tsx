"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  CheckSquare,
  Target,
  Timer,
  Trophy,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTaskStore } from "@/stores/task-store";
import { useHabitStore } from "@/stores/habit-store";
import { useGoalStore } from "@/stores/goal-store";
import { useFocusStore } from "@/stores/focus-store";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/layout/header";

type RangeType = "7d" | "30d" | "90d";

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getDateRange(range: RangeType): string[] {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const CHART_COLORS = [
  "hsl(263, 70%, 50.4%)",
  "hsl(270, 100%, 81.6%)",
  "hsl(280, 60%, 65%)",
  "hsl(250, 70%, 60%)",
  "hsl(290, 50%, 55%)",
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<RangeType>("30d");

  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);
  const goals = useGoalStore((s) => s.goals);
  const focusSessions = useFocusStore((s) => s.sessions);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dates = useMemo(() => getDateRange(range), [range]);

  // Productivity Trend
  const productivityData = useMemo(() => {
    return dates.map((date) => {
      const dayTasks = tasks.filter((t) => t.date === date && t.completed);
      let habitCompletions = 0;
      habits.forEach((h) => {
        if (h.completions[date] && h.completions[date] >= h.target)
          habitCompletions++;
      });
      const focusMins = focusSessions
        .filter((s) => s.date === date && s.type === "work")
        .reduce((sum, s) => sum + s.duration, 0);
      const score =
        dayTasks.length * 10 + habitCompletions * 5 + Math.round(focusMins / 10);
      return {
        date: shortDate(date),
        score: Math.min(score, 100),
      };
    });
  }, [dates, tasks, habits, focusSessions]);

  // Task Completion
  const taskData = useMemo(() => {
    return dates.map((date) => {
      const dayTasks = tasks.filter((t) => t.date === date);
      return {
        date: shortDate(date),
        completed: dayTasks.filter((t) => t.completed).length,
        total: dayTasks.length,
      };
    });
  }, [dates, tasks]);

  // Habit Trends
  const habitData = useMemo(() => {
    return dates.map((date) => {
      if (habits.length === 0) return { date: shortDate(date), rate: 0 };
      let completed = 0;
      habits.forEach((h) => {
        if (h.completions[date] && h.completions[date] >= h.target)
          completed++;
      });
      return {
        date: shortDate(date),
        rate: Math.round((completed / habits.length) * 100),
      };
    });
  }, [dates, habits]);

  // Focus Distribution
  const focusData = useMemo(() => {
    return dates.map((date) => {
      const mins = focusSessions
        .filter((s) => s.date === date && s.type === "work")
        .reduce((sum, s) => sum + s.duration, 0);
      return {
        date: shortDate(date),
        minutes: mins,
      };
    });
  }, [dates, focusSessions]);

  // Goal Progress pie
  const goalPieData = useMemo(() => {
    const types = ["annual", "quarterly", "monthly", "weekly"];
    return types
      .map((type) => {
        const typeGoals = goals.filter((g) => g.type === type);
        if (typeGoals.length === 0) return null;
        const avgProgress = Math.round(
          typeGoals.reduce((sum, g) => sum + g.progress, 0) / typeGoals.length
        );
        return {
          name: type.charAt(0).toUpperCase() + type.slice(1),
          value: avgProgress || 1,
          count: typeGoals.length,
        };
      })
      .filter(Boolean) as { name: string; value: number; count: number }[];
  }, [goals]);

  // Stats
  const totalCompleted = tasks.filter((t) => t.completed).length;
  const avgHabitRate =
    habitData.length > 0
      ? Math.round(habitData.reduce((s, d) => s + d.rate, 0) / habitData.length)
      : 0;
  const goalsOnTrack = goals.filter((g) => g.progress >= 50).length;
  const totalFocusHours = Math.round(
    focusSessions
      .filter((s) => s.type === "work")
      .reduce((sum, s) => sum + s.duration, 0) / 60
  );

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
        title="Analytics"
        description="Track your productivity trends"
      >
        <div className="flex rounded-xl border border-[hsl(var(--border))] p-1 bg-[hsl(var(--muted)/0.3)]">
          {(["7d", "30d", "90d"] as RangeType[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                range === r
                  ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard
          title="Tasks Completed"
          value={totalCompleted}
          icon="CheckSquare"
          subtitle="All time"
        />
        <StatCard
          title="Avg Habit Rate"
          value={`${avgHabitRate}%`}
          icon="Target"
          subtitle={`Over ${range === "7d" ? "7" : range === "30d" ? "30" : "90"} days`}
        />
        <StatCard
          title="Goals on Track"
          value={goalsOnTrack}
          icon="Trophy"
          subtitle={`of ${goals.length} total`}
        />
        <StatCard
          title="Focus Hours"
          value={`${totalFocusHours}h`}
          icon="Timer"
          subtitle="All time"
        />
      </div>

      {/* Productivity Trend - Full Width */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 mb-6">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
          Productivity Trend
        </h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-6">
          Daily productivity score based on tasks, habits, and focus
        </p>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productivityData}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(263, 70%, 50.4%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(263, 70%, 50.4%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 30%, 90%)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={Math.floor(dates.length / 7)}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(270, 30%, 90%)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(263, 70%, 50.4%)"
                strokeWidth={2}
                fill="url(#prodGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Completion */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
            Task Completion
          </h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-6">
            Completed vs total tasks per day
          </p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 30%, 90%)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(dates.length / 6)}
                />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(270, 30%, 90%)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(270, 30%, 90%)"
                  radius={[4, 4, 0, 0]}
                  name="Total"
                />
                <Bar
                  dataKey="completed"
                  fill="hsl(263, 70%, 50.4%)"
                  radius={[4, 4, 0, 0]}
                  name="Completed"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Trends */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
            Habit Trends
          </h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-6">
            Daily habit completion rate
          </p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={habitData}>
                <defs>
                  <linearGradient id="habitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 100%, 81.6%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(270, 100%, 81.6%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 30%, 90%)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(dates.length / 6)}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(270, 30%, 90%)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(270, 100%, 81.6%)"
                  strokeWidth={2}
                  fill="url(#habitGrad)"
                  name="Completion %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Progress */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
            Goal Progress
          </h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-6">
            Average progress by goal type
          </p>
          <div style={{ height: 220 }}>
            {goalPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {goalPieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(270, 30%, 90%)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(value: unknown, name: unknown) => [
                      `${value}% avg progress`,
                      `${name}`,
                    ] as [string, string]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-[hsl(var(--muted-foreground))]">
                No goals created yet
              </div>
            )}
          </div>
        </div>

        {/* Focus Distribution */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
            Focus Time
          </h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-6">
            Daily focus minutes
          </p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={focusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 30%, 90%)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(dates.length / 6)}
                />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(270, 30%, 90%)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(280, 60%, 65%)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(280, 60%, 65%)" }}
                  name="Minutes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
