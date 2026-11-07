'use client';

import { useState } from 'react';
import {
  Mic,
  MicOff,
  Settings2,
  Users,
  MessageSquare,
  PhoneOff,
  Trash2,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MeetingControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
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

  const canEndForEveryone = isHost || isCreator;

  return (
    <>
      <div className="h-18 sm:h-20 px-3 sm:px-6 bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-30">
        {/* Left: Device Settings & Participant Count (desktop) */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="h-10 px-3 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] text-xs font-semibold gap-2 border border-[var(--border)]"
            title="Audio settings"
          >
            <Settings2 className="w-4 h-4 text-[#7657E8]" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>

        {/* Center: Main Calling Controls */}
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
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span>{isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          {/* Leave Call (For anyone) */}
          <button
            type="button"
            onClick={onLeaveMeeting}
            className="h-11 sm:h-12 px-4 sm:px-5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold bg-[var(--surface-secondary)] hover:bg-rose-500/10 text-[var(--text)] hover:text-rose-600 border border-[var(--border)] hover:border-rose-500/30 transition-all shadow-xs cursor-pointer"
            title="Leave meeting and return to text chat"
          >
            <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            <span className="hidden sm:inline">Leave</span>
          </button>

          {/* End Call for Everyone (Host only) */}
          {canEndForEveryone && (
            <button
              type="button"
              onClick={() => setShowEndConfirm(true)}
              className="h-11 sm:h-12 px-3 sm:px-4 rounded-2xl flex items-center gap-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 transition-all shadow-xs cursor-pointer"
              title="End meeting for all participants"
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
            className={`h-10 px-3 rounded-2xl text-xs font-semibold gap-1.5 border transition-all ${
              isParticipantsOpen
                ? 'bg-[#7657E8]/15 text-[#7657E8] border-[#7657E8]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-[var(--border)] bg-[var(--surface-secondary)]'
            }`}
            title="Toggle participants list"
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
            className={`h-10 px-3 rounded-2xl text-xs font-semibold gap-1.5 border transition-all relative ${
              isChatOpen
                ? 'bg-[#7657E8]/15 text-[#7657E8] border-[#7657E8]/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-[var(--border)] bg-[var(--surface-secondary)]'
            }`}
            title="Toggle room text chat"
          >
            <MessageSquare className="w-4 h-4 text-[#7657E8]" />
            <span className="hidden sm:inline">Chat</span>
            {unreadChatCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#7657E8] absolute -top-0.5 -right-0.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog for End Meeting for Everyone */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[#DC4C4C] flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-1.5">End Meeting for Everyone?</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              This will disconnect all participants from the meeting immediately. The room text chat will remain active.
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
                className="flex-1 text-xs h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => {
                  setShowEndConfirm(false);
                  onEndMeeting();
                }}
              >
                Yes, End Meeting
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
