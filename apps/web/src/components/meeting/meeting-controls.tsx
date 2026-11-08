'use client';

import { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Settings2,
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
      <div className="h-18 sm:h-20 px-3 sm:px-6 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-30">
        {/* Left: Device Settings & Minimize */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="h-10 px-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] text-xs font-semibold gap-2 border border-[var(--border)]"
            title="Audio input & output settings"
          >
            <Settings2 className="w-4 h-4 text-[#7657E8]" />
            <span className="hidden md:inline">Audio</span>
          </Button>

          {onMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-10 px-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] text-xs font-semibold gap-2 border border-[var(--border)]"
              title="Minimize call and return to full room view"
            >
              <Minimize2 className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="hidden lg:inline">Minimize</span>
            </Button>
          )}
        </div>

        {/* Center: Primary Call Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mute / Unmute Button */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`h-11 sm:h-12 px-4 sm:px-5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer ${
              isMuted
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-[#7657E8] hover:bg-[#6545db] text-white shadow-[#7657E8]/20'
            }`}
            title={isMuted ? 'Unmute microphone (M)' : 'Mute microphone (M)'}
          >
            {isMuted ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Leave Call */}
          <button
            type="button"
            onClick={onLeaveMeeting}
            className="h-11 sm:h-12 px-4 sm:px-5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold bg-[var(--surface-secondary)] hover:bg-rose-500/10 text-[var(--text)] hover:text-rose-600 border border-[var(--border)] hover:border-rose-500/30 transition-all shadow-xs cursor-pointer"
            title="Leave voice call and return to text chat"
          >
            <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            <span className="hidden sm:inline">Leave</span>
          </button>

          {/* End Call for Everyone (Host / Room Creator only) */}
          {canEndForEveryone && (
            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              className="h-11 sm:h-12 px-3 sm:px-4 rounded-2xl flex items-center gap-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/25 transition-all shadow-xs cursor-pointer"
              title="End voice call for all participants"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">End for all</span>
            </button>
          )}
        </div>

        {/* Right: Side Drawer Toggles (Participants & Chat) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Participants Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleParticipants}
            className={`h-10 px-3 rounded-xl text-xs font-semibold gap-1.5 border transition-all ${
              isParticipantsOpen
                ? 'bg-[#7657E8]/15 text-[#7657E8] border-[#7657E8]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-[var(--border)] bg-[var(--surface-secondary)]'
            }`}
            title="Toggle call participants"
          >
            <Users className="w-4 h-4 text-[#7657E8]" />
            <span className="hidden sm:inline">People</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
              {participantCount}
            </span>
          </Button>

          {/* Chat Drawer Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleChat}
            className={`h-10 px-3 rounded-xl text-xs font-semibold gap-1.5 border transition-all relative ${
              isChatOpen
                ? 'bg-[#7657E8]/15 text-[#7657E8] border-[#7657E8]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-[var(--border)] bg-[var(--surface-secondary)]'
            }`}
            title="Toggle room text chat"
          >
            <MessageSquare className="w-4 h-4 text-[#7657E8]" />
            <span className="hidden sm:inline">Chat</span>
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
