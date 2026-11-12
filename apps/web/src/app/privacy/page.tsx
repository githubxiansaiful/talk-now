import type { Metadata } from 'next';
import { Shield, Clock, Lock, EyeOff } from 'lucide-react';
import { SiteHeader } from '@/components/common/site-header';
import { SiteFooter } from '@/components/landing/site-footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how TalkNow protects your privacy with zero-account architecture, automatic room expiration, and real-time unrecorded group audio.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader />

      {/* Main content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 sm:py-16">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7657E8] mb-1">
              <Shield className="w-3.5 h-3.5" />
              Privacy Policy
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
              Your Privacy on TalkNow
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Last updated: November 2026. We believe the safest data is the data that is never stored.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-[#7657E8]" />
              1. Zero Account Architecture
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              TalkNow never asks for your email address, full name, phone number, password, or third-party OAuth logins.
              Your display name is temporary and exists only within the memory of the room you join.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#7657E8]" />
              2. Ephemeral Data & Deletion Policy
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every room has a strict expiry duration (30 minutes, 1 hour, 6 hours, or 24 hours).
              Once a room expires or is manually closed by its creator:
            </p>
            <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1.5">
              <li>The room cannot accept any new members or messages.</li>
              <li>All chat messages, timestamps, and member records are automatically purged by automated cleanup jobs.</li>
              <li>No backups or archives of message history are preserved.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#7657E8]" />
              3. Security & Link Secrecy
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Room links are generated using cryptographically secure random entropy to prevent enumeration or scanning.
              Only people with whom you deliberately share the link can access the room while it is active.
              We do not claim end-to-end encryption; messages are encrypted in transit over HTTPS and WebSockets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text)]">4. Cookies and Local Storage</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              TalkNow uses zero tracking or analytics cookies. We use temporary session tokens solely to keep your socket connection authenticated while you are in a room.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
