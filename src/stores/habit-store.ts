import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Habit } from "@/lib/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

interface HabitStore {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "completions">) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  logCompletion: (habitId: string, date: string, count?: number) => void;
  removeCompletion: (habitId: string, date: string) => void;
  getStreak: (habitId: string) => number;
  getWeeklyCompletion: (habitId: string) => number;
  getMonthlyCompletion: (habitId: string) => number;
  getOverallCompletionRate: () => number;
  getCompletionForDate: (habitId: string, date: string) => number;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],

      addHabit: (habitData) => {
        const habit: Habit = {
          ...habitData,
          id: generateId(),
          completions: {},
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ habits: [...state.habits, habit] }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },

      logCompletion: (habitId, date, count = 1) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== habitId) return h;
            const current = h.completions[date] || 0;
            return {
              ...h,
              completions: {
                ...h.completions,
                [date]: Math.min(current + count, h.target),
              },
            };
          }),
        }));
      },

      removeCompletion: (habitId, date) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== habitId) return h;
            const current = h.completions[date] || 0;
            if (current <= 0) return h;
            return {
              ...h,
              completions: {
                ...h.completions,
                [date]: current - 1,
              },
            };
          }),
        }));
      },

      getStreak: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return 0;

        let streak = 0;
        const today = new Date();
        const current = new Date(today);

        while (true) {
          const dateStr = formatDate(current);
          const completion = habit.completions[dateStr] || 0;
          if (completion >= habit.target) {
            streak++;
            current.setDate(current.getDate() - 1);
          } else {
            break;
          }
        }
        return streak;
      },

      getWeeklyCompletion: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return 0;

        const today = new Date();
        let completed = 0;
        let total = 0;

        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = formatDate(date);
          const completion = habit.completions[dateStr] || 0;
          completed += Math.min(completion, habit.target);
          total += habit.target;
        }

        return total > 0 ? Math.round((completed / total) * 100) : 0;
      },

      getMonthlyCompletion: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return 0;

        const today = new Date();
        let completed = 0;
        let total = 0;

        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = formatDate(date);
          const completion = habit.completions[dateStr] || 0;
          completed += Math.min(completion, habit.target);
          total += habit.target;
        }

        return total > 0 ? Math.round((completed / total) * 100) : 0;
      },

      getOverallCompletionRate: () => {
        const habits = get().habits;
        if (habits.length === 0) return 0;

        const today = formatDate(new Date());
        let completed = 0;
        let total = 0;

        habits.forEach((habit) => {
          const completion = habit.completions[today] || 0;
          completed += Math.min(completion, habit.target);
          total += habit.target;
        });

        return total > 0 ? Math.round((completed / total) * 100) : 0;
      },

      getCompletionForDate: (habitId, date) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return 0;
        return habit.completions[date] || 0;
      },
    }),
    {
      name: "productivity-habits",
    }
  )
);
