import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Goal, Milestone } from "@/lib/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

interface GoalStore {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "milestones" | "progress">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  updateProgress: (goalId: string) => void;
  getGoalsByType: (type: string) => Goal[];
  getAverageProgress: () => number;
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (goalData) => {
        const now = new Date().toISOString();
        const goal: Goal = {
          ...goalData,
          id: generateId(),
          progress: 0,
          milestones: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ goals: [...state.goals, goal] }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? { ...g, ...updates, updatedAt: new Date().toISOString() }
              : g
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },

      addMilestone: (goalId, title) => {
        const milestone: Milestone = {
          id: generateId(),
          title,
          completed: false,
        };
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const updatedMilestones = [...g.milestones, milestone];
            const completedCount = updatedMilestones.filter(
              (m) => m.completed
            ).length;
            const progress =
              updatedMilestones.length > 0
                ? Math.round((completedCount / updatedMilestones.length) * 100)
                : 0;
            return {
              ...g,
              milestones: updatedMilestones,
              progress,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      toggleMilestone: (goalId, milestoneId) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const updatedMilestones = g.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            );
            const completedCount = updatedMilestones.filter(
              (m) => m.completed
            ).length;
            const progress =
              updatedMilestones.length > 0
                ? Math.round((completedCount / updatedMilestones.length) * 100)
                : 0;
            return {
              ...g,
              milestones: updatedMilestones,
              progress,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteMilestone: (goalId, milestoneId) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const updatedMilestones = g.milestones.filter(
              (m) => m.id !== milestoneId
            );
            const completedCount = updatedMilestones.filter(
              (m) => m.completed
            ).length;
            const progress =
              updatedMilestones.length > 0
                ? Math.round((completedCount / updatedMilestones.length) * 100)
                : 0;
            return {
              ...g,
              milestones: updatedMilestones,
              progress,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateProgress: (goalId) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const completedCount = g.milestones.filter(
              (m) => m.completed
            ).length;
            const progress =
              g.milestones.length > 0
                ? Math.round((completedCount / g.milestones.length) * 100)
                : 0;
            return { ...g, progress, updatedAt: new Date().toISOString() };
          }),
        }));
      },

      getGoalsByType: (type) => {
        return get().goals.filter((g) => g.type === type);
      },

      getAverageProgress: () => {
        const goals = get().goals;
        if (goals.length === 0) return 0;
        const total = goals.reduce((sum, g) => sum + g.progress, 0);
        return Math.round(total / goals.length);
      },
    }),
    {
      name: "productivity-goals",
    }
  )
);
