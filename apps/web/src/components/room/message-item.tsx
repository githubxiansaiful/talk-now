import { Message } from '@talknow/shared';
import { formatTime } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  showSender: boolean;
}

export function MessageItem({ message, isOwnMessage, showSender }: MessageItemProps) {
  const initial = message.senderName ? message.senderName.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`flex gap-3 group transition-opacity ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Avatar (only for other members when showSender is true) */}
      {!isOwnMessage && (
        <div className="w-8 shrink-0 flex items-start">
          {showSender ? (
            <div className="w-8 h-8 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[#7657E8] font-bold text-xs flex items-center justify-center shadow-xs">
              {initial}
            </div>
          ) : (
            <div className="w-8" />
          )}
        </div>
      )}

      {/* Message content container */}
      <div className={`max-w-[85%] sm:max-w-md ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {/* Sender name & time if header displayed */}
        {showSender && !isOwnMessage && (
          <div className="flex items-center gap-2 mb-1 pl-1">
            <span className="text-xs font-semibold text-[var(--text)]">
              {message.senderName}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        {showSender && isOwnMessage && (
          <div className="flex items-center justify-end gap-2 mb-1 pr-1">
            <span className="text-[10px] text-[var(--text-muted)]">
              {formatTime(message.createdAt)}
            </span>
            <span className="text-xs font-semibold text-[var(--text)]">You</span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`p-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isOwnMessage
              ? 'bg-[#7657E8] text-white rounded-2xl rounded-tr-sm shadow-xs'
              : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-2xl rounded-tl-sm shadow-xs'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
