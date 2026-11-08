import Link from 'next/link';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { ShieldCheck } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <AppLogo size="sm" showTagline />
            <p className="text-xs text-[var(--text-secondary)] mt-1 text-center md:text-left">
              Temporary, private group chats and live voice calls without the fuss.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-sm font-medium text-[var(--text-secondary)]">
            <Link href="/create" className="hover:text-[var(--text)] transition-colors">
              Create Room
            </Link>
            <Link href="/#how-it-works" className="hover:text-[var(--text)] transition-colors">
              How it Works
            </Link>
            <Link href="/#features" className="hover:text-[var(--text)] transition-colors">
              Features
            </Link>
            <Link href="/#faq" className="hover:text-[var(--text)] transition-colors">
              FAQ
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
          <div className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] bg-[var(--background)] border border-[var(--border)] px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>Strictly ephemeral • Zero tracking scripts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
