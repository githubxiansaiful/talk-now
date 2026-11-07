'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Shield, Clock, Users, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCode.trim().replace(/^.*\/room\//, '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanCode) {
      setJoinError('Please enter a valid room code or link');
      return;
    }
    router.push(`/room/${cleanCode}`);
  };

  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#7657E8]/10 via-[#7657E8]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text)] max-w-4xl mx-auto leading-[1.12]">
          A conversation starts with <span className="text-[#7657E8]">one click.</span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Create a private room, invite your friends, and start talking instantly.
          No accounts, no passwords, no hassle.
        </p>

        {/* Call to actions - Clean & balanced across all devices */}
        <div className="mt-10 max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
            <Link href="/create" className="w-full sm:w-auto shrink-0">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-semibold shadow-md shadow-[#7657E8]/20 gap-2"
              >
                Create a room
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1">
              or
            </span>

            {/* Unified join bar */}
            <form
              onSubmit={handleJoin}
              className="flex-1 w-full sm:w-auto min-w-[280px] sm:min-w-[320px] flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 shadow-xs hover:border-[#7657E8]/40 focus-within:border-[#7657E8] focus-within:ring-2 focus-within:ring-[#7657E8]/20 transition-all"
            >
              <input
                type="text"
                placeholder="Paste room code or link..."
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                  setJoinError('');
                }}
                className="flex-1 min-w-0 px-3.5 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] bg-transparent focus:outline-none"
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="h-10 px-4 rounded-lg font-semibold shrink-0 gap-1.5 bg-[var(--surface-secondary)] hover:bg-[#7657E8] hover:text-white transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Join</span>
              </Button>
            </form>
          </div>

          {joinError && (
            <p className="mt-2.5 text-xs text-[#DC4C4C] font-medium animate-in fade-in duration-150">
              {joinError}
            </p>
          )}
        </div>

        {/* Feature badge row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#16A36A]" />
            <span>Private & auto-expiring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#7657E8]" />
            <span>Choice of 30m to 24h duration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#7657E8]" />
            <span>Multi-member group rooms</span>
          </div>
        </div>

        {/* Realistic interactive UI preview mockup */}
        <div className="mt-14 relative max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-5 shadow-xl shadow-black/[0.04]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
              </div>
              <span className="text-xs font-semibold text-[var(--text)] ml-2">Quick Design Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)] px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3 text-[#7657E8]" />
                42m remaining
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--success)] bg-[var(--success-light)] px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                4 online
              </span>
            </div>
          </div>

          <div className="space-y-3.5 text-left text-xs sm:text-sm">
            {/* Message 1 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/60 text-[#7657E8] font-bold flex items-center justify-center shrink-0 text-xs">
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text)]">Saiful</span>
                  <span className="text-[10px] text-[var(--text-muted)]">2:40 PM</span>
                  <span className="text-[9px] bg-[#7657E8]/10 text-[#7657E8] px-1.5 py-0.2 rounded font-medium">Creator</span>
                </div>
                <div className="mt-1 bg-[var(--surface-secondary)] text-[var(--text)] p-2.5 rounded-xl rounded-tl-sm max-w-md inline-block">
                  Hey everyone! Glad you could make it. Here is the link for our quick check-in.
                </div>
              </div>
            </div>

            {/* Message 2 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 font-bold flex items-center justify-center shrink-0 text-xs">
                A
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--text)]">Alex</span>
                  <span className="text-[10px] text-[var(--text-muted)]">2:41 PM</span>
                </div>
                <div className="mt-1 bg-[var(--surface-secondary)] text-[var(--text)] p-2.5 rounded-xl rounded-tl-sm max-w-md inline-block">
                  Jumped in right from my phone! No account login was super smooth.
                </div>
              </div>
            </div>

            {/* Message 3 (Own message) */}
            <div className="flex justify-end">
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[10px] text-[var(--text-muted)]">2:42 PM</span>
                  <span className="font-semibold text-[var(--text)]">You</span>
                </div>
                <div className="mt-1 bg-[#7657E8] text-white p-2.5 rounded-xl rounded-tr-sm max-w-md inline-block text-left shadow-xs">
                  I reviewed the wireframes. Everything looks clean and ready to launch!
                </div>
              </div>
            </div>

            {/* Typing indicator preview */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] pt-1">
              <div className="flex gap-1 items-center bg-[var(--surface-secondary)] px-3 py-1.5 rounded-full">
                <span className="text-[11px] font-medium">Maria is typing</span>
                <span className="flex gap-0.5 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
