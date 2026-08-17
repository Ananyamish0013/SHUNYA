"use client";

import { useState, useEffect, useRef } from "react";
import {
  Palette,
  Monitor,
  Database,
  Download,
  Upload,
  Trash2,
  Check,
  Sun,
  Moon,
  SlidersHorizontal,
  PanelLeftClose,
  Type,
  Minimize2,
} from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useTaskStore } from "@/stores/task-store";
import { useHabitStore } from "@/stores/habit-store";
import { useGoalStore } from "@/stores/goal-store";
import { useNoteStore } from "@/stores/note-store";
import { useFocusStore } from "@/stores/focus-store";
import { PageHeader } from "@/components/layout/header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { themeList } from "@/lib/themes";
import type { ThemeName } from "@/lib/types";

const THEME_PREVIEW_COLORS: Record<
  string,
  { primary: string; secondary: string; accent: string; bg: string }
> = {
  lilac: {
    primary: "#9F7AEA",
    secondary: "#C8A2FF",
    accent: "#E9D8FD",
    bg: "#FAF5FF",
  },
  pink: {
    primary: "#EC4899",
    secondary: "#F472B6",
    accent: "#FCE7F3",
    bg: "#FFF1F2",
  },
  "dark-blue": {
    primary: "#3B82F6",
    secondary: "#60A5FA",
    accent: "#1E3A5F",
    bg: "#0F172A",
  },
  "dark-mode": {
    primary: "#A78BFA",
    secondary: "#7C3AED",
    accent: "#2D1B69",
    bg: "#09090B",
  },
  emerald: {
    primary: "#10B981",
    secondary: "#34D399",
    accent: "#D1FAE5",
    bg: "#ECFDF5",
  },
  sunset: {
    primary: "#F97316",
    secondary: "#FB923C",
    accent: "#FED7AA",
    bg: "#FFF7ED",
  },
};

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentTheme, setTheme } = useThemeStore();
  const {
    fontScale,
    compactMode,
    sidebarCollapsed,
    setFontScale,
    setCompactMode,
    setSidebarCollapsed,
  } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const exportData = () => {
    const data = {
      tasks: useTaskStore.getState().tasks,
      habits: useHabitStore.getState().habits,
      goals: useGoalStore.getState().goals,
      notes: useNoteStore.getState().notes,
      focusSessions: useFocusStore.getState().sessions,
      theme: currentTheme,
      settings: {
        fontScale,
        compactMode,
        sidebarCollapsed,
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `productivity-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.tasks) {
          useTaskStore.setState({ tasks: data.tasks });
        }
        if (data.habits) {
          useHabitStore.setState({ habits: data.habits });
        }
        if (data.goals) {
          useGoalStore.setState({ goals: data.goals });
        }
        if (data.notes) {
          useNoteStore.setState({ notes: data.notes });
        }
        if (data.focusSessions) {
          useFocusStore.setState({ sessions: data.focusSessions });
        }
        if (data.theme) {
          setTheme(data.theme);
        }
        if (data.settings) {
          if (data.settings.fontScale) setFontScale(data.settings.fontScale);
          if (data.settings.compactMode !== undefined)
            setCompactMode(data.settings.compactMode);
        }
        alert("Data imported successfully!");
      } catch {
        alert("Invalid backup file. Please check the file format.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearAllData = () => {
    useTaskStore.setState({ tasks: [] });
    useHabitStore.setState({ habits: [] });
    useGoalStore.setState({ goals: [] });
    useNoteStore.setState({ notes: [] });
    useFocusStore.setState({ sessions: [], sessionCount: 0 });
    setClearConfirm(false);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Customize your experience"
      />

      <div className="max-w-3xl space-y-8">
        {/* Appearance */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)]">
              <Palette size={20} className="text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[hsl(var(--card-foreground))]">
                Appearance
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Choose your preferred theme
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {themeList.map((theme) => {
              const colors = THEME_PREVIEW_COLORS[theme.name];
              const isActive = currentTheme === theme.name;
              return (
                <button
                  key={theme.name}
                  onClick={() => setTheme(theme.name as ThemeName)}
                  className={`group relative rounded-2xl border-2 p-4 transition-all duration-300 ${
                    isActive
                      ? "border-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary)/0.15)] scale-[1.02]"
                      : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md"
                  }`}
                  style={{
                    background: colors?.bg || "#fff",
                  }}
                >
                  {isActive && (
                    <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--primary))]">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {theme.isDark ? (
                      <Moon size={14} style={{ color: colors?.primary }} />
                    ) : (
                      <Sun size={14} style={{ color: colors?.primary }} />
                    )}
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: theme.isDark ? "#e5e5e5" : "#1a1a1a",
                      }}
                    >
                      {theme.label}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {colors &&
                      [colors.primary, colors.secondary, colors.accent].map(
                        (color, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full border border-black/10 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Display */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)]">
              <Monitor size={20} className="text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[hsl(var(--card-foreground))]">
                Display
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Adjust the interface to your preference
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Font Scale */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type
                  size={16}
                  className="text-[hsl(var(--muted-foreground))]"
                />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                    Font Scale
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Adjust text size across the app
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-48">
                <input
                  type="range"
                  min={80}
                  max={120}
                  step={5}
                  value={fontScale}
                  onChange={(e) => setFontScale(Number(e.target.value))}
                  className="flex-1 accent-[hsl(var(--primary))] h-2 rounded-full appearance-none bg-[hsl(var(--muted))]"
                />
                <span className="text-xs font-bold text-[hsl(var(--foreground))] w-10 text-right">
                  {fontScale}%
                </span>
              </div>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Minimize2
                  size={16}
                  className="text-[hsl(var(--muted-foreground))]"
                />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                    Compact Mode
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Reduce spacing for more content
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCompactMode(!compactMode)}
                className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                  compactMode
                    ? "bg-[hsl(var(--primary))]"
                    : "bg-[hsl(var(--muted))]"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    compactMode ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Sidebar Collapsed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PanelLeftClose
                  size={16}
                  className="text-[hsl(var(--muted-foreground))]"
                />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                    Collapse Sidebar
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Minimize sidebar to icon-only mode
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                  sidebarCollapsed
                    ? "bg-[hsl(var(--primary))]"
                    : "bg-[hsl(var(--muted))]"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    sidebarCollapsed ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)]">
              <Database size={20} className="text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[hsl(var(--card-foreground))]">
                Data Management
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Export, import, or clear your data
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={exportData}
              className="w-full flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-4 text-left transition-all duration-200 hover:bg-[hsl(var(--muted)/0.5)] hover:border-[hsl(var(--primary)/0.3)]"
            >
              <Download
                size={18}
                className="text-[hsl(var(--primary))] flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                  Export All Data
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Download a JSON backup of all your data
                </p>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-4 text-left transition-all duration-200 hover:bg-[hsl(var(--muted)/0.5)] hover:border-[hsl(var(--primary)/0.3)]"
            >
              <Upload
                size={18}
                className="text-[hsl(var(--primary))] flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-[hsl(var(--card-foreground))]">
                  Import Data
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Restore from a JSON backup file
                </p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />

            <button
              onClick={() => setClearConfirm(true)}
              className="w-full flex items-center gap-3 rounded-xl border border-[hsl(var(--destructive)/0.3)] p-4 text-left transition-all duration-200 hover:bg-[hsl(var(--destructive)/0.05)] hover:border-[hsl(var(--destructive)/0.5)]"
            >
              <Trash2
                size={18}
                className="text-[hsl(var(--destructive))] flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-[hsl(var(--destructive))]">
                  Clear All Data
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Permanently delete all tasks, habits, goals, notes, and
                  sessions
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={clearConfirm}
        title="Clear All Data"
        description="This will permanently delete all your tasks, habits, goals, notes, and focus sessions. This action cannot be undone."
        confirmLabel="Clear Everything"
        variant="danger"
        onConfirm={clearAllData}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}
