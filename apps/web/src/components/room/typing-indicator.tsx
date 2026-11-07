interface TypingIndicatorProps {
  typingUsers: string[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  const validUsers = (typingUsers || []).filter((u) => u && Boolean(u.trim()));
  if (validUsers.length === 0) return null;

  let text = '';
  if (validUsers.length === 1) {
    text = `${validUsers[0]} is typing...`;
  } else if (validUsers.length === 2) {
    text = `${validUsers[0]} and ${validUsers[1]} are typing...`;
  } else {
    text = `${validUsers[0]} and ${validUsers.length - 1} others are typing...`;
  }

  return (
    <div className="flex items-center gap-2 py-1 px-4 text-xs text-[var(--text-secondary)] relative z-20">
      <div className="flex items-center gap-2 bg-[var(--surface)]/95 border border-[var(--border)] px-3.5 py-1.5 rounded-full shadow-xs backdrop-blur-xs">
        <span className="font-semibold text-[var(--text)]">{text}</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-1" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-2" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-3" />
        </span>
      </div>
    </div>
  );
}
