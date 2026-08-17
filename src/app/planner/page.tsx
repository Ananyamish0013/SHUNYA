"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  GripVertical,
  Calendar,
  Check,
} from "lucide-react";
import { useTaskStore } from "@/stores/task-store";
import { PageHeader } from "@/components/layout/header";
import type { Priority, Task } from "@/lib/types";

/* ─────────────── Date Helpers ─────────────── */

function getMondayOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const startMonth = monthNames[monday.getMonth()];
  const endMonth = monthNames[sunday.getMonth()];
  const startDay = monday.getDate();
  const endDay = sunday.getDate();
  const year = sunday.getFullYear();

  if (monday.getMonth() === sunday.getMonth()) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PRIORITY_COLORS: Record<Priority, string> = {
  low: "rgb(34 197 94)",
  medium: "rgb(234 179 8)",
  high: "rgb(239 68 68)",
};

const PRIORITY_BG: Record<Priority, string> = {
  low: "rgb(34 197 94 / 0.1)",
  medium: "rgb(234 179 8 / 0.1)",
  high: "rgb(239 68 68 / 0.1)",
};

/* ─────────────── Task Dialog ─────────────── */

interface TaskDialogProps {
  isOpen: boolean;
  task: Partial<Task> | null;
  date: string;
  onSave: (data: {
    title: string;
    description: string;
    priority: Priority;
    category: string;
    date: string;
  }) => void;
  onCancel: () => void;
}

function TaskDialog({ isOpen, task, date, onSave, onCancel }: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setPriority(task?.priority ?? "medium");
      setCategory(task?.category ?? "");
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim(),
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
        >
          <X size={16} />
        </button>

        <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-5">
          {task?.id ? "Edit Task" : "New Task"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">
              Title
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all duration-200 resize-none"
            />
          </div>

          {/* Priority & Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all duration-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1.5">
                Category
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Work, Personal"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3.5 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-xl px-5 py-2 text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {task?.id ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────── Task Card ─────────────── */

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <div
      className="group relative rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-200 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.08)] overflow-hidden"
      style={{ borderLeftWidth: "3px", borderLeftColor: PRIORITY_COLORS[task.priority] }}
    >
      <div className="flex items-start gap-2 p-3">
        {/* Drag handle */}
        <div className="mt-0.5 cursor-grab text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-60 transition-opacity duration-200">
          <GripVertical size={14} />
        </div>

        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
            task.completed
              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]"
              : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]"
          }`}
          style={{ height: "18px", width: "18px" }}
        >
          {task.completed && (
            <Check size={12} className="text-[hsl(var(--primary-foreground))]" />
          )}
        </button>

        {/* Content */}
        <button
          onClick={() => onEdit(task)}
          className="flex-1 min-w-0 text-left"
        >
          <span
            className={`block text-sm leading-snug transition-all duration-200 ${
              task.completed
                ? "text-[hsl(var(--muted-foreground))] line-through"
                : "text-[hsl(var(--card-foreground))]"
            }`}
          >
            {task.title}
          </span>
          {task.category && (
            <span
              className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{
                color: PRIORITY_COLORS[task.priority],
                backgroundColor: PRIORITY_BG[task.priority],
              }}
            >
              {task.category}
            </span>
          )}
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(task.id)}
          className="mt-0.5 shrink-0 rounded-lg p-0.5 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[hsl(var(--destructive))]"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Quick Add ─────────────── */

interface QuickAddProps {
  onAdd: (title: string) => void;
  onOpenDialog: () => void;
}

function QuickAdd({ onAdd, onOpenDialog }: QuickAddProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add task..."
          className="flex-1 min-w-0 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all duration-200"
        />
        <button
          type="button"
          onClick={onOpenDialog}
          className="shrink-0 rounded-xl p-2 text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-all duration-200"
          title="Add with details"
        >
          <Plus size={14} />
        </button>
      </div>
    </form>
  );
}

/* ─────────────── Day Column ─────────────── */

interface DayColumnProps {
  date: Date;
  isToday: boolean;
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onQuickAdd: (title: string, dateKey: string) => void;
  onOpenDialog: (dateKey: string) => void;
}

function DayColumn({
  date,
  isToday,
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onQuickAdd,
  onOpenDialog,
}: DayColumnProps) {
  const dayIndex = (date.getDay() + 6) % 7; // 0=Mon … 6=Sun
  const dateKey = formatDateKey(date);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col min-w-[180px] w-full">
      {/* Column Header */}
      <div
        className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-3 mb-3 transition-all duration-200 ${
          isToday
            ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg shadow-[hsl(var(--primary)/0.25)]"
            : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
        }`}
      >
        <span className="text-xs font-medium uppercase tracking-wider opacity-80">
          {DAY_NAMES[dayIndex]}
        </span>
        <span className="text-xl font-bold">{date.getDate()}</span>
        {tasks.length > 0 && (
          <span className={`text-[10px] font-medium ${isToday ? "opacity-75" : "text-[hsl(var(--muted-foreground))]"}`}>
            {completedCount}/{tasks.length} done
          </span>
        )}
      </div>

      {/* Tasks scroll area */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 min-h-[200px] max-h-[calc(100vh-320px)]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-[hsl(var(--muted-foreground))]">
            <Calendar size={20} className="mb-1.5 opacity-40" />
            <span className="text-xs opacity-60">No tasks</span>
          </div>
        )}
      </div>

      {/* Quick-add input */}
      <QuickAdd
        onAdd={(title) => onQuickAdd(title, dateKey)}
        onOpenDialog={() => onOpenDialog(dateKey)}
      />
    </div>
  );
}

