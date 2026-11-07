import { Member } from '@talknow/shared';
import { Crown, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MemberListProps {
  members: Member[];
  currentMemberId?: string;
  maxMembers?: number | null;
}

export function MemberList({ members, currentMemberId, maxMembers }: MemberListProps) {
  const onlineCount = members.filter((m) => m.isOnline).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#7657E8]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            Members
          </span>
        </div>
        <Badge variant="purple" className="text-[11px] px-2 py-0.5">
          {onlineCount} {maxMembers ? `/ ${maxMembers}` : 'online'}
        </Badge>
      </div>

      {/* Member Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {members.map((member) => {
          const isCurrentUser = member.id === currentMemberId;
          const initial = member.displayName.charAt(0).toUpperCase();

          return (
            <div
              key={member.id}
              className={`flex items-center justify-between p-2 rounded-xl text-sm transition-colors ${
                isCurrentUser
                  ? 'bg-[#7657E8]/10 text-[var(--text)] font-medium'
                  : 'hover:bg-[var(--surface-secondary)] text-[var(--text)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center font-bold text-xs text-[var(--text-secondary)]">
                    {initial}
                  </div>
                  {member.isOnline ? (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A36A] ring-2 ring-[var(--surface)]" />
                  ) : (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-neutral-400 ring-2 ring-[var(--surface)]" />
                  )}
                </div>

                <div className="truncate flex items-center gap-1.5">
                  <span className="truncate">{member.displayName}</span>
                  {isCurrentUser && (
                    <span className="text-[10px] text-[var(--text-secondary)] shrink-0">
                      (You)
                    </span>
                  )}
                </div>
              </div>

              {/* Creator badge */}
              {member.isCreator && (
                <div
                  title="Room Creator"
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold shrink-0"
                >
                  <Crown className="w-3 h-3" />
                  <span>Creator</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
