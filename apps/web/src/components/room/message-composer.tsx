'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setContent('');
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      onTypingStop?.();
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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

  return (
    <div className="p-2 sm:p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[var(--surface)] border-t border-[var(--border)] shrink-0">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative bg-[var(--background)] border border-[var(--border)] focus-within:border-[#7657E8] focus-within:ring-2 focus-within:ring-[#7657E8]/20 rounded-2xl transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Conversation ended' : 'Type a message...'}
            disabled={disabled}
            className="w-full px-3.5 py-2.5 text-base sm:text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent resize-none focus:outline-none max-h-32 min-h-[42px] leading-snug"
          />
        </div>

        <Button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          size="icon"
          className="h-[42px] w-[42px] rounded-2xl shrink-0 cursor-pointer active:scale-95 transition-transform"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
