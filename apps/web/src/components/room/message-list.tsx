'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@talknow/shared';
import { MessageItem } from './message-item';
import { MessageSquareDashed } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentMemberId?: string;
}

export function MessageList({ messages, currentMemberId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] mb-3">
          <MessageSquareDashed className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-[var(--text)]">No messages yet</h4>
        <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-xs">
          Say hello and get the conversation started. Messages are ephemeral and will expire with the room.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6">
      <div className="min-h-full flex flex-col justify-end space-y-3">
        {messages.map((message, index) => {
          const isOwn = message.isOwnMessage || message.memberId === currentMemberId;
          const prevMessage = index > 0 ? messages[index - 1] : null;

          // Show sender header if sender changed or more than 3 minutes elapsed
          const showSender =
            !prevMessage ||
            prevMessage.memberId !== message.memberId ||
            new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 180000;

          return (
            <MessageItem
              key={message.id || index}
              message={message}
              isOwnMessage={isOwn}
              showSender={showSender}
            />
          );
        })}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
