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
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <AppLogo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/create">
              <Button size="sm" className="hidden sm:inline-flex">
                <Plus className="w-4 h-4 mr-1" />
                New Room
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
