import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'purple';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)]',
    success: 'bg-[var(--success-light)] text-[var(--success)] border-transparent',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-transparent',
    danger: 'bg-[var(--danger-light)] text-[var(--danger)] border-transparent',
    outline: 'border border-[var(--border)] text-[var(--text-secondary)]',
    purple: 'bg-[#7657E8]/10 text-[#7657E8] border-transparent',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
