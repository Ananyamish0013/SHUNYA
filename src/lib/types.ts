export type Priority = "low" | "medium" | "high";
export type GoalType = "annual" | "quarterly" | "monthly" | "weekly";
export type CalendarView = "month" | "week" | "day";
export type FocusSessionType = "work" | "break";
export type ThemeName =
  | "lilac"
  | "pink"
  | "dark-blue"
  | "dark-mode"
  | "emerald"
  | "sunset";

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  priority: Priority;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  target: number;
  unit: string;
  completions: Record<string, number>;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  progress: number;
  milestones: Milestone[];
  notes: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: FocusSessionType;
  date: string;
}

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export interface ThemeDefinition {
  name: ThemeName;
  label: string;
  isDark: boolean;
  colors: ThemeColors;
  sidebarColors: {
    background: string;
    foreground: string;
    accent: string;
    accentForeground: string;
    border: string;
    ring: string;
    primary: string;
    primaryForeground: string;
  };
}

export interface AppSettings {
  fontScale: number;
  compactMode: boolean;
  sidebarWidth: number;
  sidebarCollapsed: boolean;
}

export interface DaySchedule {
  date: string;
  tasks: Task[];
  habitCompletions: Record<string, number>;
  notes: string;
}
