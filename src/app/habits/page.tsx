"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as LucideIcons from "lucide-react";
import {
  Plus,
  X,
  Flame,
  MoreHorizontal,
  Pencil,
  Trash2,
  Target,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle2,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useHabitStore } from "@/stores/habit-store";
import { ProgressRing } from "@/components/shared/progress-ring";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { Habit } from "@/lib/types";

// ─── Constants ──────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  "Dumbbell",
  "BookOpen",
  "Droplets",
  "Brain",
  "Heart",
  "Leaf",
  "Bike",
  "Moon",
  "Sun",
  "Pencil",
  "Coffee",
  "Music",
  "Flame",
  "Zap",
  "Star",
] as const;

const COLOR_OPTIONS = [
  "#9F7AEA",
  "#EC4899",
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F59E0B",
] as const;

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

type IconProps = { className?: string; size?: number; style?: React.CSSProperties };

function getIconComponent(
  iconName: string
): React.ComponentType<IconProps> {
  return (
    (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<IconProps>
      >
    )[iconName] || LucideIcons.Target
  );
}

// ─── Habit Form Modal ───────────────────────────────────────────────────────

interface HabitFormData {
  name: string;
  icon: string;
  color: string;
  target: number;
  unit: string;
}

function HabitFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HabitFormData) => void;
  initialData?: HabitFormData;
  isEditing: boolean;
}) {
  const [form, setForm] = useState<HabitFormData>({
    name: "",
    icon: "Dumbbell",
    color: "#9F7AEA",
    target: 1,
    unit: "times",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ name: "", icon: "Dumbbell", color: "#9F7AEA", target: 1, unit: "times" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ ...form, name: form.name.trim(), target: Math.max(1, form.target) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
        >
          <X size={16} />
        </button>

        <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-6">
          {isEditing ? "Edit Habit" : "Create New Habit"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Drink water"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)]"
              autoFocus
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map((iconName) => {
                const Icon = getIconComponent(iconName);
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, icon: iconName }))}
                    className={`flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 ${
                      form.icon === iconName
                        ? "bg-[hsl(var(--primary)/0.15)] ring-2 ring-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                        : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/0.8)]"
                    }`}
                    title={iconName}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className={`h-8 w-8 rounded-full transition-all duration-200 ${
                    form.color === c
                      ? "ring-2 ring-offset-2 ring-offset-[hsl(var(--card))] scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c,
                    boxShadow: form.color === c ? `0 0 0 2px ${c}` : undefined,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Target + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
                Daily Target
              </label>
              <input
                type="number"
                min={1}
                max={999}
                value={form.target}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    target: parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
                Unit
              </label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                placeholder="e.g., glasses"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)]"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 rounded-xl bg-[hsl(var(--muted)/0.5)] p-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: form.color + "22" }}
            >
              {(() => {
                const PreviewIcon = getIconComponent(form.icon);
                return <PreviewIcon size={20} className="text-current" style={{ color: form.color }} />;
              })()}
            </div>
            <div>
              <p className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                {form.name || "Habit name"}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {form.target} {form.unit} / day
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[hsl(var(--primary))] px-5 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.25)]"
            >
              {isEditing ? "Save Changes" : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Options Menu ───────────────────────────────────────────────────────────

function OptionsMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
      >
        <MoreHorizontal size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[hsl(var(--card-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[hsl(var(--destructive))] transition-colors hover:bg-[hsl(var(--destructive)/0.1)]"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Weekly Bar ─────────────────────────────────────────────────────────────

function WeeklyBar({
  habit,
  getCompletionForDate,
}: {
  habit: Habit;
  getCompletionForDate: (habitId: string, date: string) => number;
}) {
  const today = new Date();
  const days = useMemo(() => {
    const result: { date: string; label: string; completed: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      const completion = getCompletionForDate(habit.id, dateStr);
      result.push({
        date: dateStr,
        label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
        completed: completion >= habit.target,
      });
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit.id, habit.target, habit.completions]);

  return (
    <div className="flex items-end gap-1.5 w-full">
      {days.map((day) => (
        <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-sm transition-all duration-300"
            style={{
              height: 24,
              backgroundColor: day.completed ? habit.color : "hsl(var(--muted))",
              opacity: day.completed ? 1 : 0.4,
            }}
          />
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
            {day.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Habit Card ─────────────────────────────────────────────────────────────

function HabitCard({
  habit,
  onEdit,
  onDelete,
  onSelect,
  isSelected,
}: {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
  onSelect: (habitId: string) => void;
  isSelected: boolean;
}) {
  const {
    logCompletion,
    removeCompletion,
    getStreak,
    getWeeklyCompletion,
    getMonthlyCompletion,
    getCompletionForDate,
  } = useHabitStore();

  const today = formatDate(new Date());
  const todayCount = getCompletionForDate(habit.id, today);
  const streak = getStreak(habit.id);
  const weekly = getWeeklyCompletion(habit.id);
  const monthly = getMonthlyCompletion(habit.id);
  const progress = Math.min(100, (todayCount / habit.target) * 100);
  const isComplete = todayCount >= habit.target;

  const Icon = getIconComponent(habit.icon);

  return (
    <div
      onClick={() => onSelect(habit.id)}
      className={`group relative overflow-hidden rounded-2xl border bg-[hsl(var(--card))] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
        isSelected
          ? "border-2 shadow-lg"
          : "border-[hsl(var(--border))] hover:shadow-[hsl(var(--primary)/0.08)]"
      }`}
      style={{
        borderColor: isSelected ? habit.color : undefined,
        boxShadow: isSelected ? `0 4px 20px ${habit.color}20` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: habit.color + "1A" }}
          >
            <Icon size={20} style={{ color: habit.color }} />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[hsl(var(--card-foreground))]">
              {habit.name}
            </h3>
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
          </div>
        </div>
        <OptionsMenu
          onEdit={() => onEdit(habit)}
          onDelete={() => onDelete(habit)}
        />
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-4">
        <ProgressRing
          progress={progress}
          size={100}
          strokeWidth={7}
          color={habit.color}
        >
          <span
            className="text-lg font-bold"
            style={{ color: isComplete ? habit.color : "hsl(var(--card-foreground))" }}
          >
            {Math.round(progress)}%
          </span>
        </ProgressRing>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col items-center rounded-xl bg-[hsl(var(--muted)/0.5)] px-2 py-2">
          <div className="flex items-center gap-1 mb-0.5">
            <Flame size={12} style={{ color: habit.color }} />
            <span className="text-xs font-semibold text-[hsl(var(--card-foreground))]">
              {streak}
            </span>
          </div>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Streak</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-[hsl(var(--muted)/0.5)] px-2 py-2">
          <span className="text-xs font-semibold text-[hsl(var(--card-foreground))] mb-0.5">
            {weekly}%
          </span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Week</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-[hsl(var(--muted)/0.5)] px-2 py-2">
          <span className="text-xs font-semibold text-[hsl(var(--card-foreground))] mb-0.5">
            {monthly}%
          </span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Month</span>
        </div>
      </div>

      {/* Weekly Bar */}
      <div className="mb-4">
        <WeeklyBar habit={habit} getCompletionForDate={getCompletionForDate} />
      </div>

      {/* Log Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (todayCount > 0) {
              removeCompletion(habit.id, today);
            }
          }}
          disabled={todayCount <= 0}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition-all duration-200 hover:bg-[hsl(var(--muted))] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            logCompletion(habit.id, today);
          }}
          disabled={isComplete}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl h-9 text-sm font-medium transition-all duration-200 ${
            isComplete
              ? "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-default"
              : "text-white hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          }`}
          style={{
            backgroundColor: isComplete ? undefined : habit.color,
          }}
        >
          {isComplete ? (
            <>
              <CheckCircle2 size={14} />
              Done
            </>
          ) : (
            <>
              <Plus size={14} />
              Log
            </>
          )}
          <span className="ml-1 opacity-80">
            {todayCount} / {habit.target} {habit.unit}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Heatmap ────────────────────────────────────────────────────────────────

function HabitHeatmap({ habit }: { habit: Habit }) {
  const { getCompletionForDate } = useHabitStore();
  const [tooltipInfo, setTooltipInfo] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const weeks = useMemo(() => {
    const result: { date: string; count: number; pct: number }[][] = [];
    const today = new Date();
    // Start 11 weeks ago (12 weeks total)
    const start = new Date(today);
    start.setDate(start.getDate() - 83); // 12 weeks * 7 - 1

    // Align to the nearest Sunday
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek);

    let current = new Date(start);
    let currentWeek: { date: string; count: number; pct: number }[] = [];

    while (current <= today) {
      const dateStr = formatDate(current);
      const count = getCompletionForDate(habit.id, dateStr);
      const pct = habit.target > 0 ? Math.min(1, count / habit.target) : 0;
      currentWeek.push({ date: dateStr, count, pct });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
      current.setDate(current.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit.id, habit.target, habit.completions]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function getCellColor(pct: number): string {
    if (pct <= 0) return "hsl(var(--muted))";
    const opacity = 0.2 + pct * 0.8;
    return habit.color + Math.round(opacity * 255).toString(16).padStart(2, "0");
  }

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
      <div className="flex items-center gap-3 mb-5">
        {(() => {
          const HeatmapIcon = getIconComponent(habit.icon);
          return (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: habit.color + "1A" }}
            >
              <HeatmapIcon size={16} style={{ color: habit.color }} />
            </div>
          );
        })()}
        <div>
          <h3 className="text-sm font-semibold text-[hsl(var(--card-foreground))]">
            {habit.name} — Activity
          </h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Last 12 weeks of activity
          </p>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="flex gap-0.5 min-w-fit">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1.5 pt-0">
            {dayLabels.map((label, i) => (
              <div
                key={label}
                className="h-[14px] flex items-center text-[10px] text-[hsl(var(--muted-foreground))]"
              >
                {i % 2 === 1 ? label : ""}
              </div>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  className="h-[14px] w-[14px] rounded-[3px] transition-all duration-150 cursor-pointer hover:ring-2 hover:ring-[hsl(var(--foreground)/0.3)] hover:ring-offset-1 hover:ring-offset-[hsl(var(--card))]"
                  style={{
                    backgroundColor: getCellColor(day.pct),
                  }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setTooltipInfo({
                      date: day.date,
                      count: day.count,
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                    });
                  }}
                  onMouseLeave={() => setTooltipInfo(null)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-3">
          <span className="text-[10px] text-[hsl(var(--muted-foreground))] mr-1">
            Less
          </span>
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <div
              key={pct}
              className="h-[12px] w-[12px] rounded-[2px]"
              style={{ backgroundColor: getCellColor(pct) }}
            />
          ))}
          <span className="text-[10px] text-[hsl(var(--muted-foreground))] ml-1">
            More
          </span>
        </div>
      </div>

      {/* Tooltip rendered via portal-style fixed position */}
      {tooltipInfo && (
        <div
          className="fixed z-[100] -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{ left: tooltipInfo.x, top: tooltipInfo.y }}
        >
          <div className="rounded-lg bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-2.5 py-1.5 text-xs font-medium shadow-lg whitespace-nowrap">
            <p>
              {new Date(tooltipInfo.date + "T12:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="opacity-80">
              {tooltipInfo.count} / {habit.target} {habit.unit}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function HabitsPage() {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    getStreak,
    getCompletionForDate,
    getOverallCompletionRate,
  } = useHabitStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-select first habit if none selected
  useEffect(() => {
    if (mounted && habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
    if (mounted && habits.length > 0 && selectedHabitId) {
      const exists = habits.some((h) => h.id === selectedHabitId);
      if (!exists) setSelectedHabitId(habits[0]?.id || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, habits.length]);

  const handleCreate = useCallback(() => {
    setEditingHabit(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    (data: HabitFormData) => {
      if (editingHabit) {
        updateHabit(editingHabit.id, data);
      } else {
        addHabit(data);
      }
      setModalOpen(false);
      setEditingHabit(null);
    },
    [editingHabit, addHabit, updateHabit]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      deleteHabit(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteHabit]);

  // Computed stats
  const stats = useMemo(() => {
    if (!mounted || habits.length === 0) {
      return {
        totalHabits: 0,
        avgCompletion: 0,
        bestStreak: 0,
        weekCompletions: 0,
      };
    }

    const today = new Date();
    const todayStr = formatDate(today);

    // Best streak
    let bestStreak = 0;
    habits.forEach((h) => {
      const s = getStreak(h.id);
      if (s > bestStreak) bestStreak = s;
    });

    // Weekly completions
    let weekCompletions = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      habits.forEach((h) => {
        const count = getCompletionForDate(h.id, dateStr);
        if (count >= h.target) weekCompletions++;
      });
    }

    return {
      totalHabits: habits.length,
      avgCompletion: getOverallCompletionRate(),
      bestStreak,
      weekCompletions,
    };
  }, [mounted, habits, getStreak, getCompletionForDate, getOverallCompletionRate]);

  const selectedHabit = useMemo(
    () => habits.find((h) => h.id === selectedHabitId) || null,
    [habits, selectedHabitId]
  );

  if (!mounted) {
    return (
      <div className="flex-1 p-6">
        <div className="h-8 w-48 rounded-xl bg-[hsl(var(--muted))] animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-[hsl(var(--muted))] animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-[hsl(var(--muted))] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <PageHeader
        title="Habits"
        description="Track your daily habits and build streaks"
      >
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.25)]"
        >
          <Plus size={16} />
          New Habit
        </button>
      </PageHeader>

      {habits.length === 0 ? (
        <EmptyState
          icon="Target"
          title="No habits yet"
          description="Create your first habit to start tracking your daily progress and building consistency."
          action={{ label: "Create Habit", onClick: handleCreate }}
        />
      ) : (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon="Target"
              title="Total Habits"
              value={stats.totalHabits}
              subtitle="Active habits"
            />
            <StatCard
              icon="TrendingUp"
              title="Today's Progress"
              value={`${stats.avgCompletion}%`}
              subtitle="Average completion"
            />
            <StatCard
              icon="Flame"
              title="Best Streak"
              value={stats.bestStreak}
              subtitle="Consecutive days"
            />
            <StatCard
              icon="Award"
              title="This Week"
              value={stats.weekCompletions}
              subtitle="Completions"
            />
          </div>

          {/* Habit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={handleEdit}
                onDelete={(h) => setDeleteTarget(h)}
                onSelect={setSelectedHabitId}
                isSelected={selectedHabitId === habit.id}
              />
            ))}
          </div>

          {/* Heatmap */}
          {selectedHabit && <HabitHeatmap habit={selectedHabit} />}
        </>
      )}

      {/* Create/Edit Modal */}
      <HabitFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={
          editingHabit
            ? {
                name: editingHabit.name,
                icon: editingHabit.icon,
                color: editingHabit.color,
                target: editingHabit.target,
                unit: editingHabit.unit,
              }
            : undefined
        }
        isEditing={!!editingHabit}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Habit"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? All tracking data will be permanently lost.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
