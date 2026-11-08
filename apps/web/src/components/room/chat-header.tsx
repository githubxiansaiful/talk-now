'use client';

import { useState, useEffect } from 'react';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { RoomExpiryLabel } from './room-expiry-label';
import { Share2, Settings, Users, ArrowLeft, Phone, Copy, Check } from 'lucide-react';
import { formatRemainingTime } from '@/lib/utils';
import { Meeting } from '@talknow/shared';
import { toast } from 'sonner';

interface ChatHeaderProps {
  roomName: string;
  roomCode: string;
  expiresAt: string;
  memberCount: number;
  isCreator?: boolean;
  activeMeeting?: Meeting | null;
  isInMeeting?: boolean;
  onOpenMeeting?: () => void;
  onMaximizeMeeting?: () => void;
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
  isCreator,
  activeMeeting,
  isInMeeting = false,
  onOpenMeeting,
  onMaximizeMeeting,
  typingUsers,
  onOpenInvite,
  onOpenSettings,
  onToggleMembers,
  onBackClick,
  onExpire,
}: ChatHeaderProps) {
  const [now, setNow] = useState(() => Date.now());
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopiedCode(true);
      toast.success('Room code copied', { description: roomCode, duration: 2000 });
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const isExpired = new Date(expiresAt).getTime() <= now;
  const remainingTime = isExpired ? 'Expired' : formatRemainingTime(expiresAt);

  return (
    <header className="h-14 sm:h-16 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: Back (mobile) / Logo (desktop) & Room Details */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBackClick}
          className="p-1.5 -ml-1 sm:hidden rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors shrink-0 cursor-pointer"
          aria-label="Leave room"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="hidden sm:block shrink-0">
          <AppLogo size="sm" />
        </div>

        <div className="h-5 w-[1px] bg-[var(--border)] hidden sm:block shrink-0" />

        <div className="min-w-0 flex-1 flex items-center gap-2.5">
          {/* Mobile room badge */}
          <button
            type="button"
            onClick={onToggleMembers}
            className="w-8 h-8 rounded-xl bg-[#7657E8]/10 text-[#7657E8] border border-[#7657E8]/20 flex items-center justify-center font-bold text-xs shrink-0 sm:hidden"
          >
            {(roomName || roomCode).charAt(0).toUpperCase()}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onToggleMembers}
                className="text-sm sm:text-base font-bold text-[var(--text)] truncate leading-tight lg:cursor-default text-left"
              >
                {roomName || `Room ${roomCode}`}
              </button>

              <button
                type="button"
                onClick={handleCopyCode}
                title="Copy room code"
                className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] hover:bg-[#7657E8]/10 text-[var(--text-secondary)] hover:text-[#7657E8] border border-[var(--border)] hover:border-[#7657E8]/30 transition-colors cursor-pointer"
              >
                <span>{roomCode}</span>
                {copiedCode ? (
                  <Check className="w-2.5 h-2.5 text-emerald-500" />
                ) : (
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                )}
              </button>
            </div>

            {typingUsers && typingUsers.length > 0 ? (
              <div className="flex items-center gap-1.5 text-[11px] text-[#16A36A] dark:text-[#20C283] font-medium mt-0.5 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-pulse" />
                <span className="truncate">
                  {typingUsers.length === 1
                    ? `${typingUsers[0]} is typing...`
                    : `${typingUsers[0]} +${typingUsers.length - 1} typing...`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] mt-0.5 leading-none">
                <span className="inline-flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
                  {memberCount} online
                </span>
                <span className="sm:hidden text-[var(--text-muted)]">•</span>
                <span className="sm:hidden text-[#7657E8] font-medium tabular-nums">
                  {remainingTime}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2">
        <div className="hidden sm:block">
          <button
            type="button"
            onClick={onOpenSettings}
            title={isCreator ? 'Room duration (click to view settings or extend)' : 'Room duration'}
            className="hover:opacity-85 transition-opacity cursor-pointer"
          >
            <RoomExpiryLabel expiresAt={expiresAt} onExpire={onExpire} />
          </button>
        </div>

        {/* Voice Call Button */}
        {(onOpenMeeting || onMaximizeMeeting) && (
          <Button
            size="sm"
            onClick={isInMeeting && onMaximizeMeeting ? onMaximizeMeeting : onOpenMeeting}
            className={`text-xs font-semibold gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl transition-all cursor-pointer ${
              isInMeeting
                ? 'bg-[#7657E8] hover:bg-[#6545db] text-white shadow-sm shadow-[#7657E8]/20'
                : activeMeeting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-[#7657E8]/10 hover:bg-[#7657E8]/18 text-[#7657E8] border border-[#7657E8]/25'
            }`}
            title={
              isInMeeting
                ? 'Return to full voice call screen'
                : activeMeeting
                  ? 'Join active voice call'
                  : 'Start group voice call'
            }
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isInMeeting ? 'In Call' : activeMeeting ? 'Join Call' : 'Voice Call'}
            </span>
            {activeMeeting && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
            )}
          </Button>
        )}

        {/* Invite button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenInvite}
          className="text-xs font-semibold gap-1.5 h-8 sm:h-9 px-3 rounded-xl hidden sm:inline-flex"
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
