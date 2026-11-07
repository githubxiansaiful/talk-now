'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { RoomExpiryLabel } from './room-expiry-label';
import { Share2, Settings, Users, ArrowLeft } from 'lucide-react';
import { formatRemainingTime } from '@/lib/utils';

interface ChatHeaderProps {
  roomName: string;
  roomCode: string;
  expiresAt: string;
  memberCount: number;
  typingUsers?: string[];
  onOpenInvite: () => void;
  onOpenSettings: () => void;
  onToggleMembers: () => void;
  onBackClick?: () => void;
  onExpire?: () => void;
}

export function ChatHeader({
  roomName,
  roomCode,
  expiresAt,
  memberCount,
  typingUsers,
  onOpenInvite,
  onOpenSettings,
  onToggleMembers,
  onBackClick,
  onExpire,
}: ChatHeaderProps) {
  const [remainingTime, setRemainingTime] = useState(() => formatRemainingTime(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      if (expiry <= now) {
        setRemainingTime('Expired');
        clearInterval(interval);
        onExpire?.();
      } else {
        setRemainingTime(formatRemainingTime(expiresAt));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return (
    <header className="h-14 sm:h-16 border-b border-[var(--border)] bg-[var(--surface)] px-3 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: Back (mobile) / Logo (desktop) & Room Details */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBackClick}
          className="p-1.5 -ml-1 sm:hidden rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors shrink-0 cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="hidden sm:block shrink-0">
          <AppLogo size="sm" />
        </div>

        <div className="h-5 w-[1px] bg-[var(--border)] hidden sm:block shrink-0" />

        <button
          type="button"
          onClick={onToggleMembers}
          className="text-left min-w-0 flex-1 flex items-center gap-2.5 lg:cursor-default"
        >
          {/* Mobile room icon / avatar like WhatsApp */}
          <div className="w-8 h-8 rounded-full bg-[#7657E8]/10 text-[#7657E8] border border-[#7657E8]/20 flex items-center justify-center font-bold text-xs shrink-0 sm:hidden">
            {(roomName || roomCode).charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[var(--text)] truncate leading-tight">
                {roomName || `Room ${roomCode}`}
              </h1>
              <span className="hidden md:inline-flex text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
                {roomCode}
              </span>
            </div>

            {typingUsers && typingUsers.length > 0 ? (
              <div className="flex items-center gap-1.5 text-[11px] text-[#16A36A] dark:text-[#20C283] font-medium mt-0.5 leading-none animate-pulse">
                <span>
                  {typingUsers.length === 1
                    ? `${typingUsers[0]} is typing...`
                    : `${typingUsers[0]} and ${typingUsers.length - 1} other${typingUsers.length > 2 ? 's' : ''} typing...`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] mt-0.5 leading-none">
                <span className="inline-flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
                  {memberCount} online
                </span>
                <span className="sm:hidden text-[var(--text-muted)]">•</span>
                <span className="sm:hidden text-[#7657E8] font-medium">
                  {remainingTime}
                </span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 ml-2">
        <div className="hidden sm:block">
          <button
            type="button"
            onClick={onOpenSettings}
            title="Room duration (click to view settings or extend)"
            className="hover:opacity-85 transition-opacity cursor-pointer"
          >
            <RoomExpiryLabel expiresAt={expiresAt} onExpire={onExpire} />
          </button>
        </div>

        {/* Invite button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenInvite}
          className="text-xs font-semibold gap-1.5 hidden sm:inline-flex"
        >
          <Share2 className="w-3.5 h-3.5 text-[#7657E8]" />
          <span>Invite</span>
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={onOpenInvite}
          className="sm:hidden h-8 w-8 rounded-lg"
          aria-label="Invite to room"
        >
          <Share2 className="w-4 h-4 text-[#7657E8]" />
        </Button>

        {/* Member list toggle on mobile / tablet */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMembers}
          className="lg:hidden h-8 w-8 rounded-lg text-[var(--text-secondary)]"
          aria-label="Toggle member list"
        >
          <Users className="w-4 h-4" />
        </Button>

        {/* Settings button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="h-8 w-8 rounded-lg text-[var(--text-secondary)]"
          aria-label="Room settings"
        >
          <Settings className="w-4 h-4" />
        </Button>

        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
