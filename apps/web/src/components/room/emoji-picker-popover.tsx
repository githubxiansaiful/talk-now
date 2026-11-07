'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { EmojiClickData } from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';
import { X } from 'lucide-react';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className="w-[320px] h-[360px] sm:w-[350px] sm:h-[400px] flex items-center justify-center bg-[var(--surface)] rounded-2xl">
      <div className="flex flex-col items-center gap-2">
        <span className="w-5 h-5 border-2 border-[#7657E8] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[var(--text-secondary)] font-medium">Loading emojis...</span>
      </div>
    </div>
  ),
});

interface EmojiPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  positionClassName?: string;
  title?: string;
}

export function EmojiPickerPopover({
  isOpen,
  onClose,
  onSelectEmoji,
  positionClassName = 'bottom-full mb-3 right-0 sm:left-0',
  title,
}: EmojiPickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Detect dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Delay adding click outside to avoid immediate close on toggle click
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleClickOutside);
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelectEmoji(emojiData.emoji);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute z-50 animate-in fade-in zoom-in-95 duration-150 ${positionClassName}`}
    >
      <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
        {title && (
          <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-secondary)]/50">
            <span className="text-xs font-semibold text-[var(--text)]">{title}</span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
              aria-label="Close emoji picker"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <EmojiPicker
          theme={isDark ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={false}
          lazyLoadEmojis={true}
          searchPlaceHolder="Search emoji..."
          previewConfig={{ showPreview: false }}
          width={320}
          height={380}
        />
      </div>
    </div>
  );
}
