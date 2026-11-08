import Link from 'next/link';
import {
  UserCheck,
  Zap,
  Clock,
  ShieldCheck,
  Smartphone,
  PhoneCall,
  ArrowRight,
  Copy,
  Check,
  Shuffle,
  Lock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeatureGrid() {
  const features = [
    {
      icon: UserCheck,
      tag: 'Instant Access',
      title: 'No signups or credentials',
      description:
        'Zero friction from click to conversation. No email verification, phone numbers, passwords, or persistent profiles to manage.',
    },
    {
      icon: Clock,
      tag: 'Guaranteed Ephemeral',
      title: 'Self-expiring rooms',
      description:
        'Every room runs on a strict countdown timer from 30 minutes to 24 hours. When time is up, the room closes and all data is purged.',
    },
    {
      icon: PhoneCall,
      tag: 'Group Audio',
      title: 'Built-in live voice huddles',
      description:
        'Need to talk it out? Start a crystal-clear, low-latency group audio call directly inside your room with a single click.',
    },
    {
      icon: Zap,
      tag: 'Zero-Lag Sync',
      title: 'Real-time WebSocket engine',
      description:
        'Powered by persistent Socket.IO connections for instant message delivery, live typing indicators, and accurate online presence.',
    },
    {
      icon: ShieldCheck,
      tag: 'Room Security',
      title: 'Private links & host controls',
      description:
        'Unguessable room codes keep outsiders away. Room creators can adjust settings or permanently destroy the room on demand.',
    },
    {
      icon: Smartphone,
      tag: 'Any Device',
      title: 'Mobile-first responsive UX',
      description:
        'Feels like a native app on phones and desktops alike—with adaptive dark/light themes, emoji picker, and distraction-free layout.',
    },
  ];

  const useCases = [
    'Quick Design & Dev Syncs',
    'Gaming Squad Lobbies',
    'Hackathon War Rooms',
    'Sharing Temporary Links & Snippets',
    'Study & Project Groups',
    'One-Off Client Check-Ins',
  ];

  return (
    <>
      {/* SECTION 1: How It Works */}
      <section
        id="how-it-works"
        className="py-20 sm:py-24 border-t border-[var(--border)] bg-[var(--surface)] relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7657E8]/10 text-[#7657E8] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple Workflow</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
              How TalkNow works
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              Go from zero to an active group conversation or voice call in under 10 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 01 */}
            <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] hover:border-[#7657E8]/40 hover:shadow-lg hover:shadow-[#7657E8]/[0.04] transition-all duration-200">
              <div>
                {/* Mini UI Illustration 01 */}
                <div className="mb-6 p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] bg-[var(--background)] border border-[var(--border)] rounded-lg px-2.5 py-1.5">
                    <span className="font-semibold text-[var(--text)]">CosmicOtter</span>
                    <span className="inline-flex items-center gap-1 text-[#7657E8] font-medium">
                      <Shuffle className="w-3 h-3" />
                      Random
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-semibold">
                    <span className="py-1 rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--text-secondary)]">
                      30m
                    </span>
                    <span className="py-1 rounded-md bg-[#7657E8] text-white shadow-2xs">
                      1h
                    </span>
                    <span className="py-1 rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--text-secondary)]">
                      4h
                    </span>
                    <span className="py-1 rounded-md bg-[var(--background)] border border-[var(--border)] text-[var(--text-secondary)]">
                      24h
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#7657E8]">
                    Step 01
                  </span>
                  <span className="text-xs font-medium text-[var(--text-muted)]">~3 sec</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text)]">
                  Pick a name &amp; duration
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Choose any temporary display name—or randomize one—and set how long the room should live before self-destructing.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] hover:border-[#7657E8]/40 hover:shadow-lg hover:shadow-[#7657E8]/[0.04] transition-all duration-200">
              <div>
                {/* Mini UI Illustration 02 */}
                <div className="mb-6 p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-[11px]">
                    <Lock className="w-3 h-3 text-[#16A36A] shrink-0" />
                    <span className="font-mono text-[var(--text-secondary)] truncate flex-1">
                      talknow.app/room/k9x-4m2
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--success-light)] text-[var(--success)] font-semibold text-[10px]">
                      <Check className="w-2.5 h-2.5" />
                      Copied
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] px-1">
                    <span>Private invite code: k9x-4m2</span>
                    <span className="inline-flex items-center gap-1 text-[#7657E8] font-medium">
                      <Copy className="w-2.5 h-2.5" />
                      One-click share
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#7657E8]">
                    Step 02
                  </span>
                  <span className="text-xs font-medium text-[var(--text-muted)]">~2 sec</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text)]">
                  Share the private link
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Copy your unique room link or short code and drop it in Slack, Discord, iMessage, email, or anywhere else.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] hover:border-[#7657E8]/40 hover:shadow-lg hover:shadow-[#7657E8]/[0.04] transition-all duration-200">
              <div>
                {/* Mini UI Illustration 03 */}
                <div className="mb-6 p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#7657E8]/15 text-[#7657E8] text-[10px] font-bold flex items-center justify-center">
                        A
                      </span>
                      <span className="text-[11px] bg-[var(--background)] border border-[var(--border)] text-[var(--text)] px-2.5 py-1 rounded-lg rounded-tl-xs">
                        I&apos;m in! Hopping on voice 🎧
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-[#7657E8]/10 border border-[#7657E8]/20 rounded-lg px-2.5 py-1">
                    <span className="text-[10px] font-semibold text-[#7657E8] flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" />
                      Chat + Voice Active
                    </span>
                    <div className="flex items-center gap-0.5 h-2.5">
                      <span className="w-0.5 h-2 bg-[#7657E8] rounded-full animate-wave-1" />
                      <span className="w-0.5 h-2 bg-[#7657E8] rounded-full animate-wave-2" />
                      <span className="w-0.5 h-2 bg-[#7657E8] rounded-full animate-wave-3" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#7657E8]">
                    Step 03
                  </span>
                  <span className="text-xs font-medium text-[var(--text-muted)]">Instant</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text)]">
                  Talk &amp; collaborate live
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Friends enter a display name and join immediately. Exchange messages, react, or launch a group audio call together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Core Philosophy & Bento Feature Grid */}
      <section
        id="features"
        className="py-20 sm:py-24 border-t border-[var(--border)] bg-[var(--background)]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7657E8]/10 text-[#7657E8] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Core Philosophy</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
              Designed for privacy &amp; speed
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              Everything you need for a focused real-time conversation—and nothing that lingers afterward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group relative p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[#7657E8]/40 hover:shadow-xl hover:shadow-[#7657E8]/[0.04] transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7657E8]/15 to-[#7657E8]/5 border border-[#7657E8]/20 text-[#7657E8] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#7657E8] group-hover:text-white transition-all duration-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--surface-secondary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text)]">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Use-cases strip */}
          <div className="mt-14 pt-10 border-t border-[var(--border)]/70 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Built for moments when creating a permanent group is overkill
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] px-3.5 py-1.5 rounded-full"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Call-To-Action Banner */}
          <div className="mt-16 sm:mt-20 relative rounded-3xl border border-[#7657E8]/25 bg-[var(--surface)] p-8 sm:p-12 text-center overflow-hidden shadow-xl shadow-[#7657E8]/[0.04]">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[240px] bg-gradient-to-b from-[#7657E8]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text)]">
                Ready to start a conversation?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Launch a private room in seconds. Invite your group, talk freely, and let the room vanish automatically when you&apos;re done.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/create" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-semibold rounded-xl bg-gradient-to-b from-[#8364F0] to-[#6B4BE0] hover:from-[#7657E8] hover:to-[#5C3CD4] shadow-md shadow-[#7657E8]/25 border border-white/15 gap-2"
                  >
                    <span>Create a Free Room</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/privacy" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-6 text-sm sm:text-base font-semibold rounded-xl"
                  >
                    Read Privacy Promise
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
