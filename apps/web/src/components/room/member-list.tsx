'use client';

import { Member, MeetingParticipant } from '@talknow/shared';
import { Crown, Users, Volume2, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AVATAR_COLORS = [
  'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/25',
  'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25',
  'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
  'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
  'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
];

function getAvatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface MemberListProps {
  members: Member[];
  currentMemberId?: string;
  maxMembers?: number | null;
  meetingParticipants?: MeetingParticipant[];
  onOpenInvite?: () => void;
}

export function MemberList({
  members,
  currentMemberId,
  maxMembers,
  meetingParticipants = [],
  onOpenInvite,
}: MemberListProps) {
  const onlineCount = members.filter((m) => m.isOnline).length;

  // Sort: Current user first, then creator, then online, then alphabetized
  const sortedMembers = [...members].sort((a, b) => {
    if (a.id === currentMemberId) return -1;
    if (b.id === currentMemberId) return 1;
    if (a.isCreator && !b.isCreator) return -1;
    if (!a.isCreator && b.isCreator) return 1;
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    return a.displayName.localeCompare(b.displayName);
  });

  return (
    <div className="flex flex-col h-full bg-[var(--surface)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#7657E8]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            Participants
          </span>
        </div>
        <Badge variant="purple" className="text-[11px] px-2 py-0.5 tabular-nums">
          {onlineCount} {maxMembers ? `/ ${maxMembers}` : 'online'}
        </Badge>
      </div>

      {/* Member Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {sortedMembers.map((member) => {
          const isCurrentUser = member.id === currentMemberId;
          const initial = member.displayName.charAt(0).toUpperCase();
          const avatarColor = getAvatarColor(member.id || member.displayName);
          const inCall = meetingParticipants.some((p) => p.memberId === member.id);

          return (
            <div
              key={member.id}
              className={`flex items-center justify-between p-2.5 rounded-xl text-sm transition-colors ${
                isCurrentUser
                  ? 'bg-[#7657E8]/10 text-[var(--text)] font-medium border border-[#7657E8]/20'
                  : 'hover:bg-[var(--surface-secondary)] text-[var(--text)] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full border font-bold text-xs flex items-center justify-center select-none shadow-2xs ${avatarColor}`}
                  >
                    {initial}
                  </div>
                  {member.isOnline ? (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A36A] ring-2 ring-[var(--surface)]" />
                  ) : (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-neutral-400 ring-2 ring-[var(--surface)]" />
                  )}
                </div>

                <div className="truncate flex items-center gap-1.5 min-w-0">
                  <span className="truncate text-xs font-semibold">{member.displayName}</span>
                  {isCurrentUser && (
                    <span className="text-[10px] text-[#7657E8] font-medium shrink-0">
                      (You)
                    </span>
                  )}
                </div>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-1.5 shrink-0">
                {inCall && (
                  <span
                    title="In voice call"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold"
                  >
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    <span className="hidden sm:inline">Call</span>
                  </span>
                )}

                {member.isCreator && (
                  <div
                    title="Room Creator"
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/12 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-500/20"
                  >
                    <Crown className="w-3 h-3" />
                    <span>Host</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Invite Button */}
      {onOpenInvite && (
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)] shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenInvite}
            className="w-full text-xs font-semibold gap-1.5 h-9 rounded-xl"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#7657E8]" />
            <span>Invite People</span>
          </Button>
        </div>
      )}
    </div>
  );
}
