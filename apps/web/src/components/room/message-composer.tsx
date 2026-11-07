'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
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
    <div className="p-3 sm:p-4 bg-[var(--surface)] border-t border-[var(--border)] shrink-0">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative bg-[var(--background)] border border-[var(--border)] focus-within:border-[#7657E8] focus-within:ring-2 focus-within:ring-[#7657E8]/20 rounded-2xl transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Conversation ended' : 'Write a message...'}
            disabled={disabled}
            className="w-full px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent resize-none focus:outline-none max-h-32 min-h-[42px]"
          />
        </div>

        <Button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          size="icon"
          className="h-[42px] w-[42px] rounded-2xl shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <div className="hidden sm:flex items-center justify-between max-w-4xl mx-auto mt-2 px-1 text-[11px] text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <CornerDownLeft className="w-3 h-3" /> Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line
        </span>
        <span>{content.length}/1000</span>
      </div>
    </div>
  );
}
