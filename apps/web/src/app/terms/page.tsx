import type { Metadata } from 'next';
import { FileText, CheckCircle2 } from 'lucide-react';
import { SiteHeader } from '@/components/common/site-header';
import { SiteFooter } from '@/components/landing/site-footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Terms of Use for TalkNow temporary group chat and real-time voice communication rooms.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader />

      {/* Main content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 sm:py-16">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7657E8] mb-1">
              <FileText className="w-3.5 h-3.5" />
              Terms of Service
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
              Terms of Use
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Welcome to TalkNow. By using this service, you agree to the conditions outlined below.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text)]">1. Acceptable Use</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              TalkNow is provided for lawful personal, team, and peer-to-peer communication. You agree not to use the service to:
            </p>
            <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1.5">
              <li>Transmit unlawful, harassing, defamatory, or abusive content.</li>
              <li>Attempt to flood, DDoS, or overwhelm the real-time socket infrastructure.</li>
              <li>Attempt to bypass access controls or room expiry mechanics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text)]">2. Temporary Nature of Content</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              You acknowledge that TalkNow is designed specifically for temporary communication.
              Messages are not backed up. When a room reaches its expiry duration or the creator closes it, all contents are irrevocably deleted.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text)]">3. Disclaimer of Warranties</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              TalkNow is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee uninterrupted uptime or indefinite data preservation.
            </p>
          </section>

          <div className="pt-4 border-t border-[var(--border)] flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
            <span>Thank you for communicating respectfully on TalkNow.</span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
