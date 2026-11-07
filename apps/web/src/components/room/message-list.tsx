'use client';

import { useEffect, useRef } from 'react';
import { Message, Member } from '@talknow/shared';
import { MessageItem } from './message-item';
import { Lock } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentMemberId?: string;
  members?: Member[];
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageList({ messages, currentMemberId, members, onReact }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on initial load and when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 overscroll-contain select-text"
    >
      <div className="min-h-full flex flex-col justify-end space-y-2 max-w-[850px] mx-auto w-full">
        {/* WhatsApp-style security pill anchored above the conversation */}
        <div className="flex flex-col items-center my-3 select-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--surface-secondary)]/90 border border-[var(--border)] text-[11px] text-[var(--text-secondary)] max-w-sm text-center shadow-2xs leading-snug">
            <Lock className="w-3 h-3 text-[#7657E8] shrink-0" />
            <span>Messages in this room are temporary and deleted upon expiry.</span>
          </div>

          <div className="mt-2.5">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)] shadow-2xs">
              Today
            </span>
          </div>
        </div>

        {/* Message Items */}
        {messages.map((message, index) => {
          const isOwn = message.isOwnMessage || message.memberId === currentMemberId;
          const senderMember = members?.find((m) => m.id === message.memberId);
          const isCreator = Boolean(message.senderIsCreator ?? senderMember?.isCreator);

          return (
            <MessageItem
              key={message.id || index}
              message={message}
              isOwnMessage={isOwn}
              isCreator={isCreator}
              currentMemberId={currentMemberId}
              onReact={onReact}
            />
          );
        })}

        <div ref={bottomRef} className="h-0.5" />
      </div>
    </div>
  );
}
