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
    // Keep ticking every second so countdown stays fresh and triggers onExpire on time
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

  const isExpired = new Date(expiresAt).getTime() <= now;
  const remainingText = isExpired ? 'Expired' : formatRemainingTime(expiresAt);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
      <Clock className="w-3.5 h-3.5 text-[#7657E8]" />
      <span>{remainingText}</span>
    </div>
  );
}
