import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#7657E8] focus:ring-2 focus:ring-[#7657E8]/20 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[#DC4C4C] focus:border-[#DC4C4C] focus:ring-[#DC4C4C]/20',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-[#DC4C4C]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
