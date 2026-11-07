'use client';

import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, Info, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RoomToastAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  onClick: () => void;
  loading?: boolean;
}

export interface ToastItem {
  id: string;
  type: 'warning-15m' | 'warning-5m' | 'success' | 'info';
  title: string;
  message: string;
  actions?: RoomToastAction[];
  onDismiss: () => void;
}

interface RoomToastContainerProps {
  toasts: ToastItem[];
}

export function RoomToastContainer({ toasts }: RoomToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-16 right-3 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-1.5rem)] sm:w-96 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <RoomToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function RoomToastCard({ toast }: { toast: ToastItem }) {
  const is15m = toast.type === 'warning-15m';
  const is5m = toast.type === 'warning-5m';
  const isSuccess = toast.type === 'success';

  const borderColor = is5m
    ? 'border-red-500/40 dark:border-red-500/30'
    : is15m
    ? 'border-amber-500/40 dark:border-amber-500/30'
    : isSuccess
    ? 'border-emerald-500/40 dark:border-emerald-500/30'
    : 'border-[var(--border)]';

  const iconBox = is5m ? (
    <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center shrink-0 animate-pulse">
      <AlertTriangle className="w-5 h-5" />
    </div>
  ) : is15m ? (
    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
      <Clock className="w-5 h-5" />
    </div>
  ) : isSuccess ? (
    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
      <CheckCircle2 className="w-5 h-5" />
    </div>
  ) : (
    <div className="w-9 h-9 rounded-xl bg-[#7657E8]/10 text-[#7657E8] border border-[#7657E8]/20 flex items-center justify-center shrink-0">
      <Info className="w-5 h-5" />
    </div>
  );

  return (
    <div
      className={`pointer-events-auto bg-[var(--surface)]/95 backdrop-blur-md ${borderColor} border shadow-2xl rounded-2xl p-4 transition-all duration-200 animate-in slide-in-from-top-3 fade-in`}
    >
      <div className="flex items-start gap-3">
        {iconBox}

        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-sm font-bold text-[var(--text)] leading-tight mb-1">
            {toast.title}
          </h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={toast.onDismiss}
          className="p-1 -mr-1 -mt-1 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {toast.actions && toast.actions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--border)]/60 flex items-center gap-2 flex-wrap">
          {toast.actions.map((action, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              disabled={action.loading}
              className="text-xs h-7 px-2.5 font-medium cursor-pointer"
            >
              {action.loading ? (
                <span className="animate-spin inline-block mr-1">◌</span>
              ) : (
                <Plus className="w-3 h-3 mr-0.5" />
              )}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
