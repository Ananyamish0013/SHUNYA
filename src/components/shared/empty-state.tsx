"use client";

import * as LucideIcons from "lucide-react";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[icon] || LucideIcons.Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--muted))] mb-4">
        <IconComponent className="text-[hsl(var(--muted-foreground))]" size={28} />
      </div>
      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.25)]"
        >
          <LucideIcons.Plus size={16} />
          {action.label}
        </button>
      )}
    </div>
  );
}
