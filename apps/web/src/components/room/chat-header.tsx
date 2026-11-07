'use client';

import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { RoomExpiryLabel } from './room-expiry-label';
import { Share2, Settings, Users } from 'lucide-react';

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
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: Logo & Room details */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="shrink-0">
          <AppLogo size="sm" />
        </div>

        <div className="h-5 w-[1px] bg-[var(--border)] hidden sm:block shrink-0" />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-[var(--text)] truncate">
              {roomName || `Room ${roomCode}`}
            </h1>
            <span className="hidden md:inline-flex text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
              {roomCode}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] sm:hidden">
            <span>{memberCount} online</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <RoomExpiryLabel expiresAt={expiresAt} onExpire={onExpire} />

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
          className="sm:hidden h-8 w-8 rounded-xl"
          aria-label="Invite to room"
        >
          <Share2 className="w-4 h-4 text-[#7657E8]" />
        </Button>

        {/* Member list toggle on mobile / tablet */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMembers}
          className="lg:hidden h-8 w-8 rounded-xl relative"
          aria-label="Toggle member list"
        >
          <Users className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7657E8] text-white text-[10px] font-bold flex items-center justify-center">
            {memberCount}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="h-8 w-8 rounded-xl"
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
