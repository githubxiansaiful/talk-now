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
        className={`relative max-w-[85%] sm:max-w-md px-3.5 py-2 shadow-2xs ${
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

        {/* Message text with inline timestamp like WhatsApp */}
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-0.5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words min-w-0 flex-1">
            {message.content}
          </p>

          <span
            className={`inline-flex items-center gap-0.5 text-[10px] select-none shrink-0 self-end translate-y-0.5 pb-0.5 ${
              isOwnMessage ? 'text-white/75' : 'text-[var(--text-muted)]'
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>
            {isOwnMessage && <Check className="w-3 h-3 stroke-[2.5]" />}
          </span>
        </div>
      </div>
    </div>
  );
}
