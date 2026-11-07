import { UserCheck, Link2, Zap, Clock, ShieldCheck, Smartphone } from 'lucide-react';

export function FeatureGrid() {
  const steps = [
    {
      step: '01',
      title: 'Pick a name & duration',
      description: 'Choose a temporary display name and set how long the conversation should last (30 minutes to 24 hours).',
    },
    {
      step: '02',
      title: 'Share the private link',
      description: 'Copy your unique, unguessable room link and send it via text, Slack, email, or any messenger.',
    },
    {
      step: '03',
      title: 'Talk instantly together',
      description: 'Invitees enter their name and jump right in. Messages, typing status, and presence sync in real-time.',
    },
  ];

  const features = [
    {
      icon: UserCheck,
      title: 'No signups or credentials',
      description: 'Zero friction. No email verification, phone numbers, passwords, or persistent profiles to manage.',
    },
    {
      icon: Clock,
      title: 'Self-expiring rooms',
      description: 'Every conversation has an honest expiration clock. When time is up, the room closes and data is purged.',
    },
    {
      icon: Zap,
      title: 'Real-time WebSocket engine',
      description: 'Built on persistent Socket.IO connections for instant typing indicators, online presence, and zero lag.',
    },
    {
      icon: ShieldCheck,
      title: 'Private room links',
      description: 'Generated with high-entropy cryptographically secure random identifiers to prevent room scanning.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-first responsive UX',
      description: 'Silky smooth on phones with bottom-pinned composer, adaptive sheet menus, and zero keyboard overlap.',
    },
    {
      icon: Link2,
      title: 'Creator controls',
      description: 'As the room creator, you can close the room on-demand or copy fresh invitations with one click.',
    },
  ];

  return (
    <section className="py-20 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Three step how it works */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7657E8]">
            Simple Workflow
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text)]">
            How TalkNow works
          </h2>
          <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base">
            From zero to an active group conversation in under 15 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] hover:border-[#7657E8]/40 transition-colors"
            >
              <span className="text-2xl font-black text-[#7657E8]/30">{item.step}</span>
              <h3 className="mt-3 text-lg font-bold text-[var(--text)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7657E8]">
            Core Philosophy
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text)]">
            Designed for privacy & convenience
          </h2>
          <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base">
            Everything you need for a focused conversation, and nothing you don&apos;t.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-secondary)]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7657E8]/10 text-[#7657E8] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-[var(--text)]">{feat.title}</h4>
                <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
