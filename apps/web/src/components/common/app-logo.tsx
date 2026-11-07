import Link from 'next/link';
import { MessageSquareShare } from 'lucide-react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function AppLogo({ size = 'md', showTagline = false }: AppLogoProps) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
      <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#7657E8] to-[#9B82F3] text-white p-2 shadow-sm shadow-[#7657E8]/20 group-hover:scale-105 transition-transform duration-200">
        <MessageSquareShare className={iconSizes[size]} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`font-bold tracking-tight text-[var(--text)] ${textSizes[size]}`}>
            Talk<span className="text-[#7657E8]">Now</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-[var(--text-secondary)]">Instant private rooms</span>
        )}
      </div>
    </Link>
  );
}
