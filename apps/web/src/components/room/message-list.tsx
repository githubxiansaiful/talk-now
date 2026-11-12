'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Message, Member } from '@talknow/shared';
import { MessageItem } from './message-item';
import { Lock, Share2, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageListProps {
  messages: Message[];
  currentMemberId?: string;
  members?: Member[];
  onReact?: (messageId: string, emoji: string) => void;
  onOpenInvite?: () => void;
}

export function MessageList({
  messages,
  currentMemberId,
  members,
  onReact,
  onOpenInvite,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const isNearBottomRef = useRef(true);
  const isInitialScrollDoneRef = useRef(false);
  const prevMessagesLengthRef = useRef(0);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = containerRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom < 160;
    setShowScrollDown(distanceFromBottom > 180);
  };

  const handleScrollToBottomClick = () => {
    isNearBottomRef.current = true;
    scrollToBottom(true);
    setShowScrollDown(false);
  };

  // Keep anchored to bottom on resize (e.g. keyboard open on mobile, window resize, font/image load)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (isNearBottomRef.current) {
        el.scrollTop = el.scrollHeight;
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset initial scroll marker if messages reset to empty
  useEffect(() => {
    if (messages.length === 0) {
      isInitialScrollDoneRef.current = false;
      prevMessagesLengthRef.current = 0;
    }
  }, [messages.length]);

  // Auto-scroll logic for initial load/refresh and incoming messages
  useEffect(() => {
    if (messages.length === 0) return;

    const el = containerRef.current;
    if (!el) return;

    const lastMessage = messages[messages.length - 1];
    const isOwnLastMessage =
      lastMessage && (lastMessage.isOwnMessage || lastMessage.memberId === currentMemberId);

    // Initial load or page refresh with messages: snap immediately to the bottom
    if (!isInitialScrollDoneRef.current) {
      scrollToBottom(false);

      const rAF = requestAnimationFrame(() => {
        scrollToBottom(false);
      });

      const timer = setTimeout(() => {
        scrollToBottom(false);
        isInitialScrollDoneRef.current = true;
      }, 50);

      prevMessagesLengthRef.current = messages.length;
      return () => {
        cancelAnimationFrame(rAF);
        clearTimeout(timer);
      };
    }

    // Subsequent updates: If the user sent a message OR is already near bottom, scroll down
    if (messages.length > prevMessagesLengthRef.current) {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const shouldScroll = isOwnLastMessage || isNearBottomRef.current || distanceFromBottom < 220;

      if (shouldScroll) {
        scrollToBottom(true);
      }
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, currentMemberId, scrollToBottom]);

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 overscroll-contain select-text"
      >
        <div className="min-h-full flex flex-col max-w-[850px] mx-auto w-full">
          {/* Spacer pushing messages towards bottom if few, but collapsing to 0 when overflowing */}
          <div className="flex-1 min-h-0" />

          {/* Ephemeral privacy pill anchored above the conversation */}
          <div className="flex flex-col items-center my-3 select-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)]/95 border border-[var(--border)] text-[11px] text-[var(--text-secondary)] max-w-md text-center shadow-2xs leading-snug">
              <Lock className="w-3 h-3 text-[#7657E8] shrink-0" />
              <span>Messages in this room are ephemeral and permanently wiped when the timer expires.</span>
            </div>
          </div>

          {/* Empty state when no messages have been sent yet */}
          {messages.length === 0 && (
            <div className="my-auto py-8 flex flex-col items-center justify-center text-center select-none">
              <div className="p-6 rounded-3xl bg-[var(--surface)]/95 backdrop-blur-xs border border-[var(--border)] shadow-sm max-w-sm w-full">
                <div className="w-11 h-11 rounded-2xl bg-[#7657E8]/10 border border-[#7657E8]/20 text-[#7657E8] flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text)] mb-1">
                  Room is Ready
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Send the first message below or invite others to join this disposable room for real-time private group chat.
                </p>
                {onOpenInvite && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onOpenInvite}
                      className="text-xs font-semibold gap-1.5 h-8 rounded-xl"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#7657E8]" />
                      <span>Share Invite</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message Items */}
          {messages.map((message, index) => {
            const isOwn = message.isOwnMessage || message.memberId === currentMemberId;
            const senderMember = members?.find((m) => m.id === message.memberId);
            const isCreator = Boolean(message.senderIsCreator ?? senderMember?.isCreator);

            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isSameSender =
              prevMessage &&
              prevMessage.messageType !== 'SYSTEM' &&
              message.messageType !== 'SYSTEM' &&
              prevMessage.memberId === message.memberId;
            const isWithinTwoMinutes =
              prevMessage &&
              Math.abs(
                new Date(message.createdAt).getTime() -
                  new Date(prevMessage.createdAt).getTime()
              ) <
                2 * 60 * 1000;
            const isGrouped = Boolean(isSameSender && isWithinTwoMinutes);

            return (
              <MessageItem
                key={message.id || index}
                message={message}
                isOwnMessage={isOwn}
                isCreator={isCreator}
                isGrouped={isGrouped}
                currentMemberId={currentMemberId}
                onReact={onReact}
              />
            );
          })}

          <div ref={bottomRef} className="h-1" />
        </div>
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollDown && (
        <button
          type="button"
          onClick={handleScrollToBottomClick}
          className="absolute bottom-3 right-4 sm:right-6 z-20 h-9 px-3 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-lg text-xs font-semibold text-[var(--text)] hover:border-[#7657E8]/40 flex items-center gap-1.5 transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-150"
          title="Scroll to latest messages"
        >
          <ChevronDown className="w-4 h-4 text-[#7657E8]" />
          <span>Latest</span>
        </button>
      )}
    </div>
  );
}
