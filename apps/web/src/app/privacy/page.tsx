import Link from 'next/link';
import { ArrowLeft, Shield, Clock, Lock, EyeOff } from 'lucide-react';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <AppLogo size="sm" />
          </div>
          <ThemeToggle />
        </div>
      </header>

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

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#7657E8]" />
              5. Audio Meetings & Live Media Processing
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              TalkNow allows room participants to initiate and join group audio meetings. Live audio is processed strictly in real-time to relay conversation between authorized room participants using WebRTC / SFU media routing.
            </p>
            <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1.5">
              <li>Calls are never recorded under any circumstances.</li>
              <li>Microphone audio is never saved, archived, or transcribed.</li>
              <li>Microphone access is requested only when you voluntarily join an audio call, and is immediately revoked upon leaving.</li>
              <li>When the parent room closes or expires, active media sessions terminate immediately.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
