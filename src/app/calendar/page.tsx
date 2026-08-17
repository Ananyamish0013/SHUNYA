"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Check,
  Target,
  Trophy,
} from "lucide-react";
import { useTaskStore } from "@/stores/task-store";
import { useHabitStore } from "@/stores/habit-store";
import { useGoalStore } from "@/stores/goal-store";
import { PageHeader } from "@/components/layout/header";

type ViewType = "month" | "week" | "day";

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date): boolean {
  return formatDate(a) === formatDate(b);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ViewType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const tasks = useTaskStore((s) => s.tasks);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const habits = useHabitStore((s) => s.habits);
  const goals = useGoalStore((s) => s.goals);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();

  const navigatePrev = () => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const navigateNext = () => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getTasksForDate = (date: string) => tasks.filter((t) => t.date === date);

  const getHabitCountForDate = (date: string) => {
    let count = 0;
    habits.forEach((h) => {
      if (h.completions[date] && h.completions[date] > 0) count++;
    });
    return count;
  };

  const getGoalsForDate = (date: string) => {
    return goals.filter((g) => g.deadline === date);
  };

  const headerText = useMemo(() => {
    if (view === "month") {
      return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === "week") {
      const monday = getMonday(currentDate);
      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);
      const mStr = monday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const sStr = sunday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${mStr} - ${sStr}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  }, [view, currentDate]);

  // Month View Grid
  const monthGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    return cells;
  }, [currentDate]);

  // Week View
  const weekDays = useMemo(() => {
    const monday = getMonday(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Calendar" description="View your schedule at a glance">
        <button
          onClick={goToToday}
          className="rounded-xl border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))]"
        >
          Today
        </button>
      </PageHeader>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={navigatePrev}
            className="rounded-xl border border-[hsl(var(--border))] p-2 text-[hsl(var(--foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))]"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] min-w-[200px] text-center">
            {headerText}
          </h2>
          <button
            onClick={navigateNext}
            className="rounded-xl border border-[hsl(var(--border))] p-2 text-[hsl(var(--foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))]"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex rounded-xl border border-[hsl(var(--border))] p-1 bg-[hsl(var(--muted)/0.3)]">
          {(["month", "week", "day"] as ViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all duration-200 ${
                view === v
                  ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Month View */}
      {view === "month" && (
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
          <div className="grid grid-cols-7">
            {DAYS_SHORT.map((day) => (
              <div
                key={day}
                className="border-b border-[hsl(var(--border))] px-3 py-2.5 text-center text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthGrid.map((cell, i) => {
              const dateStr = formatDate(cell.date);
              const dayTasks = getTasksForDate(dateStr);
              const habitCount = getHabitCountForDate(dateStr);
              const dayGoals = getGoalsForDate(dateStr);
              const isToday = isSameDay(cell.date, today);
              const isSelected = isSameDay(cell.date, selectedDate);
              const totalItems = dayTasks.length + habitCount + dayGoals.length;

              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(cell.date);
                    setCurrentDate(cell.date);
                    setView("day");
                  }}
                  className={`min-h-[100px] border-b border-r border-[hsl(var(--border)/0.5)] p-2 text-left transition-all duration-200 hover:bg-[hsl(var(--primary)/0.03)] ${
                    !cell.isCurrentMonth ? "opacity-40" : ""
                  } ${isSelected ? "bg-[hsl(var(--primary)/0.05)]" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                        isToday
                          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                          : "text-[hsl(var(--foreground))]"
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          t.completed
                            ? "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] line-through"
                            : "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]"
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {habitCount > 0 && dayTasks.length < 2 && (
                      <div className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-[hsl(var(--chart2)/0.1)] text-[hsl(var(--chart2))]">
                        <Target size={8} />
                        {habitCount} habit{habitCount > 1 ? "s" : ""}
                      </div>
                    )}
                    {totalItems > 3 && (
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                        +{totalItems - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === "week" && (
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dateStr = formatDate(day);
            const dayTasks = getTasksForDate(dateStr);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={dateStr}
                className={`rounded-2xl border bg-[hsl(var(--card))] overflow-hidden transition-all duration-200 ${
                  isToday
                    ? "border-[hsl(var(--primary))] shadow-md shadow-[hsl(var(--primary)/0.1)]"
                    : "border-[hsl(var(--border))]"
                }`}
              >
                <div
                  className={`px-3 py-2.5 text-center border-b ${
                    isToday
                      ? "bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary)/0.2)]"
                      : "border-[hsl(var(--border))]"
                  }`}
                >
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    {DAYS_SHORT[weekDays.indexOf(day)]}
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      isToday
                        ? "text-[hsl(var(--primary))]"
                        : "text-[hsl(var(--foreground))]"
                    }`}
                  >
                    {day.getDate()}
                  </p>
                </div>
                <div className="p-2 space-y-1.5 min-h-[200px]">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-lg p-2 text-xs border-l-2 ${
                        task.completed
                          ? "border-l-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.5)]"
                          : task.priority === "high"
                          ? "border-l-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.05)]"
                          : task.priority === "medium"
                          ? "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                          : "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-0.5 flex-shrink-0 h-3.5 w-3.5 rounded border transition-colors ${
                            task.completed
                              ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]"
                              : "border-[hsl(var(--border))]"
                          }`}
                        >
                          {task.completed && (
                            <Check
                              size={10}
                              className="text-white m-[1px]"
                            />
                          )}
                        </button>
                        <span
                          className={`leading-tight ${
                            task.completed
                              ? "line-through text-[hsl(var(--muted-foreground))]"
                              : "text-[hsl(var(--card-foreground))]"
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dayTasks.length === 0 && (
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] text-center py-4">
                      No tasks
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day View */}
      {view === "day" && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Tasks Section */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
              <CalendarIcon size={16} className="text-[hsl(var(--primary))]" />
              Tasks
            </h3>
            {getTasksForDate(formatDate(currentDate)).length === 0 ? (
              <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">
                No tasks for this day
              </p>
            ) : (
              <div className="space-y-2">
                {getTasksForDate(formatDate(currentDate)).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 rounded-xl p-3 border transition-all duration-200 ${
                      task.completed
                        ? "border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]"
                        : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)]"
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                        task.completed
                          ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]"
                          : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]"
                      }`}
                    >
                      {task.completed && (
                        <Check size={12} className="text-white" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? "line-through text-[hsl(var(--muted-foreground))]"
                            : "text-[hsl(var(--card-foreground))]"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                          : task.priority === "medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Habits Section */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
              <Target size={16} className="text-[hsl(var(--chart2))]" />
              Habits
            </h3>
            {habits.length === 0 ? (
              <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">
                No habits tracked
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {habits.map((habit) => {
                  const dateStr = formatDate(currentDate);
                  const completion = habit.completions[dateStr] || 0;
                  const isComplete = completion >= habit.target;
                  return (
                    <div
                      key={habit.id}
                      className={`rounded-xl border p-3 transition-all duration-200 ${
                        isComplete
                          ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
                          : "border-[hsl(var(--border))]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                          {habit.name}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                        {completion} / {habit.target} {habit.unit}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Goals Due */}
          {getGoalsForDate(formatDate(currentDate)).length > 0 && (
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-[hsl(var(--chart3))]" />
                Goals Due
              </h3>
              <div className="space-y-2">
                {getGoalsForDate(formatDate(currentDate)).map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                        {goal.title}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {goal.type} goal
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[hsl(var(--primary))]">
                        {goal.progress}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
