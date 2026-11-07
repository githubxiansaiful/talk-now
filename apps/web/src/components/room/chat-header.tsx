'use client';

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
  onOpenInvite: () => void;
  onOpenSettings: () => void;
  onToggleMembers: () => void;
  onExpire?: () => void;
}

export function ChatHeader({
  roomName,
  roomCode,
  expiresAt,
  memberCount,
  onOpenInvite,
  onOpenSettings,
  onToggleMembers,
  onExpire,
}: ChatHeaderProps) {
  return (
    <header className="h-14 sm:h-16 border-b border-[var(--border)] bg-[var(--surface)] px-3 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: Back (mobile) / Logo (desktop) & Room Details */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <Link
          href="/"
          className="p-1.5 -ml-1 sm:hidden rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors shrink-0"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="hidden sm:block shrink-0">
          <AppLogo size="sm" />
        </div>

        <div className="h-5 w-[1px] bg-[var(--border)] hidden sm:block shrink-0" />

        <button
          type="button"
          onClick={onToggleMembers}
          className="text-left min-w-0 flex-1 lg:cursor-default"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-sm sm:text-base font-bold text-[var(--text)] truncate leading-tight">
              {roomName || `Room ${roomCode}`}
            </h1>
            <span className="hidden md:inline-flex text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
              {roomCode}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] mt-0.5 leading-none">
            <span className="inline-flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
              {memberCount} online
            </span>
            <span className="sm:hidden text-[var(--text-muted)]">•</span>
            <span className="sm:hidden text-[#7657E8] font-medium">
              {formatRemainingTime(expiresAt)}
            </span>
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 ml-2">
        <div className="hidden sm:block">
          <RoomExpiryLabel expiresAt={expiresAt} onExpire={onExpire} />
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
