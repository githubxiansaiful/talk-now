import Link from 'next/link';
import { Clock, Plus, ArrowLeft, ShieldCheck } from 'lucide-react';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';

export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <AppLogo size="sm" />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col justify-center text-center">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            This conversation has ended
          </h1>

          <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            The room duration expired or the room was closed by its creator. All temporary messages and member sessions have been purged.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-start gap-2.5 text-xs text-left text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
            <p>
              By design, TalkNow retains zero permanent logs or chat history. Need to talk again? Start a fresh room in one click.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/create">
              <Button size="lg" className="w-full">
                <Plus className="w-4 h-4 mr-1.5" />
                Start a New Room
              </Button>
            </Link>

            <Link href="/">
              <Button variant="secondary" size="md" className="w-full">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
