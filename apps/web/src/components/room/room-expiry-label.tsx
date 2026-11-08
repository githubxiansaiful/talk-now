'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatRemainingTime } from '@/lib/utils';

interface RoomExpiryLabelProps {
  expiresAt: string;
  onExpire?: () => void;
}

export function RoomExpiryLabel({ expiresAt, onExpire }: RoomExpiryLabelProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      if (new Date(expiresAt).getTime() <= currentNow) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const remainingMs = new Date(expiresAt).getTime() - now;
  const isExpired = remainingMs <= 0;
  const isCritical = !isExpired && remainingMs <= 5 * 60 * 1000;
  const isWarning = !isExpired && !isCritical && remainingMs <= 15 * 60 * 1000;
  const remainingText = isExpired ? 'Expired' : formatRemainingTime(expiresAt);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums border transition-colors ${
        isCritical || isExpired
          ? 'bg-rose-500/12 text-rose-600 dark:text-rose-400 border-rose-500/25'
          : isWarning
            ? 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25'
            : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)]'
      }`}
    >
      <Clock
        className={`w-3.5 h-3.5 ${
          isCritical || isExpired
            ? 'text-rose-500 animate-pulse'
            : isWarning
              ? 'text-amber-500'
              : 'text-[#7657E8]'
        }`}
      />
      <span>{remainingText}</span>
    </div>
  );
}
