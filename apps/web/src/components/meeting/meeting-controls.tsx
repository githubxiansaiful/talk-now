'use client';

import { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Users,
  MessageSquare,
  PhoneOff,
  Trash2,
  Minimize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MeetingControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  onMinimize?: () => void;
  onLeaveMeeting: () => void;
  onEndMeeting: () => void;
  isHost: boolean;
  isCreator: boolean;
  participantCount: number;
  unreadChatCount?: number;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
}

export function MeetingControls({
  isMuted,
  onToggleMute,
  onOpenSettings,
  onToggleParticipants,
  onToggleChat,
  onMinimize,
  onLeaveMeeting,
  onEndMeeting,
  isHost,
  isCreator,
  participantCount,
  unreadChatCount = 0,
  isChatOpen,
  isParticipantsOpen,
}: MeetingControlsProps) {
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  useEffect(() => {
    if (!showEndConfirm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowEndConfirm(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEndConfirm]);

  const canEndForEveryone = isHost || isCreator;

  return (
    <>
      <div className="h-16 sm:h-20 px-2 sm:px-6 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] flex items-center justify-between gap-1.5 sm:gap-4 shrink-0 z-30 pb-[env(safe-area-inset-bottom)]">
        {/* Left: Device Settings & Minimize */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="h-9 w-9 sm:h-10 sm:w-auto p-0 sm:px-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] text-xs font-semibold gap-1.5 border border-[var(--border)] shrink-0"
            title="Audio input & output settings"
            aria-label="Audio settings"
          >
            <Volume2 className="w-4 h-4 text-[#7657E8]" />
            <span className="hidden md:inline">Audio</span>
          </Button>

          {onMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-9 w-9 sm:h-10 sm:w-auto p-0 sm:px-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] text-xs font-semibold gap-1.5 border border-[var(--border)] shrink-0"
              title="Minimize call and return to full room view"
              aria-label="Minimize call"
            >
              <Minimize2 className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="hidden lg:inline">Minimize</span>
            </Button>
          )}
        </div>

        {/* Center: Primary Call Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mute / Unmute Button */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`h-10 sm:h-12 px-3 sm:px-5 rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-all shadow-md shrink-0 cursor-pointer ${
              isMuted
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-[#7657E8] hover:bg-[#6545db] text-white shadow-[#7657E8]/20'
            }`}
            title={isMuted ? 'Unmute microphone (M)' : 'Mute microphone (M)'}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </button>

          {/* Leave Call */}
          <button
            type="button"
            onClick={onLeaveMeeting}
            className="h-10 w-10 sm:h-12 sm:w-auto p-0 sm:px-4 rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold bg-[var(--surface-secondary)] hover:bg-rose-500/10 text-[var(--text)] hover:text-rose-600 border border-[var(--border)] hover:border-rose-500/30 transition-all shadow-xs shrink-0 cursor-pointer"
            title="Leave voice call and return to text chat"
            aria-label="Leave voice call"
          >
            <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
            <span className="hidden md:inline">Leave</span>
          </button>

          {/* End Call for Everyone (Host / Room Creator only) */}
          {canEndForEveryone && (
            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              className="h-10 w-10 sm:h-12 sm:w-auto p-0 sm:px-3.5 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/25 transition-all shadow-xs shrink-0 cursor-pointer"
              title="End voice call for all participants"
              aria-label="End call for all"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">End for all</span>
            </button>
          )}
        </div>

        {/* Right: Side Drawer Toggles (Participants & Chat) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Participants Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleParticipants}
            className={`h-9 sm:h-10 px-2 sm:px-3 rounded-xl text-xs font-semibold gap-1 sm:gap-1.5 border transition-all shrink-0 ${
              isParticipantsOpen
                ? 'bg-[#7657E8]/15 text-[#7657E8] border-[#7657E8]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-[var(--border)] bg-[var(--surface-secondary)]'
            }`}
            title="Toggle call participants"
            aria-label="Toggle participants list"
          >
            <Users className="w-4 h-4 text-[#7657E8] shrink-0" />
            <span className="hidden md:inline">People</span>
            <span className="text-[10px] font-bold px-1 sm:px-1.5 py-0.2 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] tabular-nums">
              {participantCount}
            </span>
          </Button>

          {/* Chat Drawer Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleChat}
            className={`h-9 sm:h-10 px-2 sm:px-3 rounded-xl text-xs font-semibold gap-1 sm:gap-1.5 border transition-all relative shrink-0 ${
              isChatOpen
                ? 'bg-[#7657E8]/15 text-[#7657E8] border-[#7657E8]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-[var(--border)] bg-[var(--surface-secondary)]'
            }`}
            title="Toggle room text chat"
            aria-label="Toggle chat drawer"
          >
            <MessageSquare className="w-4 h-4 text-[#7657E8] shrink-0" />
            <span className="hidden md:inline">Chat</span>
            {unreadChatCount > 0 && !isChatOpen && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-[#7657E8] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadChatCount > 9 ? '9+' : unreadChatCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog for End Call for Everyone */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[#DC4C4C] flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-1.5">
              End Call for Everyone?
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              This will disconnect all participants from the voice call immediately. The room text chat will remain active.
            </p>
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs h-10 rounded-xl"
                onClick={() => setShowEndConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 text-xs h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                onClick={() => {
                  setShowEndConfirm(false);
                  onEndMeeting();
                }}
              >
                End Call for All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
