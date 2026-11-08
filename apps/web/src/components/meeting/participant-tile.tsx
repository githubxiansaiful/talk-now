'use client';

import { Mic, MicOff, Crown } from 'lucide-react';
import { MeetingParticipant } from '@talknow/shared';

interface ParticipantTileProps {
  participant: MeetingParticipant;
  isSelf: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
}

const AVATAR_STYLES = [
  'bg-violet-500/15 text-[#7657E8] dark:text-violet-300 border-[#7657E8]/25',
  'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/25',
  'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/25',
  'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/25',
  'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/25',
  'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/25',
];

function getAvatarStyle(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
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
  const avatarTone = getAvatarStyle(participant.displayName || 'User');
  const activeSpeaking = isSpeaking && !isMuted;

  return (
    <div
      className={`relative w-full h-full min-h-[150px] sm:min-h-[190px] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between transition-all duration-200 border bg-[var(--surface)] select-none ${
        activeSpeaking
          ? 'border-[#16A36A] ring-2 ring-[#16A36A]/35 shadow-lg shadow-[#16A36A]/[0.06]'
          : 'border-[var(--border)] hover:border-[#7657E8]/30'
      }`}
    >
      {/* Top Bar: Role Badges & Mic Indicator */}
      <div className="w-full flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          {participant.isHost && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Crown className="w-2.5 h-2.5" />
              Host
            </span>
          )}
          {isSelf && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#7657E8]/10 text-[#7657E8] dark:text-[#A78BFA] border border-[#7657E8]/20">
              You
            </span>
          )}
        </div>

        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
            isMuted
              ? 'bg-rose-500/12 text-rose-500 border border-rose-500/25'
              : activeSpeaking
              ? 'bg-[#16A36A] text-white shadow-xs'
              : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]'
          }`}
          title={isMuted ? 'Microphone muted' : activeSpeaking ? 'Speaking' : 'Microphone active'}
        >
          {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Center: Avatar with Speaking Ring */}
      <div className="relative my-2 flex items-center justify-center">
        {activeSpeaking && (
          <div className="absolute -inset-2 rounded-full border-2 border-[#16A36A]/40 animate-ping duration-1000 pointer-events-none" />
        )}

        <div
          className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl transition-transform duration-200 border ${
            activeSpeaking
              ? 'bg-gradient-to-tr from-[#7657E8] to-[#9175F3] text-white border-transparent ring-4 ring-[#16A36A]/25 scale-105 shadow-md'
              : avatarTone
          }`}
        >
          {initial}
        </div>
      </div>

      {/* Bottom: Name & Live Audio Equalizer / Status */}
      <div className="w-full text-center">
        <span className="block text-xs sm:text-sm font-bold text-[var(--text)] truncate">
          {participant.displayName}
        </span>
        <div className="mt-1 flex items-center justify-center gap-1.5 h-4">
          {isMuted ? (
            <span className="text-[11px] font-medium text-rose-500">Muted</span>
          ) : activeSpeaking ? (
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A36A]">
              <span>Speaking</span>
              <span className="flex items-center gap-0.5 h-2.5 ml-0.5">
                <span className="w-0.5 h-2.5 bg-[#16A36A] rounded-full animate-wave-1" />
                <span className="w-0.5 h-2.5 bg-[#16A36A] rounded-full animate-wave-2" />
                <span className="w-0.5 h-2.5 bg-[#16A36A] rounded-full animate-wave-3" />
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-[var(--text-muted)]">Connected</span>
          )}
        </div>
      </div>
    </div>
  );
}
