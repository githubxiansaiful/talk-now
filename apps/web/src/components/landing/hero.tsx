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
  Sparkles,
  Phone,
  Mic,
  Smile,
  Send,
  Share2,
  Hash,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [inPreviewCall, setInPreviewCall] = useState(false);
  const [copiedDemoLink, setCopiedDemoLink] = useState(false);
  const [reactions, setReactions] = useState<{ fire: number; rocket: number; fireActive: boolean; rocketActive: boolean }>({
    fire: 4,
    rocket: 3,
    fireActive: false,
    rocketActive: false,
  });

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCode
      .trim()
      .replace(/^.*\/room\//, '')
      .replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanCode) {
      setJoinError('Please enter a valid room code or link');
      return;
    }
    router.push(`/room/${cleanCode}`);
  };

  const handleCopyDemo = () => {
    setCopiedDemoLink(true);
    setTimeout(() => setCopiedDemoLink(false), 1800);
  };

  const toggleReaction = (type: 'fire' | 'rocket') => {
    setReactions((prev) => {
      if (type === 'fire') {
        const nextActive = !prev.fireActive;
        return {
          ...prev,
          fireActive: nextActive,
          fire: nextActive ? prev.fire + 1 : prev.fire - 1,
        };
      }
      const nextActive = !prev.rocketActive;
      return {
        ...prev,
        rocketActive: nextActive,
        rocket: nextActive ? prev.rocket + 1 : prev.rocket - 1,
      };
    });
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle architectural grid background with smooth radial mask */}
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none -z-20"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 15%, black 25%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 15%, black 25%, transparent 100%)',
        }}
      />

      {/* Layered soft ambient aurora glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-tr from-[#7657E8]/15 via-[#9B82F3]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[900px] h-[320px] bg-gradient-to-b from-[#7657E8]/[0.06] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow announcement badge */}
        <div className="inline-flex items-center justify-center mb-6">
          <Link
            href="/create"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--surface)]/90 border border-[#7657E8]/25 text-[var(--text)] shadow-xs hover:border-[#7657E8]/50 hover:shadow-md hover:shadow-[#7657E8]/10 transition-all duration-200"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#7657E8]/15 text-[#7657E8]">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span>Ephemeral Group Chat &amp; Live Voice Rooms</span>
            <span className="text-[var(--border)]">•</span>
            <span className="text-[#7657E8] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              Try free
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[var(--text)] max-w-4xl mx-auto leading-[1.08]">
          A conversation starts with{' '}
          <span className="bg-gradient-to-r from-[#7657E8] via-[#9172F8] to-[#5B3FD9] dark:from-[#9E86F8] dark:via-[#B5A1FA] dark:to-[#7E60EE] bg-clip-text text-transparent">
            one click.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-normal">
          Spin up a private, self-destructing room, share one link, and chat or jump on a live voice call instantly. No accounts, no downloads, zero permanent logs.
        </p>

        {/* Unified Action Deck: Create or Join */}
        <div className="mt-9 max-w-xl mx-auto">
          <div className="p-2 rounded-2xl bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)] shadow-lg shadow-black/[0.03] dark:shadow-black/25">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Link href="/create" className="w-full sm:w-auto shrink-0">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto h-12 px-6 text-sm sm:text-base font-semibold rounded-xl bg-gradient-to-b from-[#8364F0] to-[#6B4BE0] hover:from-[#7657E8] hover:to-[#5C3CD4] shadow-md shadow-[#7657E8]/25 border border-white/15 gap-2"
                >
                  <span>Create a room</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>

              <div className="hidden sm:flex items-center px-1">
                <span className="h-6 w-[1px] bg-[var(--border)]" />
              </div>

              {/* Unified join bar */}
              <form
                onSubmit={handleJoin}
                className="flex-1 flex items-center bg-[var(--background)] border border-[var(--border)] rounded-xl p-1 focus-within:border-[#7657E8] focus-within:ring-2 focus-within:ring-[#7657E8]/20 transition-all"
              >
                <div className="pl-2.5 pr-1 text-[var(--text-muted)] shrink-0">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Paste room code or link..."
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value);
                    setJoinError('');
                  }}
                  aria-label="Room code or link"
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

        {/* Trust & Capability Badges */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-medium text-[var(--text-secondary)]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)]/70 border border-[var(--border)]/80">
            <Shield className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>Auto-destructs on expiry</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)]/70 border border-[var(--border)]/80">
            <Clock className="w-3.5 h-3.5 text-[#7657E8]" />
            <span>30m to 24h timers</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)]/70 border border-[var(--border)]/80">
            <Phone className="w-3.5 h-3.5 text-[#7657E8]" />
            <span>Built-in voice huddles</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)]/70 border border-[var(--border)]/80">
            <Users className="w-3.5 h-3.5 text-[#7657E8]" />
            <span>Zero signups</span>
          </div>
        </div>

        {/* Flagship Interactive Room Showcase Mockup */}
        <div className="mt-12 sm:mt-16 relative max-w-4xl mx-auto">
          {/* Outer glowing aura behind the window */}
          <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-b from-[#7657E8]/20 via-[#7657E8]/5 to-transparent blur-xl pointer-events-none -z-10" />

          {/* Translucent outer bezel */}
          <div className="rounded-[24px] sm:rounded-[28px] p-1.5 sm:p-2.5 bg-gradient-to-b from-[var(--border)]/90 via-[var(--border)]/50 to-[var(--border)]/20 border border-[var(--border)]/80 shadow-2xl shadow-[#7657E8]/[0.06] dark:shadow-black/50 backdrop-blur-xl">
            <div className="rounded-[18px] sm:rounded-[20px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              {/* Window Top Header */}
              <div className="px-3.5 sm:px-5 py-3 bg-[var(--surface)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="hidden sm:flex items-center gap-1.5 mr-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#7657E8]/10 text-[#7657E8] font-bold text-xs flex items-center justify-center shrink-0">
                    Q
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[var(--text)] truncate">
                        Quick Design Sync
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyDemo}
                        title="Click to copy demo code"
                        className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[#7657E8] border border-[var(--border)] transition-colors cursor-pointer"
                      >
                        {copiedDemoLink ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-[#16A36A]" />
                            <span className="text-[#16A36A] font-sans">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-2.5 h-2.5" />
                            <span>tn-8x9k</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right status pills */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3 text-[#7657E8]" />
                    <span>42m left</span>
                  </span>
                  <div className="hidden sm:flex -space-x-1.5 items-center mr-0.5">
                    <span className="w-6 h-6 rounded-full bg-violet-500/15 text-[#7657E8] border-2 border-[var(--surface)] text-[10px] font-bold flex items-center justify-center">
                      S
                    </span>
                    <span className="w-6 h-6 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 border-2 border-[var(--surface)] text-[10px] font-bold flex items-center justify-center">
                      A
                    </span>
                    <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-2 border-[var(--surface)] text-[10px] font-bold flex items-center justify-center">
                      M
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--success)] bg-[var(--success-light)] px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                    <span>4 online</span>
                  </span>
                </div>
              </div>

              {/* Live Audio Meeting Banner inside preview */}
              <div className="mx-3 sm:mx-5 mt-3 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-[#7657E8]/[0.08] via-[#7657E8]/[0.04] to-transparent border border-[#7657E8]/25 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7657E8] to-[#9B82F3] text-white flex items-center justify-center shrink-0 shadow-xs relative">
                    <Mic className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--surface)]" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text)]">Live Voice Huddle</span>
                      {/* Animated soundwave bars */}
                      <div className="flex items-center gap-0.5 h-3 px-1.5 py-0.5 rounded-full bg-[#7657E8]/15">
                        <span className="w-0.5 h-2.5 bg-[#7657E8] rounded-full animate-wave-1" />
                        <span className="w-0.5 h-2.5 bg-[#7657E8] rounded-full animate-wave-2" />
                        <span className="w-0.5 h-2.5 bg-[#7657E8] rounded-full animate-wave-3" />
                        <span className="w-0.5 h-2.5 bg-[#7657E8] rounded-full animate-wave-4" />
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] truncate">
                      {inPreviewCall
                        ? 'You, Saiful & Alex are connected in crystal-clear audio'
                        : 'Saiful & Alex are talking • Low-latency audio'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInPreviewCall(!inPreviewCall)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                    inPreviewCall
                      ? 'bg-emerald-500/15 text-[var(--success)] border border-emerald-500/30'
                      : 'bg-[#7657E8] hover:bg-[#6545D5] text-white shadow-xs'
                  }`}
                >
                  {inPreviewCall ? '✓ In Voice Huddle' : 'Join Voice'}
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="p-3.5 sm:p-5 space-y-3.5 text-left text-xs sm:text-sm bg-[var(--background)]/40">
                {/* Message 1 */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-500/15 text-[#7657E8] font-bold flex items-center justify-center shrink-0 text-xs border border-[#7657E8]/20">
                    S
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text)]">Saiful</span>
                      <span className="text-[10px] bg-[#7657E8]/12 text-[#7657E8] px-1.5 py-0.5 rounded-md font-semibold">
                        Creator
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">2:40 PM</span>
                    </div>
                    <div className="mt-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-3.5 py-2.5 rounded-2xl rounded-tl-sm max-w-md inline-block shadow-2xs">
                      Hey everyone! Shared the private room link in Slack—glad we could jump in without creating accounts.
                    </div>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center shrink-0 text-xs border border-sky-500/20">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text)]">Alex</span>
                      <span className="text-[10px] text-[var(--text-muted)]">2:41 PM</span>
                    </div>
                    <div className="mt-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] px-3.5 py-2.5 rounded-2xl rounded-tl-sm max-w-md inline-block shadow-2xs">
                      Joined straight from my phone in 2 seconds. Love that the whole room auto-destructs when we finish!
                    </div>
                    {/* Interactive emoji pills */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleReaction('fire')}
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                          reactions.fireActive
                            ? 'bg-[#7657E8]/15 border-[#7657E8]/40 text-[#7657E8]'
                            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[#7657E8]/30'
                        }`}
                      >
                        <span>🔥</span>
                        <span>{reactions.fire}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleReaction('rocket')}
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                          reactions.rocketActive
                            ? 'bg-[#7657E8]/15 border-[#7657E8]/40 text-[#7657E8]'
                            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[#7657E8]/30'
                        }`}
                      >
                        <span>🚀</span>
                        <span>{reactions.rocket}</span>
                      </button>
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
                    <div className="mt-1 bg-gradient-to-br from-[#7657E8] to-[#6545D5] text-white px-3.5 py-2.5 rounded-2xl rounded-tr-sm max-w-md inline-block text-left shadow-sm shadow-[#7657E8]/20">
                      Just reviewed the new home page prototypes—clean, fast, and ready to ship! ✨
                    </div>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex items-center justify-between pt-1">
                  <div className="inline-flex gap-1.5 items-center bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full text-xs text-[var(--text-secondary)] shadow-2xs">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold flex items-center justify-center">
                      M
                    </span>
                    <span className="text-[11px] font-medium">Maria is typing</span>
                    <span className="flex gap-0.5 ml-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-2" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7657E8] animate-typing-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Realistic Bottom Message Composer Bar */}
              <div className="px-3.5 sm:px-5 py-3 bg-[var(--surface)] border-t border-[var(--border)] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--surface-secondary)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                  <Smile className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left text-xs sm:text-sm text-[var(--text-muted)] bg-[var(--background)] border border-[var(--border)] rounded-xl px-3.5 py-2 truncate">
                  Write a message to Quick Design Sync...
                </div>
                <Link
                  href="/create"
                  className="h-8 px-3 rounded-xl bg-[#7657E8] hover:bg-[#6545D5] text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 shadow-xs transition-colors"
                >
                  <span className="hidden sm:inline">Try it live</span>
                  <Send className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
