"use client";

import * as LucideIcons from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = "",
}: StatCardProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[icon] || LucideIcons.Activity;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.08)] hover:-translate-y-0.5 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary)/0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)]">
            <IconComponent className="text-[hsl(var(--primary))]" size={20} />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {trend.isPositive ? (
                <LucideIcons.TrendingUp size={12} />
              ) : (
                <LucideIcons.TrendingDown size={12} />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-[hsl(var(--card-foreground))] tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
