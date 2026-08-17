import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FocusSession } from "@/lib/types";
import { POMODORO_DEFAULTS } from "@/lib/constants";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

interface FocusStore {
  sessions: FocusSession[];
  isRunning: boolean;
  isPaused: boolean;
  currentType: "work" | "break";
  timeRemaining: number;
  sessionCount: number;
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  currentSessionStart: string | null;

  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;
  tick: () => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;

  getDailyFocus: (date?: string) => number;
  getWeeklyFocus: () => number;
  getMonthlyFocus: () => number;
  getTodaySessions: () => FocusSession[];
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      isRunning: false,
      isPaused: false,
      currentType: "work",
      timeRemaining: POMODORO_DEFAULTS.workDuration * 60,
      sessionCount: 0,
      workDuration: POMODORO_DEFAULTS.workDuration,
      breakDuration: POMODORO_DEFAULTS.breakDuration,
      longBreakDuration: POMODORO_DEFAULTS.longBreakDuration,
      sessionsBeforeLongBreak: POMODORO_DEFAULTS.sessionsBeforeLongBreak,
      currentSessionStart: null,

      startTimer: () => {
        set({
          isRunning: true,
          isPaused: false,
          currentSessionStart: new Date().toISOString(),
        });
      },

      pauseTimer: () => {
        set({ isPaused: true });
      },

      resumeTimer: () => {
        set({ isPaused: false });
      },

      resetTimer: () => {
        const state = get();
        set({
          isRunning: false,
          isPaused: false,
          timeRemaining:
            state.currentType === "work"
              ? state.workDuration * 60
              : state.breakDuration * 60,
          currentSessionStart: null,
        });
      },

      completeSession: () => {
        const state = get();
        const now = new Date();
        const session: FocusSession = {
          id: generateId(),
          startTime: state.currentSessionStart || now.toISOString(),
          endTime: now.toISOString(),
          duration:
            state.currentType === "work"
              ? state.workDuration
              : state.breakDuration,
          type: state.currentType,
          date: formatDate(now),
        };

        const newSessionCount =
          state.currentType === "work"
            ? state.sessionCount + 1
            : state.sessionCount;

        let nextType: "work" | "break";
        let nextDuration: number;

        if (state.currentType === "work") {
          if (newSessionCount % state.sessionsBeforeLongBreak === 0) {
            nextType = "break";
            nextDuration = state.longBreakDuration;
          } else {
            nextType = "break";
            nextDuration = state.breakDuration;
          }
        } else {
          nextType = "work";
          nextDuration = state.workDuration;
        }

        set({
          sessions: [...state.sessions, session],
          sessionCount: newSessionCount,
          currentType: nextType,
          timeRemaining: nextDuration * 60,
          isRunning: false,
          isPaused: false,
          currentSessionStart: null,
        });
      },

      tick: () => {
        const state = get();
        if (!state.isRunning || state.isPaused) return;

        if (state.timeRemaining <= 1) {
          state.completeSession();
        } else {
          set({ timeRemaining: state.timeRemaining - 1 });
        }
      },

      setWorkDuration: (minutes) => {
        set((state) => ({
          workDuration: minutes,
          timeRemaining:
            state.currentType === "work" && !state.isRunning
              ? minutes * 60
              : state.timeRemaining,
        }));
      },

      setBreakDuration: (minutes) => {
        set((state) => ({
          breakDuration: minutes,
          timeRemaining:
            state.currentType === "break" && !state.isRunning
              ? minutes * 60
              : state.timeRemaining,
        }));
      },

      getDailyFocus: (date) => {
        const targetDate = date || formatDate(new Date());
        return get()
          .sessions.filter((s) => s.date === targetDate && s.type === "work")
          .reduce((sum, s) => sum + s.duration, 0);
      },

      getWeeklyFocus: () => {
        const today = new Date();
        let total = 0;
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          total += get().getDailyFocus(formatDate(date));
        }
        return total;
      },

      getMonthlyFocus: () => {
        const today = new Date();
        let total = 0;
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          total += get().getDailyFocus(formatDate(date));
        }
        return total;
      },

      getTodaySessions: () => {
        const today = formatDate(new Date());
        return get().sessions.filter((s) => s.date === today);
      },
    }),
    {
      name: "productivity-focus",
      partialize: (state) => ({
        sessions: state.sessions,
        sessionCount: state.sessionCount,
        workDuration: state.workDuration,
        breakDuration: state.breakDuration,
        longBreakDuration: state.longBreakDuration,
        sessionsBeforeLongBreak: state.sessionsBeforeLongBreak,
      }),
    }
  )
);
