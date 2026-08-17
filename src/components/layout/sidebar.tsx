"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarRange,
  Target,
  Trophy,
  FileText,
  Calendar,
  Timer,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Planner", href: "/planner", icon: CalendarRange },
  { label: "Habits", href: "/habits", icon: Target },
  { label: "Goals", href: "/goals", icon: Trophy },
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Focus", href: "/focus", icon: Timer },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))]">
        <div className="h-16 flex items-center px-6">
          <div className="h-8 w-8 rounded-xl bg-[hsl(var(--primary))]" />
        </div>
      </aside>
    );
  }

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-5 border-b border-[hsl(var(--sidebar-border))]">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] shadow-md shadow-[hsl(var(--primary)/0.25)]">
            <Sparkles size={18} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-base font-bold text-[hsl(var(--sidebar-foreground))] tracking-tight">
              Productivity
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-[hsl(var(--sidebar-foreground)/0.5)] transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg text-[hsl(var(--sidebar-foreground)/0.5)] transition-colors hover:bg-[hsl(var(--sidebar-accent))]"
        >
          <X size={14} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-sm shadow-[hsl(var(--sidebar-primary)/0.25)]"
                    : "text-[hsl(var(--sidebar-foreground)/0.7)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon
                  size={18}
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    !isActive ? "group-hover:scale-110" : ""
                  }`}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[hsl(var(--sidebar-border))] px-3 py-4">
        {!sidebarCollapsed && (
          <div className="rounded-xl bg-gradient-to-br from-[hsl(var(--primary)/0.1)] to-[hsl(var(--secondary)/0.1)] p-4">
            <p className="text-xs font-semibold text-[hsl(var(--sidebar-foreground))] mb-1">
              Productivity 2.0
            </p>
            <p className="text-[10px] text-[hsl(var(--sidebar-foreground)/0.5)]">
              Your personal dashboard
            </p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--card))] shadow-lg border border-[hsl(var(--border))] lg:hidden transition-all duration-200 hover:shadow-xl"
      >
        <Menu size={18} className="text-[hsl(var(--foreground))]" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] transition-all duration-300 ease-out flex-shrink-0 ${
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
