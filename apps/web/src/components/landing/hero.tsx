'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  LogIn,
  Phone,
  Hash,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCode
      .trim()
      .replace(/^.*\/room\//, '')
      .replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanCode) {
      setJoinError('Please enter a valid room code or invitation link');
      return;
    }
    router.push(`/room/${cleanCode}`);
  };

  const highlights = [
    {
      icon: Shield,
      label: 'Zero-Account Privacy',
      detail: 'No email, phone number, or registration required',
    },
    {
      icon: Clock,
      label: '30m to 24h Auto-Expiry',
      detail: 'Rooms and messages purge automatically on timer end',
    },
    {
      icon: Phone,
      label: 'Text Chat & Voice Calls',
      detail: 'Real-time messaging and low-latency group audio',
    },
    {
      icon: Users,
      label: 'Instant Link Sharing',
      detail: 'Invite up to 200 participants with one private URL',
    },
  ];

  return (
    <section className="relative pt-14 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      {/* Subtle architectural grid background with smooth radial mask */}
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none -z-20"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 20%, black 25%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 20%, black 25%, transparent 100%)',
        }}
      />

      {/* Soft ambient aurora glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-gradient-to-tr from-[#7657E8]/14 via-[#9B82F3]/8 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--surface)]/90 border border-[#7657E8]/25 text-[var(--text-secondary)] shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-[#7657E8]" />
            <span>Private, Self-Destructing Group Chat &amp; Audio Rooms</span>
          </div>
        </div>

        {/* SEO-friendly primary heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text)] max-w-4xl mx-auto leading-[1.1]">
          Instant private conversations that start with{' '}
          <span className="bg-gradient-to-r from-[#7657E8] via-[#9172F8] to-[#5B3FD9] dark:from-[#9E86F8] dark:via-[#B5A1FA] dark:to-[#7E60EE] bg-clip-text text-transparent">
            one click.
          </span>
        </h1>

        {/* Clear, keyword-rich supporting description */}
        <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Create a temporary group room, share a single private link, and collaborate over real-time text chat or live voice calls. No signups, no app downloads, and zero permanent history.
        </p>

        {/* Functional Action Deck: Create Room or Join Existing Room */}
        <div className="mt-10 max-w-xl mx-auto">
          <div className="p-2 rounded-2xl bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] shadow-lg shadow-black/[0.03] dark:shadow-black/25">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Link href="/create" className="w-full sm:w-auto shrink-0">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto h-12 px-6 text-sm sm:text-base font-semibold rounded-xl bg-gradient-to-b from-[#8364F0] to-[#6B4BE0] hover:from-[#7657E8] hover:to-[#5C3CD4] shadow-md shadow-[#7657E8]/25 border border-white/15 gap-2"
                >
                  <span>Create a Room</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>

              <div className="hidden sm:flex items-center px-1">
                <span className="h-6 w-[1px] bg-[var(--border)]" />
              </div>

              {/* Real Room Join Form */}
              <form
                onSubmit={handleJoin}
                className="flex-1 flex items-center bg-[var(--background)] border border-[var(--border)] rounded-xl p-1 focus-within:border-[#7657E8] focus-within:ring-2 focus-within:ring-[#7657E8]/20 transition-all"
              >
                <div className="pl-2.5 pr-1 text-[var(--text-muted)] shrink-0">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter room code or invite link..."
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value);
                    setJoinError('');
                  }}
                  aria-label="Enter room code or invitation link"
                  className="flex-1 min-w-0 px-2 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent focus:outline-none"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="h-9 px-3.5 rounded-lg font-semibold shrink-0 gap-1.5 bg-[var(--surface)] hover:bg-[#7657E8] hover:text-white hover:border-[#7657E8] border border-[var(--border)] shadow-2xs transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Join</span>
                </Button>
              </form>
            </div>
          </div>

          {joinError && (
            <p className="mt-2.5 text-xs text-[#DC4C4C] font-medium animate-in fade-in duration-150">
              {joinError}
            </p>
          )}
        </div>

        {/* Real Platform Highlights Grid */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="p-5 rounded-2xl bg-[var(--surface)]/80 backdrop-blur-sm border border-[var(--border)] hover:border-[#7657E8]/35 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#7657E8]/10 text-[#7657E8] flex items-center justify-center mb-3.5">
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[var(--text)]">{item.label}</h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
