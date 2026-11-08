import Link from 'next/link';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#7657E8]/20 selection:text-[#7657E8]">
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)]/80 bg-[var(--surface)]/75 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--surface)]/65 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <AppLogo />
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)]">
              <Link
                href="/#how-it-works"
                className="px-3 py-1.5 rounded-lg hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]/70 transition-colors"
              >
                How it works
              </Link>
              <Link
                href="/#features"
                className="px-3 py-1.5 rounded-lg hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]/70 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/privacy"
                className="px-3 py-1.5 rounded-lg hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]/70 transition-colors"
              >
                Privacy
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)]/80 border border-[var(--border)] px-2.5 py-1 rounded-full mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              <span>No signup required</span>
            </div>
            <ThemeToggle />
            <Link href="/create">
              <Button
                size="sm"
                className="h-9 px-3.5 sm:px-4 rounded-xl font-semibold shadow-sm shadow-[#7657E8]/20 bg-gradient-to-b from-[#8264F0] to-[#6B4CE0] hover:from-[#7657E8] hover:to-[#5E3FD6] border border-white/10"
              >
                <Plus className="w-4 h-4 sm:mr-1" />
                <span>New Room</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
