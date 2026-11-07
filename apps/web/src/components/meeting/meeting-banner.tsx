'use client';

import { Phone, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Meeting } from '@talknow/shared';

interface MeetingBannerProps {
  meeting: Meeting;
  onJoinClick: () => void;
}

export function MeetingBanner({ meeting, onJoinClick }: MeetingBannerProps) {
  const count = meeting.participantCount || 1;

  return (
    <div className="mx-3 sm:mx-6 my-2 p-3 sm:p-3.5 rounded-2xl bg-[var(--surface)] border border-[#7657E8]/30 shadow-lg shadow-[#7657E8]/5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7657E8] to-[#9175F3] text-white flex items-center justify-center shrink-0 shadow-sm relative">
          <Phone className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[var(--surface)]" />
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[var(--text)] truncate">
              Group Audio Meeting
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#7657E8]" />
              {count} {count === 1 ? 'participant' : 'participants'} in call
            </span>
            {meeting.hostDisplayName && (
              <>
                <span>•</span>
                <span className="truncate">Started by {meeting.hostDisplayName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Button
        size="sm"
        onClick={onJoinClick}
        className="shrink-0 bg-[#7657E8] hover:bg-[#6545db] text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-md cursor-pointer transition-all hover:scale-102 active:scale-98"
      >
        Join Meeting
      </Button>
    </div>
  );
}
