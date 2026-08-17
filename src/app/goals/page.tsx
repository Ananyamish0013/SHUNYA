"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  Flag,
  Milestone as MilestoneIcon,
  CircleDot,
} from "lucide-react";
import type { GoalType } from "@/lib/types";
import { useGoalStore } from "@/stores/goal-store";
import { ProgressRing } from "@/components/shared/progress-ring";
import { PageHeader } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatCard } from "@/components/shared/stat-card";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GOAL_TABS = ["all", "annual", "quarterly", "monthly", "weekly"] as const;
type TabValue = (typeof GOAL_TABS)[number];

const TYPE_BADGE_CLASSES: Record<GoalType, string> = {
  annual: "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]",
  quarterly: "bg-[hsl(var(--chart2)/0.12)] text-[hsl(var(--chart2))]",
  monthly: "bg-[hsl(var(--chart3)/0.12)] text-[hsl(var(--chart3))]",
  weekly: "bg-[hsl(var(--chart4)/0.12)] text-[hsl(var(--chart4))]",
};

const TYPE_BAR_COLORS: Record<GoalType, string> = {
  annual: "hsl(var(--primary))",
  quarterly: "hsl(var(--chart2))",
  monthly: "hsl(var(--chart3))",
  weekly: "hsl(var(--chart4))",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysRemaining(deadline: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function deadlineLabel(deadline: string): string {
  const days = daysRemaining(deadline);
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

function deadlineColorClass(deadline: string): string {
  const days = daysRemaining(deadline);
  if (days < 0) return "text-[hsl(var(--destructive))]";
  if (days <= 3) return "text-[hsl(var(--chart5))]";
  return "text-[hsl(var(--muted-foreground))]";
}

// ---------------------------------------------------------------------------
// Create / Edit Goal Modal
// ---------------------------------------------------------------------------

interface GoalFormData {
  title: string;
  description: string;
  type: GoalType;
  deadline: string;
  notes: string;
}

const EMPTY_FORM: GoalFormData = {
  title: "",
  description: "",
  type: "quarterly",
  deadline: "",
  notes: "",
};

function GoalFormModal({
  isOpen,
  initialData,
  onSave,
  onCancel,
}: {
  isOpen: boolean;
  initialData?: GoalFormData;
  onSave: (data: GoalFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<GoalFormData>(initialData ?? EMPTY_FORM);

  useEffect(() => {
    setForm(initialData ?? EMPTY_FORM);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isValid = form.title.trim().length > 0 && form.deadline.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
        >
          <X size={16} />
        </button>

        <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-5">
          {initialData ? "Edit Goal" : "Create New Goal"}
        </h3>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter goal title..."
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe your goal..."
              rows={3}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-colors resize-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)]"
            />
          </div>

          {/* Type + Deadline row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
                Type
              </label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as GoalType })
                  }
                  className="w-full appearance-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 pr-10 text-sm text-[hsl(var(--foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] capitalize"
                >
                  <option value="annual">Annual</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--card-foreground))] mb-1.5">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-colors resize-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
          >
            Cancel
          </button>
          <button
            onClick={() => isValid && onSave(form)}
            disabled={!isValid}
            className="rounded-xl px-5 py-2 text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? "Save Changes" : "Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Goal Card
// ---------------------------------------------------------------------------

function GoalCard({
  goal,
  onEdit,
  onDelete,
}: {
  goal: import("@/lib/types").Goal;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { toggleMilestone, addMilestone, deleteMilestone } = useGoalStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");

  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  const barColor = TYPE_BAR_COLORS[goal.type];

  function handleAddMilestone() {
    const title = newMilestone.trim();
    if (!title) return;
    addMilestone(goal.id, title);
    setNewMilestone("");
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.08)] hover:-translate-y-0.5">
      {/* Decorative top accent */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: barColor }}
      />

      <div className="p-6">
        {/* ---- Header ---- */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-[hsl(var(--card-foreground))] truncate">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                {goal.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${TYPE_BADGE_CLASSES[goal.type]}`}
            >
              {goal.type}
            </span>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--card-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--destructive))] transition-colors hover:bg-[hsl(var(--muted))]"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---- Progress Section ---- */}
        <div className="mb-5">
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-[hsl(var(--card-foreground))]">
              {goal.progress}%
            </span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              {completedMilestones} of {goal.milestones.length} milestones
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${goal.progress}%`,
                backgroundColor: barColor,
              }}
            />
          </div>
        </div>

        {/* ---- Milestones Checklist ---- */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Flag size={14} className="text-[hsl(var(--muted-foreground))]" />
            <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Milestones
            </span>
          </div>

          {goal.milestones.length > 0 ? (
            <ul className="space-y-1.5 mb-3">
              {goal.milestones.map((m) => (
                <li
                  key={m.id}
                  className="group/item flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-[hsl(var(--muted)/0.5)]"
                >
                  <button
                    onClick={() => toggleMilestone(goal.id, m.id)}
                    className="shrink-0"
                  >
                    {m.completed ? (
                      <CheckCircle2
                        size={18}
                        className="text-[hsl(var(--primary))]"
                      />
                    ) : (
                      <CircleDot
                        size={18}
                        className="text-[hsl(var(--muted-foreground))]"
                      />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      m.completed
                        ? "line-through text-[hsl(var(--muted-foreground))]"
                        : "text-[hsl(var(--card-foreground))]"
                    }`}
                  >
                    {m.title}
                  </span>
                  <button
                    onClick={() => deleteMilestone(goal.id, m.id)}
                    className="shrink-0 rounded-md p-0.5 text-[hsl(var(--muted-foreground))] opacity-0 group-hover/item:opacity-100 transition-opacity hover:text-[hsl(var(--destructive))]"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3 italic">
              No milestones yet
            </p>
          )}

          {/* Add milestone input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()}
              placeholder="Add a milestone..."
              className="flex-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))]"
            />
            <button
              onClick={handleAddMilestone}
              disabled={!newMilestone.trim()}
              className="rounded-lg p-1.5 text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--primary)/0.1)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* ---- Footer ---- */}
        <div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-4">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${deadlineColorClass(goal.deadline)}`}
          >
            <Calendar size={13} />
            <span>{deadlineLabel(goal.deadline)}</span>
          </div>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Created {formatDate(goal.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function GoalsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

  const { goals, addGoal, updateGoal, deleteGoal, getAverageProgress } =
    useGoalStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derived data
  const filteredGoals = useMemo(
    () =>
      activeTab === "all"
        ? goals
        : goals.filter((g) => g.type === activeTab),
    [goals, activeTab]
  );

  const tabCounts = useMemo(() => {
    const counts: Record<TabValue, number> = {
      all: goals.length,
      annual: 0,
      quarterly: 0,
      monthly: 0,
      weekly: 0,
    };
    goals.forEach((g) => {
      counts[g.type] += 1;
    });
    return counts;
  }, [goals]);

  const completedGoals = useMemo(
    () => goals.filter((g) => g.progress === 100).length,
    [goals]
  );

  const upcomingDeadlines = useMemo(
    () =>
      goals.filter((g) => {
        const days = daysRemaining(g.deadline);
        return days >= 0 && days <= 7 && g.progress < 100;
      }).length,
    [goals]
  );

  const avgProgress = useMemo(() => getAverageProgress(), [goals, getAverageProgress]);

  // Editing helpers
  const editingGoal = editingGoalId
    ? goals.find((g) => g.id === editingGoalId)
    : null;

  const editFormData: GoalFormData | undefined = editingGoal
    ? {
        title: editingGoal.title,
        description: editingGoal.description,
        type: editingGoal.type,
        deadline: editingGoal.deadline,
        notes: editingGoal.notes,
      }
    : undefined;

  function handleSave(data: GoalFormData) {
    if (editingGoalId) {
      updateGoal(editingGoalId, data);
      setEditingGoalId(null);
    } else {
      addGoal(data);
    }
    setShowForm(false);
  }

  function handleConfirmDelete() {
    if (deleteGoalId) {
      deleteGoal(deleteGoalId);
      setDeleteGoalId(null);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      {/* Header */}
      <PageHeader
        title="Goals"
        description="Track your objectives and milestones across every time horizon."
      >
        <button
          onClick={() => {
            setEditingGoalId(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.25)]"
        >
          <Plus size={16} />
          New Goal
        </button>
      </PageHeader>

      {/* Stats Overview */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Goals"
            value={goals.length}
            icon="Target"
            subtitle="Across all types"
          />
          <div className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.08)] hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary)/0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center gap-4">
              <ProgressRing
                progress={avgProgress}
                size={64}
                strokeWidth={5}
                color="hsl(var(--primary))"
              >
                <span className="text-xs font-bold text-[hsl(var(--card-foreground))]">
                  {avgProgress}%
                </span>
              </ProgressRing>
              <div>
                <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-0.5">
                  Avg. Progress
                </p>
                <p className="text-2xl font-bold text-[hsl(var(--card-foreground))] tracking-tight">
                  {avgProgress}%
                </p>
              </div>
            </div>
          </div>
          <StatCard
            title="Completed"
            value={completedGoals}
            icon="CheckCircle2"
            subtitle={`${goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0}% completion rate`}
          />
          <StatCard
            title="Upcoming Deadlines"
            value={upcomingDeadlines}
            icon="Clock"
            subtitle="Due within 7 days"
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(var(--muted)/0.5)] mb-6 overflow-x-auto w-fit">
        {GOAL_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all duration-200 whitespace-nowrap ${
              activeTab === tab
                ? "bg-[hsl(var(--card))] text-[hsl(var(--primary))] shadow-sm"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            {tab}
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-xs font-semibold ${
                activeTab === tab
                  ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              }`}
            >
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Goal Cards Grid or Empty State */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon="Target"
          title={
            activeTab === "all"
              ? "No goals yet"
              : `No ${activeTab} goals`
          }
          description={
            activeTab === "all"
              ? "Create your first goal and start tracking milestones toward your objectives."
              : `You haven't created any ${activeTab} goals. Add one to get started.`
          }
          action={{
            label: "Create Goal",
            onClick: () => {
              setEditingGoalId(null);
              setShowForm(true);
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => {
                setEditingGoalId(goal.id);
                setShowForm(true);
              }}
              onDelete={() => setDeleteGoalId(goal.id)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <GoalFormModal
        isOpen={showForm}
        initialData={editFormData}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingGoalId(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteGoalId !== null}
        title="Delete Goal"
        description="Are you sure you want to delete this goal? All milestones and progress data will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteGoalId(null)}
      />
    </div>
  );
}
