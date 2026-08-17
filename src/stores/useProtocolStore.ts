import { create } from "zustand";

interface ProtocolStore {
  completedProtocolIds: string[];
  markCompleted: (id: string) => void;
  markUncompleted: (id: string) => void;
  toggleCompleted: (id: string) => void;
  isCompleted: (id: string) => boolean;
  hydrated: boolean;
  initStore: () => void;
}

const STORAGE_KEY = "zero_day_completed_protocols";

export const useProtocolStore = create<ProtocolStore>((set, get) => ({
  completedProtocolIds: [],
  hydrated: false,

  initStore: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ completedProtocolIds: parsed, hydrated: true });
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load completed protocols from localStorage", e);
    }
    set({ hydrated: true });
  },

  markCompleted: (id: string) => {
    const current = get().completedProtocolIds;
    if (!current.includes(id)) {
      const next = [...current, id];
      set({ completedProtocolIds: next });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error("Failed to save to localStorage", e);
        }
      }
    }
  },

  markUncompleted: (id: string) => {
    const current = get().completedProtocolIds;
    const next = current.filter((item) => item !== id);
    set({ completedProtocolIds: next });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }
    }
  },

  toggleCompleted: (id: string) => {
    if (get().isCompleted(id)) {
      get().markUncompleted(id);
    } else {
      get().markCompleted(id);
    }
  },

  isCompleted: (id: string) => {
    return get().completedProtocolIds.includes(id);
  },
}));
