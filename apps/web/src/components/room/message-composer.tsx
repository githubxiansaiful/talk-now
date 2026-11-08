'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import { EmojiPickerPopover } from './emoji-picker-popover';

const MAX_MESSAGE_LENGTH = 2000;

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
}

export function MessageComposer({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
}: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setContent('');
    setIsEmojiOpen(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      onTypingStop?.();
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart || content.length;
      const end = textareaRef.current.selectionEnd || content.length;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      setContent(newContent);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const nextPos = start + emoji.length;
          textareaRef.current.setSelectionRange(nextPos, nextPos);
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
        }
      }, 10);
    } else {
      setContent((prev) => prev + emoji);
    }

    if (onTypingStart) {
      onTypingStart();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStop?.();
      }, 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_MESSAGE_LENGTH) return;
    setContent(value);

    // Auto resize textarea height smoothly
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }

    // Typing debounce
    if (onTypingStart) {
      onTypingStart();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStop?.();
      }, 2500);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const hasText = Boolean(content.trim());
  const showSendButton = isFocused || hasText;
  const isNearLimit = content.length > 1600;

  return (
    <div className="p-2.5 sm:p-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-transparent shrink-0 relative z-20">
      <div className="max-w-[850px] mx-auto">
        <div className="px-2.5 sm:px-3 py-1.5 flex items-end gap-1.5 rounded-2xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#7657E8]/20 focus-within:border-[#7657E8]">
          {/* Emoji Picker Popover */}
          <div className="relative shrink-0 pb-1">
            <button
              type="button"
              onClick={() => setIsEmojiOpen((prev) => !prev)}
              disabled={disabled}
              className={`p-2 transition-colors rounded-xl shrink-0 cursor-pointer disabled:opacity-50 ${
                isEmojiOpen
                  ? 'text-[#7657E8] bg-[#7657E8]/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]'
              }`}
              aria-label="Insert emoji"
              title="Insert emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            <EmojiPickerPopover
              isOpen={isEmojiOpen}
              onClose={() => setIsEmojiOpen(false)}
              onSelectEmoji={handleSelectEmoji}
              positionClassName="bottom-full mb-3 left-0"
            />
          </div>

          {/* Textarea Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={disabled ? 'Conversation has ended' : 'Type a message... (Enter to send)'}
            disabled={disabled}
            className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] resize-none py-2 px-1 max-h-36 min-h-[38px] leading-relaxed"
          />

          {/* Near limit character counter */}
          {isNearLimit && (
            <span
              className={`text-[10px] font-mono pb-2 shrink-0 ${
                content.length >= MAX_MESSAGE_LENGTH
                  ? 'text-rose-500 font-bold'
                  : 'text-amber-500'
              }`}
            >
              {MAX_MESSAGE_LENGTH - content.length}
            </span>
          )}

          {/* Send Button */}
          <div className="shrink-0 pb-0.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSend}
              disabled={!hasText || disabled}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                hasText
                  ? 'bg-[#7657E8] text-white hover:bg-[#6545D5] active:scale-95 shadow-sm shadow-[#7657E8]/25'
                  : showSendButton
                    ? 'text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--surface-secondary)] disabled:opacity-40 disabled:cursor-not-allowed'
                    : 'text-[var(--text-muted)] opacity-50 cursor-not-allowed'
              }`}
              aria-label="Send message"
              title="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                fill="currentColor"
                className="w-4 h-4 ml-0.5"
                aria-hidden="true"
              >
                <path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
