import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeName } from "@/lib/types";
import { getTheme, applyTheme } from "@/lib/themes";

interface ThemeStore {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: "lilac",

      setTheme: (theme) => {
        const themeDefinition = getTheme(theme);
        applyTheme(themeDefinition);
        set({ currentTheme: theme });
      },
    }),
    {
      name: "productivity-theme",
    }
  )
);
