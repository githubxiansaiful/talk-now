'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@talknow/shared';
import { formatTime } from '@/lib/utils';
import { Smile, Plus } from 'lucide-react';
import { EmojiPickerPopover } from './emoji-picker-popover';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  isCreator?: boolean;
  currentMemberId?: string;
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageItem({
  message,
  isOwnMessage,
  isCreator = false,
  currentMemberId,
  onReact,
}: MessageItemProps) {
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [showFullPicker, setShowFullPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showReactionMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowReactionMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showReactionMenu]);

  const handleQuickReact = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowReactionMenu(false);
  };

  const handleCustomEmojiReact = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowFullPicker(false);
    setShowReactionMenu(false);
  };

  const senderName = message.senderName || 'Anonymous';
  const initial = senderName.charAt(0).toUpperCase();
  const hasReactions = message.reactions && message.reactions.length > 0;

  return (
    <div className="group relative flex gap-3 select-text py-1.5 transition-colors">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/60 text-[#7657E8] font-bold flex items-center justify-center shrink-0 text-xs select-none shadow-2xs">
        {initial}
      </div>

      {/* Message content and meta */}
      <div className="flex-1 min-w-0">
        {/* Header: Name, (You), Time, Creator badge */}
        <div className="flex items-center gap-2 select-none flex-wrap leading-none">
          <span className="font-semibold text-[var(--text)] text-xs sm:text-sm">
            {senderName}
          </span>
          {isOwnMessage && (
            <span className="text-[10px] text-[var(--text-secondary)] font-normal">
              (You)
            </span>
          )}
          <span className="text-[10px] text-[var(--text-muted)]">
            {formatTime(message.createdAt)}
          </span>
          {isCreator && (
            <span className="text-[9px] bg-[#7657E8]/10 text-[#7657E8] dark:text-[#A78BFA] px-1.5 py-0.5 rounded font-medium">
              Creator
            </span>
          )}
        </div>

        {/* Bubble container with reaction popover & hover trigger */}
        <div className="relative inline-block max-w-[92%] sm:max-w-md mt-1">
          {/* Quick Reaction Bar */}
          {showReactionMenu && (
            <div
              ref={menuRef}
              className="absolute z-40 -top-11 left-0 flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xl animate-in zoom-in-95 duration-150"
            >
              {QUICK_REACTIONS.map((emoji) => {
                const hasReacted = message.reactions?.some(
                  (r) => r.emoji === emoji && currentMemberId && r.memberIds.includes(currentMemberId)
                );
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleQuickReact(emoji)}
                    className={`text-lg p-1 rounded-full transition-transform hover:scale-130 active:scale-95 cursor-pointer leading-none ${
                      hasReacted
                        ? 'bg-[#7657E8]/20 ring-1 ring-[#7657E8]'
                        : 'hover:bg-[var(--surface-secondary)]'
                    }`}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                );
              })}

              {/* Custom Emoji Picker button (+) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFullPicker((prev) => !prev)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
                  title="More emojis"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <EmojiPickerPopover
                  isOpen={showFullPicker}
                  onClose={() => setShowFullPicker(false)}
                  onSelectEmoji={handleCustomEmojiReact}
                  title="React to message"
                  positionClassName="bottom-full mb-2 left-0"
                />
              </div>
            </div>
          )}

          {/* Main Bubble */}
          <div className="inline-flex items-end gap-2 group/bubble">
            <div className="bg-[var(--surface-secondary)] text-[var(--text)] p-2.5 rounded-xl rounded-tl-sm text-sm leading-relaxed whitespace-pre-wrap break-words border border-[var(--border)]/50 shadow-2xs">
              {message.content}
            </div>

            {/* Reaction Trigger Button (visible on hover or when menu is open) */}
            <button
              type="button"
              onClick={() => setShowReactionMenu((prev) => !prev)}
              className={`p-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] shadow-xs transition-opacity cursor-pointer mb-0.5 ${
                showReactionMenu
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
              }`}
              aria-label="React to message"
              title="React"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reaction badges pill below bubble */}
          {hasReactions && (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {message.reactions!.map((reaction) => {
                const isUserReacted = Boolean(
                  currentMemberId && reaction.memberIds.includes(currentMemberId)
                );

                return (
                  <button
                    key={reaction.emoji}
                    type="button"
                    onClick={() => onReact?.(message.id, reaction.emoji)}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all cursor-pointer shadow-2xs border ${
                      isUserReacted
                        ? 'bg-[#7657E8]/15 border-[#7657E8]/40 text-[#7657E8] dark:text-[#A78BFA] font-semibold'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]'
                    }`}
                    title={`${reaction.count} reaction${reaction.count > 1 ? 's' : ''}`}
                  >
                    <span className="text-xs leading-none">{reaction.emoji}</span>
                    {reaction.count > 1 && (
                      <span className="text-[10px] font-medium leading-none">
                        {reaction.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
