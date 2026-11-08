import Link from 'next/link';
import {
  UserCheck,
  Zap,
  Clock,
  ShieldCheck,
  Smartphone,
  PhoneCall,
  ArrowRight,
  Sliders,
  Share2,
  MessagesSquare,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeatureGrid() {
  const steps = [
    {
      step: '01',
      icon: Sliders,
      title: 'Configure your temporary room',
      description:
        'Choose a temporary display name, set an optional room topic, and select an automatic expiration timer (30 minutes, 1 hour, 6 hours, or 24 hours).',
    },
    {
      step: '02',
      icon: Share2,
      title: 'Share one private invite link',
      description:
        'Copy your cryptographically generated room link or room code and share it with your team, friends, or clients over any messaging channel.',
    },
    {
      step: '03',
      icon: MessagesSquare,
      title: 'Chat & talk in real time',
      description:
        'Invited participants enter a display name and join immediately in their browser—with instant text messaging, emoji reactions, and live group audio calls.',
    },
  ];

  const features = [
    {
      icon: UserCheck,
      tag: 'Instant Access',
      title: 'No signups or credentials',
      description:
        'Start talking immediately without creating accounts. TalkNow never asks for email addresses, phone numbers, passwords, or OAuth logins.',
    },
    {
      icon: Clock,
      tag: 'Ephemeral Storage',
      title: 'Self-expiring rooms & data purge',
      description:
        'Every room operates on a strict countdown clock. Once the timer expires or the creator closes the room, all messages and member sessions are permanently deleted.',
    },
    {
      icon: PhoneCall,
      tag: 'Live Audio',
      title: 'Built-in group voice calling',
      description:
        'Launch a low-latency WebRTC audio meeting inside any active room with one click—complete with mute controls, active speaker indicators, and zero call recording.',
    },
    {
      icon: Zap,
      tag: 'Real-Time Sync',
      title: 'Persistent WebSocket messaging',
      description:
        'Powered by Socket.IO for sub-second message delivery, live typing status, emoji reactions, room duration extensions, and accurate online member presence.',
    },
    {
      icon: ShieldCheck,
      tag: 'Access Control',
      title: 'High-entropy links & host controls',
      description:
        'Room codes are generated with cryptographic randomness to prevent room scanning. Creators can extend room time, set member capacity limits, or close rooms on demand.',
    },
    {
      icon: Smartphone,
      tag: 'Cross-Platform',
      title: 'Responsive mobile & desktop web app',
      description:
        'Engineered for mobile and desktop browsers alike with dark and light themes, mobile member drawers, and a keyboard-friendly message composer.',
    },
  ];

  const faqs = [
    {
      question: 'How do temporary chat rooms work on TalkNow?',
      answer:
        'When you create a room, you select a lifespan between 30 minutes and 24 hours. TalkNow generates a unique private link that you can share with anyone. While the room is active, members can exchange real-time text messages and join live audio calls.',
    },
    {
      question: 'Do participants need to register an account or install an app?',
      answer:
        'No. TalkNow runs entirely in modern web browsers on desktop and mobile. Visitors simply open your invitation link, enter a temporary display name for that session, and join the conversation immediately.',
    },
    {
      question: 'What happens to messages and audio when the room timer expires?',
      answer:
        'When a room reaches its expiration time—or when the room creator manually closes it—active connections are terminated and automated cleanup jobs permanently purge all messages, reactions, and participant records from the database.',
    },
    {
      question: 'Are group voice calls recorded or stored?',
      answer:
        'Never. Live audio meetings stream strictly in real time between active room participants and are never recorded, transcribed, or archived.',
    },
  ];

  return (
    <>
      {/* SECTION 1: How It Works */}
      <section
        id="how-it-works"
        className="py-20 sm:py-24 border-t border-[var(--border)] bg-[var(--surface)]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#7657E8]/10 text-[#7657E8] text-xs font-bold uppercase tracking-wider">
              Simple 3-Step Workflow
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
              How TalkNow works
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              Launch a private group chat and audio room in seconds without onboarding friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[var(--background)] border border-[var(--border)] hover:border-[#7657E8]/40 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-[#7657E8]/10 text-[#7657E8] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#7657E8] bg-[#7657E8]/10 px-2.5 py-1 rounded-full">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text)]">{item.title}</h3>
                    <p className="mt-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: Core Features */}
      <section
        id="features"
        className="py-20 sm:py-24 border-t border-[var(--border)] bg-[var(--background)]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#7657E8]/10 text-[#7657E8] text-xs font-bold uppercase tracking-wider">
              Platform Capabilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
              Built for privacy, speed, and simplicity
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              Everything you need for focused real-time group communication—and nothing that lingers afterward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <article
                  key={feat.title}
                  className="group relative p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[#7657E8]/40 hover:shadow-lg hover:shadow-[#7657E8]/[0.04] transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-[#7657E8]/10 text-[#7657E8] flex items-center justify-center group-hover:bg-[#7657E8] group-hover:text-white transition-colors duration-200">
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
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: SEO-Friendly FAQ & Call-to-Action */}
      <section
        id="faq"
        className="py-20 sm:py-24 border-t border-[var(--border)] bg-[var(--surface)]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7657E8]/10 text-[#7657E8] text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Questions</span>
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              Learn how TalkNow keeps group conversations fast, temporary, and private.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]"
              >
                <h3 className="text-base font-bold text-[var(--text)]">{faq.question}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Call-To-Action Banner */}
          <div className="mt-16 sm:mt-20 relative rounded-3xl border border-[#7657E8]/25 bg-[var(--background)] p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[240px] bg-gradient-to-b from-[#7657E8]/12 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text)]">
                Ready to start a private conversation?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Create an instant room in seconds. Invite your group with one link, and let the room automatically self-destruct when your session ends.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/create" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-semibold rounded-xl bg-gradient-to-b from-[#8364F0] to-[#6B4BE0] hover:from-[#7657E8] hover:to-[#5C3CD4] shadow-md shadow-[#7657E8]/25 border border-white/15 gap-2"
                  >
                    <span>Create a Room Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/privacy" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-6 text-sm sm:text-base font-semibold rounded-xl"
                  >
                    Read Privacy Policy
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
