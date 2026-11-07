import { Message } from '@talknow/shared';
import { formatTime } from '@/lib/utils';
import { Check } from 'lucide-react';

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  showSender: boolean;
}

export function MessageItem({ message, isOwnMessage, showSender }: MessageItemProps) {
  return (
    <div
      className={`flex w-full select-text ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`relative min-w-[75px] max-w-[85%] sm:max-w-md px-3.5 pt-2 pb-4 shadow-2xs ${
          isOwnMessage
            ? 'bg-[#7657E8] text-white rounded-2xl rounded-tr-xs'
            : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-2xl rounded-tl-xs'
        }`}
      >
        {/* Sender name for received messages in group conversation */}
        {!isOwnMessage && showSender && (
          <div className="text-[11px] font-bold text-[#7657E8] dark:text-[#A78BFA] leading-tight mb-1 select-none">
            {message.senderName || 'Anonymous'}
          </div>
        )}

        {/* Message text */}
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
    </div>
  );
}
