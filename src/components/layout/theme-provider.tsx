"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/theme-store";
import { getTheme, applyTheme } from "@/lib/themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const currentTheme = useThemeStore((s) => s.currentTheme);

  useEffect(() => {
    const theme = getTheme(currentTheme);
    applyTheme(theme);
    setMounted(true);
  }, [currentTheme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
