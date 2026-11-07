interface TypingIndicatorProps {
  typingUsers: string[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (!typingUsers || typingUsers.length === 0) return null;

  let text = '';
  if (typingUsers.length === 1) {
    text = `${typingUsers[0]} is typing`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0]} and ${typingUsers[1]} are typing`;
  } else {
    text = `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`;
  }

  return (
    <div className="flex items-center gap-2 py-1 px-3 text-xs text-[var(--text-secondary)]">
      <div className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] px-3 py-1 rounded-full shadow-xs">
        <span className="font-medium text-[var(--text)]">{text}</span>
        <span className="flex items-center gap-0.5 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-1" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-2" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-3" />
        </span>
      </div>
    </div>
  );
}
