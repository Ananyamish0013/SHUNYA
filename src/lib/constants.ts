export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Planner", href: "/planner", icon: "CalendarRange" },
  { label: "Habits", href: "/habits", icon: "Target" },
  { label: "Goals", href: "/goals", icon: "Trophy" },
  { label: "Notes", href: "/notes", icon: "FileText" },
  { label: "Calendar", href: "/calendar", icon: "Calendar" },
  { label: "Focus", href: "/focus", icon: "Timer" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  low: "hsl(var(--chart3))",
  medium: "hsl(var(--chart2))",
  high: "hsl(var(--destructive))",
};

export const HABIT_COLORS = [
  "#9F7AEA",
  "#EC4899",
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F59E0B",
];

export const HABIT_ICONS = [
  "Dumbbell",
  "BookOpen",
  "Droplets",
  "Brain",
  "Heart",
  "Leaf",
  "Bike",
  "Moon",
  "Sun",
  "Pencil",
  "Coffee",
  "Music",
  "Flame",
  "Zap",
  "Star",
];

export const GOAL_TYPES = [
  { value: "annual", label: "Annual" },
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
] as const;

export const POMODORO_DEFAULTS = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

export const NOTE_CATEGORIES = [
  "General",
  "Work",
  "Personal",
  "Ideas",
  "Meeting Notes",
  "Research",
  "Journal",
];

export const ANALYTICS_RANGES = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
] as const;
