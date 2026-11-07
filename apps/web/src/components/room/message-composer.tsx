'use client';

import { useState, useRef, useEffect } from 'react';
import { Paperclip, Smile, Mic, Sparkles } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close coming soon dialog on Escape
  useEffect(() => {
    if (!comingSoonFeature) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setComingSoonFeature(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [comingSoonFeature]);

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

  const hasText = Boolean(content.trim());
  const showSendButton = isFocused || hasText;

  return (
    <>
      <div className="p-2 sm:p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-transparent shrink-0 relative z-20">
        <div className="max-w-[850px] mx-auto">
          {/* WhatsApp-style Pill Composer */}
          <div className="px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-1.5 rounded-full bg-[var(--surface)] dark:bg-[#202c33] border border-[var(--border)] dark:border-[#2a3942] shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#7657E8]/20 focus-within:border-[#7657E8]">
            {/* Left Button 1: Attach Files */}
            <button
              type="button"
              onClick={() => setComingSoonFeature('File sharing')}
              disabled={disabled}
              className="p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors rounded-full shrink-0 cursor-pointer disabled:opacity-50"
              aria-label="Attach file"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 -rotate-45" />
            </button>

            {/* Left Button 2: Emoji / GIF */}
            <button
              type="button"
              onClick={() => setComingSoonFeature('Emoji & GIF')}
              disabled={disabled}
              className="p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors rounded-full shrink-0 cursor-pointer disabled:opacity-50"
              aria-label="Emoji & GIFs"
              title="Emoji & GIFs"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Textarea Input */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={disabled ? 'Conversation ended' : 'Type a message'}
              disabled={disabled}
              className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-base sm:text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] resize-none py-2 px-1 max-h-32 min-h-[38px] leading-snug"
            />

            {/* Mic button (voice messages coming soon - only visible when not typing or focused) */}
            {!showSendButton && (
              <button
                type="button"
                onClick={() => setComingSoonFeature('Voice messages')}
                disabled={disabled}
                className="p-1.5 sm:p-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors rounded-full shrink-0 cursor-pointer disabled:opacity-50"
                aria-label="Voice message"
                title="Voice message"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}

            {/* Paper-plane send button with user's custom SVG - shown only when typing or focused */}
            {showSendButton && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleSend}
                disabled={!hasText || disabled}
                className={`p-2 sm:p-2.5 rounded-full transition-all shrink-0 cursor-pointer ${
                  hasText
                    ? 'bg-[#7657E8] text-white hover:bg-[#6545D5] active:scale-90 shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed'
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
            )}
          </div>
        </div>
      </div>

      {/* Feature Coming Soon Alert Dialog */}
      {comingSoonFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-xs w-full p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#7657E8]/10 text-[#7657E8] border border-[#7657E8]/20 flex items-center justify-center mb-4">
              {comingSoonFeature === 'File sharing' ? (
                <Paperclip className="w-6 h-6 -rotate-45" />
              ) : comingSoonFeature === 'Emoji & GIF' ? (
                <Smile className="w-6 h-6" />
              ) : comingSoonFeature === 'Voice messages' ? (
                <Mic className="w-6 h-6" />
              ) : (
                <Sparkles className="w-6 h-6" />
              )}
            </div>
            <h3 className="text-base font-bold text-[var(--text)] mb-1.5">Coming Soon</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5">
              {comingSoonFeature} is currently in development and will be available in an upcoming update.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs font-semibold h-9"
              onClick={() => setComingSoonFeature(null)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
