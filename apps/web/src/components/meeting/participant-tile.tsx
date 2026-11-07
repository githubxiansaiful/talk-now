'use client';

import { Mic, MicOff, Crown } from 'lucide-react';
import { MeetingParticipant } from '@talknow/shared';

interface ParticipantTileProps {
  participant: MeetingParticipant;
  isSelf: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
}

export function ParticipantTile({
  participant,
  isSelf,
  isSpeaking,
  isMuted,
}: ParticipantTileProps) {
  const initial = participant.displayName
    ? participant.displayName.charAt(0).toUpperCase()
    : '?';

  return (
    <div
      className={`relative w-full h-full min-h-[140px] sm:min-h-[180px] rounded-3xl p-4 flex flex-col items-center justify-center transition-all duration-200 border bg-[var(--surface)] ${
        isSpeaking && !isMuted
          ? 'border-[#7657E8] ring-2 ring-[#7657E8]/50 shadow-lg shadow-[#7657E8]/10'
          : 'border-[var(--border)] hover:border-[var(--border-hover)]'
      }`}
    >
      {/* Top Left: Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        {participant.isHost && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
            <Crown className="w-2.5 h-2.5" />
            Host
          </span>
        )}
        {isSelf && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#7657E8]/10 text-[#7657E8] border border-[#7657E8]/20">
            You
          </span>
        )}
      </div>

      {/* Top Right: Mic Status Icon */}
      <div className="absolute top-3 right-3 z-10">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-colors ${
            isMuted
              ? 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
              : isSpeaking
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 animate-pulse'
              : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]'
          }`}
          title={isMuted ? 'Muted' : isSpeaking ? 'Speaking' : 'Microphone on'}
        >
          {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Center: Avatar with Speaking Pulse */}
      <div className="relative my-auto flex items-center justify-center">
        {/* Dynamic Speaking Glow */}
        {isSpeaking && !isMuted && (
          <div className="absolute inset-0 rounded-full bg-[#7657E8]/25 animate-ping duration-1000" />
        )}

        <div
          className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md transition-all duration-200 ${
            isSpeaking && !isMuted
              ? 'bg-gradient-to-tr from-[#7657E8] to-[#9175F3] text-white ring-4 ring-[#7657E8]/30 scale-105'
              : 'bg-violet-100 dark:bg-violet-950/60 text-[#7657E8] border border-[#7657E8]/20'
          }`}
        >
          {initial}
        </div>
      </div>

      {/* Bottom: Name Plate */}
      <div className="mt-auto pt-2 text-center max-w-[85%]">
        <span className="block text-xs sm:text-sm font-bold text-[var(--text)] truncate leading-tight">
          {participant.displayName}
        </span>
        <span className="block text-[10px] text-[var(--text-muted)] mt-0.5">
          {isMuted ? 'Muted' : isSpeaking ? 'Speaking...' : 'Listening'}
        </span>
      </div>
    </div>
  );
}
