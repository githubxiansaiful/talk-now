import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7657E8] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-[#7657E8] hover:bg-[#6545D5] text-white shadow-sm shadow-[#7657E8]/25 hover:shadow-[#7657E8]/35',
      secondary:
        'bg-[var(--surface-secondary)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)]',
      outline:
        'border border-[var(--border)] hover:border-[#7657E8] bg-[var(--surface)] hover:bg-[var(--surface-secondary)] text-[var(--text)]',
      ghost:
        'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]',
      danger:
        'bg-[#DC4C4C] hover:bg-[#C93B3B] text-white shadow-sm shadow-[#DC4C4C]/25',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2.5 h-10 gap-2',
      lg: 'text-base px-6 py-3 h-12 gap-2.5 font-semibold',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
