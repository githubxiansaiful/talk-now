import Link from 'next/link';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <AppLogo size="sm" showTagline />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Temporary, private group chats without the fuss.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
            <Link href="/create" className="hover:text-[var(--text)] transition-colors">
              Create Room
            </Link>
            <Link href="/privacy" className="hover:text-[var(--text)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--text)] transition-colors">
              Terms
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
          <p>© {new Date().getFullYear()} TalkNow. All rooms automatically self-destruct upon expiry.</p>
          <p>Strictly ephemeral • Zero tracking scripts</p>
        </div>
      </div>
    </footer>
  );
}
