import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings } from "@/lib/types";

interface SettingsStore extends AppSettings {
  setFontScale: (scale: number) => void;
  setCompactMode: (compact: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  fontScale: 100,
  compactMode: false,
  sidebarWidth: 260,
  sidebarCollapsed: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setFontScale: (scale) => set({ fontScale: scale }),

      setCompactMode: (compact) => set({ compactMode: compact }),

      setSidebarWidth: (width) => set({ sidebarWidth: width }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "productivity-settings",
    }
  )
);
