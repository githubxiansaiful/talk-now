'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatRemainingTime } from '@/lib/utils';

interface RoomExpiryLabelProps {
  expiresAt: string;
  onExpire?: () => void;
}

export function RoomExpiryLabel({ expiresAt, onExpire }: RoomExpiryLabelProps) {
  const [remainingText, setRemainingText] = useState(() => formatRemainingTime(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      if (expiry <= now) {
        setRemainingText('Expired');
        clearInterval(interval);
        onExpire?.();
      } else {
        setRemainingText(formatRemainingTime(expiresAt));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
      <Clock className="w-3.5 h-3.5 text-[#7657E8]" />
      <span>{remainingText}</span>
    </div>
  );
}