/* ─────────────── Main Planner Page ─────────────── */

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  const [currentMonday, setCurrentMonday] = useState<Date>(() =>
    getMondayOfWeek(new Date())
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState<string>("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTaskStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayKey = formatDateKey(new Date());
  const weekDays = getWeekDays(currentMonday);
  const weekStart = formatDateKey(weekDays[0]);
  const weekEnd = formatDateKey(weekDays[6]);

  // Get tasks for current week
  const weekTasks = tasks.filter((t) => t.date >= weekStart && t.date <= weekEnd);

  const getTasksForDate = useCallback(
    (dateKey: string) =>
      weekTasks
        .filter((t) => t.date === dateKey)
        .sort((a, b) => {
          // Incomplete first, then by priority, then by creation
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          const prio: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
          if (prio[a.priority] !== prio[b.priority])
            return prio[a.priority] - prio[b.priority];
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }),
    [weekTasks]
  );

  const goToPrevWeek = () =>
    setCurrentMonday((m) => addDays(m, -7));

  const goToNextWeek = () =>
    setCurrentMonday((m) => addDays(m, 7));

  const goToToday = () =>
    setCurrentMonday(getMondayOfWeek(new Date()));

  const handleQuickAdd = (title: string, dateKey: string) => {
    addTask({
      title,
      description: "",
      date: dateKey,
      completed: false,
      priority: "medium",
      category: "",
    });
  };

  const handleOpenDialog = (dateKey: string) => {
    setDialogDate(dateKey);
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setDialogDate(task.date);
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDialogSave = (data: {
    title: string;
    description: string;
    priority: Priority;
    category: string;
    date: string;
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask({
        ...data,
        completed: false,
      });
    }
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  // SSR guard
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Stats
  const totalWeekTasks = weekTasks.length;
  const completedWeekTasks = weekTasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Weekly Planner"
        description="Plan and organize your week ahead"
      >
        {/* Week stats pill */}
        {totalWeekTasks > 0 && (
          <div className="flex items-center gap-1.5 rounded-xl bg-[hsl(var(--muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
            <Check size={12} />
            {completedWeekTasks}/{totalWeekTasks} tasks
          </div>
        )}
      </PageHeader>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevWeek}
            className="rounded-xl p-2 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all duration-200"
            aria-label="Previous week"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToNextWeek}
            className="rounded-xl p-2 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all duration-200"
            aria-label="Next week"
          >
            <ChevronRight size={18} />
          </button>
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] ml-2">
            {formatWeekRange(currentMonday)}
          </h2>
        </div>

        <button
          onClick={goToToday}
          className="rounded-xl px-4 py-2 text-sm font-medium border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all duration-200 flex items-center gap-1.5"
        >
          <Calendar size={14} />
          Today
        </button>
      </div>

      {/* 7-Day Grid */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="grid grid-cols-7 gap-3 min-w-[1260px]">
          {weekDays.map((day) => {
            const dateKey = formatDateKey(day);
            return (
              <DayColumn
                key={dateKey}
                date={day}
                isToday={dateKey === todayKey}
                tasks={getTasksForDate(dateKey)}
                onToggle={toggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onQuickAdd={handleQuickAdd}
                onOpenDialog={handleOpenDialog}
              />
            );
          })}
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={dialogOpen}
        task={editingTask}
        date={dialogDate}
        onSave={handleDialogSave}
        onCancel={() => {
          setDialogOpen(false);
          setEditingTask(null);
        }}
      />
    </div>
  );
}
