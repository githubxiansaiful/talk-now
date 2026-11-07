'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@talknow/shared';
import { formatTime } from '@/lib/utils';
import { Check, Smile, Plus } from 'lucide-react';
import { EmojiPickerPopover } from './emoji-picker-popover';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  showSender: boolean;
  currentMemberId?: string;
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageItem({
  message,
  isOwnMessage,
  showSender,
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

  const hasReactions = message.reactions && message.reactions.length > 0;

  return (
    <div
      className={`group relative flex w-full select-text py-0.5 ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      <div className="relative max-w-[85%] sm:max-w-md">
        {/* Quick Reaction Bar (WhatsApp / Messenger style) */}
        {showReactionMenu && (
          <div
            ref={menuRef}
            className={`absolute z-40 -top-11 flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xl animate-in zoom-in-95 duration-150 ${
              isOwnMessage ? 'right-0' : 'left-0'
            }`}
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
                    hasReacted ? 'bg-[#7657E8]/20 ring-1 ring-[#7657E8]' : 'hover:bg-[var(--surface-secondary)]'
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
                positionClassName={`bottom-full mb-2 ${isOwnMessage ? 'right-0' : 'left-0'}`}
              />
            </div>
          </div>
        )}

        {/* Reaction Trigger Button (visible on hover or when menu is open) */}
        <button
          type="button"
          onClick={() => setShowReactionMenu((prev) => !prev)}
          className={`absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] shadow-xs transition-opacity cursor-pointer z-20 ${
            isOwnMessage ? '-left-8' : '-right-8'
          } ${
            showReactionMenu
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
          }`}
          aria-label="React to message"
          title="React"
        >
          <Smile className="w-3.5 h-3.5" />
        </button>

        {/* Message Bubble */}
        <div
          className={`relative min-w-[75px] px-3.5 pt-2 pb-4 shadow-2xs ${
            isOwnMessage
              ? 'bg-[#7657E8] text-white rounded-2xl rounded-tr-xs'
              : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl rounded-tl-xs'
          }`}
        >
          {/* Sender name for received messages */}
          {!isOwnMessage && showSender && (
            <div className="text-[11px] font-bold text-[#7657E8] dark:text-[#A78BFA] leading-tight mb-1 select-none">
              {message.senderName || 'Anonymous'}
            </div>
          )}

          {/* Message content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Absolute timestamp */}
          <span
            className={`absolute right-2.5 bottom-1 inline-flex items-center gap-0.5 text-[10px] select-none leading-none ${
              isOwnMessage ? 'text-white/75' : 'text-[var(--text-muted)]'
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>
            {isOwnMessage && <Check className="w-3 h-3 stroke-[2.5]" />}
          </span>
        </div>

        {/* Reaction badges pill below bubble (WhatsApp / Messenger style) */}
        {hasReactions && (
          <div
            className={`flex items-center gap-1 mt-1 flex-wrap ${
              isOwnMessage ? 'justify-end' : 'justify-start'
            }`}
          >
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
  );
}
