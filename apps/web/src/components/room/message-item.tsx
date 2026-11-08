'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@talknow/shared';
import { formatTime } from '@/lib/utils';
import { Smile, Plus, Copy, Check, Crown, Phone, PhoneOff, UserPlus, Sparkles } from 'lucide-react';
import { EmojiPickerPopover } from './emoji-picker-popover';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

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

const URL_REGEX = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;

function renderContentWithLinks(text: string, isOwnMessage: boolean) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) => {
    if (URL_REGEX.test(part)) {
      URL_REGEX.lastIndex = 0;
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 break-all transition-opacity hover:opacity-85 ${
            isOwnMessage
              ? 'text-white font-medium decoration-white/70'
              : 'text-[#7657E8] dark:text-[#A78BFA] font-medium decoration-[#7657E8]/50'
          }`}
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  isCreator?: boolean;
  isGrouped?: boolean;
  currentMemberId?: string;
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageItem({
  message,
  isOwnMessage,
  isCreator = false,
  isGrouped = false,
  currentMemberId,
  onReact,
}: MessageItemProps) {
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [showFullPicker, setShowFullPicker] = useState(false);
  const [copied, setCopied] = useState(false);
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

  // Render system notifications cleanly as a centered pill (Messenger / Telegram style)
  if (message.messageType === 'SYSTEM') {
    const contentLower = message.content.toLowerCase();
    const isCall = contentLower.includes('call');
    const isCallEnd = isCall && (contentLower.includes('left') || contentLower.includes('end'));
    const isRoomJoin = contentLower.includes('room');

    return (
      <div className="flex justify-center my-2.5 select-none animate-in fade-in duration-200">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--surface)]/95 dark:bg-[var(--surface-secondary)]/90 border border-[var(--border)]/80 text-xs text-[var(--text-secondary)] shadow-2xs backdrop-blur-xs">
          {isCallEnd ? (
            <PhoneOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          ) : isCall ? (
            <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : isRoomJoin ? (
            <UserPlus className="w-3.5 h-3.5 text-[#7657E8] shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#7657E8] shrink-0" />
          )}
          <span className="font-medium text-[var(--text)] text-[11.5px]">{message.content}</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono ml-0.5 tabular-nums">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }

  const handleQuickReact = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowReactionMenu(false);
  };

  const handleCustomEmojiReact = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowFullPicker(false);
    setShowReactionMenu(false);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const senderName = message.senderName || 'Anonymous';
  const initial = senderName.charAt(0).toUpperCase();
  const hasReactions = message.reactions && message.reactions.length > 0;
  const avatarColor = getAvatarColor(message.memberId || senderName);

  return (
    <div
      className={`group relative flex gap-2.5 sm:gap-3 select-text transition-colors ${
        isOwnMessage ? 'flex-row-reverse' : 'flex-row'
      } ${isGrouped ? 'mt-0.5' : 'mt-3'}`}
    >
      {/* Avatar (hidden placeholder when grouped) */}
      <div className="w-8 shrink-0 flex flex-col items-center">
        {!isGrouped ? (
          <div
            className={`w-8 h-8 rounded-full border font-bold flex items-center justify-center text-xs select-none shadow-2xs ${avatarColor}`}
          >
            {initial}
          </div>
        ) : null}
      </div>

      {/* Message Content Column */}
      <div
        className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[72%] ${
          isOwnMessage ? 'items-end' : 'items-start'
        }`}
      >
        {/* Header: Name, Creator badge, Time (shown only on first message of a group) */}
        {!isGrouped && (
          <div
            className={`flex items-center gap-1.5 select-none mb-1 leading-none px-0.5 ${
              isOwnMessage ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <span className="font-semibold text-[var(--text)] text-xs">
              {isOwnMessage ? 'You' : senderName}
            </span>
            {isCreator && (
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-500/12 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-semibold">
                <Crown className="w-2.5 h-2.5" />
                Host
              </span>
            )}
            <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        {/* Bubble container with reaction popover & hover actions */}
        <div className="relative inline-flex flex-col">
          {/* Quick Reaction Bar */}
          {showReactionMenu && (
            <div
              ref={menuRef}
              className={`absolute z-40 -top-11 flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xl animate-in zoom-in-95 duration-150 ${
                isOwnMessage ? 'right-0' : 'left-0'
              }`}
            >
              {QUICK_REACTIONS.map((emoji) => {
                const hasReacted = message.reactions?.some(
                  (r) =>
                    r.emoji === emoji &&
                    currentMemberId &&
                    r.memberIds.includes(currentMemberId)
                );
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleQuickReact(emoji)}
                    className={`text-lg p-1 rounded-full transition-transform hover:scale-125 active:scale-95 cursor-pointer leading-none ${
                      hasReacted
                        ? 'bg-[#7657E8]/20 ring-1 ring-[#7657E8]'
                        : 'hover:bg-[var(--surface-secondary)]'
                    }`}
                    title={`React with ${emoji}`}
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

          {/* Main Bubble + Hover Action Triggers */}
          <div
            className={`inline-flex items-center gap-1.5 ${
              isOwnMessage ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-2xs ${
                isOwnMessage
                  ? `bg-[#7657E8] text-white rounded-2xl ${
                      isGrouped ? 'rounded-tr-lg' : 'rounded-tr-xs'
                    }`
                  : `bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl ${
                      isGrouped ? 'rounded-tl-lg' : 'rounded-tl-xs'
                    }`
              }`}
            >
              {renderContentWithLinks(message.content, isOwnMessage)}
            </div>

            {/* Hover Action Buttons: React & Copy */}
            <div
              className={`flex items-center gap-1 transition-opacity ${
                showReactionMenu
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowReactionMenu((prev) => !prev)}
                className="p-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] shadow-2xs cursor-pointer transition-colors"
                aria-label="React to message"
                title="Add reaction"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="p-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] shadow-2xs cursor-pointer transition-colors"
                aria-label="Copy message"
                title="Copy message text"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Reaction badges pill below bubble */}
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
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all cursor-pointer shadow-2xs border ${
                      isUserReacted
                        ? 'bg-[#7657E8]/15 border-[#7657E8]/40 text-[#7657E8] dark:text-[#A78BFA] font-semibold'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]'
                    }`}
                    title={`${reaction.count} reaction${reaction.count > 1 ? 's' : ''}`}
                  >
                    <span className="text-xs leading-none">{reaction.emoji}</span>
                    {reaction.count > 1 && (
                      <span className="text-[10px] font-medium leading-none tabular-nums">
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
