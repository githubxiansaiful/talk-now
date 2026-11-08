'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, ArrowLeft } from 'lucide-react';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isCreateOrRoomPage = pathname === '/create' || pathname?.startsWith('/room/');

  const navItems = [
    { label: 'How it works', href: '/#how-it-works', active: false },
    { label: 'Features', href: '/#features', active: false },
    { label: 'FAQ', href: '/#faq', active: false },
    { label: 'Privacy', href: '/privacy', active: pathname === '/privacy' },
    { label: 'Terms', href: '/terms', active: pathname === '/terms' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--surface)]/75 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Consistent Brand Logo */}
        <div className="flex items-center shrink-0">
          <AppLogo size="md" />
        </div>

        {/* Center: Clean Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-[var(--background)]/70 border border-[var(--border)]/70"
        >
          {!isHomePage && (
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
            >
              Home
            </Link>
          )}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                item.active
                  ? 'bg-[var(--surface)] text-[#7657E8] font-semibold shadow-2xs border border-[var(--border)]/60'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)]/70'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Consistent Theme Toggle & Context Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <ThemeToggle />

          {isCreateOrRoomPage ? (
            <Link href="/">
              <Button
                variant="secondary"
                size="sm"
                className="h-9 px-3.5 rounded-xl font-medium text-xs gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Button>
            </Link>
          ) : (
            <Link href="/create">
              <Button
                size="sm"
                className="h-9 px-3.5 sm:px-4 rounded-xl font-semibold text-xs shadow-sm shadow-[#7657E8]/20 bg-[#7657E8] hover:bg-[#6545D5] gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Room</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
