'use client';

import { useState } from 'react';
import { Member } from '@talknow/shared';

export function usePresence(initialMembers: Member[] = []) {
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const updateMemberStatus = (memberId: string, isOnline: boolean) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, isOnline } : m))
    );
  };

  const addMember = (member: Member) => {
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === member.id);
      if (exists) {
        return prev.map((m) => (m.id === member.id ? member : m));
      }
      return [...prev, member];
    });
  };

  return {
    members,
    setMembers,
    updateMemberStatus,
    addMember,
  };
}
