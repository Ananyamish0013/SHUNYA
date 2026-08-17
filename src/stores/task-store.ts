import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Priority } from "@/lib/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  getTasksByDate: (date: string) => Task[];
  getTasksByDateRange: (start: string, end: string) => Task[];
  getCompletedCount: () => number;
  getPendingCount: () => number;
  getTasksByPriority: (priority: Priority) => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (taskData) => {
        const now = new Date().toISOString();
        const task: Task = {
          ...taskData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      getTasksByDate: (date) => {
        return get().tasks.filter((t) => t.date === date);
      },

      getTasksByDateRange: (start, end) => {
        return get().tasks.filter((t) => t.date >= start && t.date <= end);
      },

      getCompletedCount: () => {
        return get().tasks.filter((t) => t.completed).length;
      },

      getPendingCount: () => {
        return get().tasks.filter((t) => !t.completed).length;
      },

      getTasksByPriority: (priority) => {
        return get().tasks.filter((t) => t.priority === priority);
      },
    }),
    {
      name: "productivity-tasks",
    }
  )
);
