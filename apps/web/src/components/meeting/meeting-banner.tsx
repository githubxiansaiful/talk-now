'use client';

import { Phone, Users, Mic, MicOff, Maximize2, PhoneOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Meeting } from '@talknow/shared';

interface MeetingBannerProps {
  meeting: Meeting;
  onJoinClick: () => void;
  isConnectedInCall?: boolean;
  duration?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onExpandCall?: () => void;
  onLeaveCall?: () => void;
}

export function MeetingBanner({
  meeting,
  onJoinClick,
  isConnectedInCall = false,
  duration = 0,
  isMuted = false,
  onToggleMute,
  onExpandCall,
  onLeaveCall,
}: MeetingBannerProps) {
  const count = meeting.participantCount || 1;

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return hours > 0
      ? `${hours}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;
  };

  if (isConnectedInCall) {
    return (
      <div className="px-3 sm:px-6 py-2 bg-gradient-to-r from-[#7657E8]/12 via-[#7657E8]/6 to-transparent border-b border-[#7657E8]/25 flex items-center justify-between gap-3 shrink-0 z-20 animate-in fade-in duration-150">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#7657E8] text-white flex items-center justify-center shrink-0 shadow-xs relative">
            <Phone className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--surface)]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[var(--text)] truncate">
                Connected to Voice Call
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#7657E8] bg-[#7657E8]/10 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                {formatDuration(duration)}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] truncate hidden sm:block">
              {count} {count === 1 ? 'participant' : 'participants'} in call • Audio stays active while you chat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              className={`h-8 px-2.5 sm:px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-[#7657E8]/40'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#7657E8]" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>
          )}

          {onExpandCall && (
            <Button
              size="sm"
              onClick={onExpandCall}
              className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 bg-[#7657E8] hover:bg-[#6545D5] text-white"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Return to Call</span>
            </Button>
          )}

          {onLeaveCall && (
            <button
              type="button"
              onClick={onLeaveCall}
              className="h-8 w-8 rounded-xl inline-flex items-center justify-center bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 transition-colors cursor-pointer"
              title="Leave voice call"
              aria-label="Leave voice call"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-2.5 bg-[var(--surface)] border-b border-[#7657E8]/25 flex items-center justify-between gap-3 shrink-0 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7657E8] to-[#9175F3] text-white flex items-center justify-center shrink-0 shadow-xs relative">
          <Phone className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-[var(--surface)]" />
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[var(--text)] truncate">
              Voice Call in Progress
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5">
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-[#7657E8]" />
              {count} {count === 1 ? 'participant' : 'participants'}
            </span>
            {meeting.hostDisplayName && (
              <>
                <span className="text-[var(--text-muted)]">•</span>
                <span className="truncate">Hosted by {meeting.hostDisplayName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Button
        size="sm"
        onClick={onJoinClick}
        className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl shadow-xs cursor-pointer transition-all"
      >
        Join Voice Call
      </Button>
    </div>
  );
}
