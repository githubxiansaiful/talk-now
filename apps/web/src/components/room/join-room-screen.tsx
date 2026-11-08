'use client';

import { useState } from 'react';
import { Users, Clock, LogIn, Shuffle } from 'lucide-react';
import { SiteHeader } from '@/components/common/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRemainingTime } from '@/lib/utils';

interface JoinRoomScreenProps {
  roomCode: string;
  roomName: string;
  expiresAt: string;
  memberCount: number;
  onJoin: (displayName: string) => void;
}

const SAMPLE_NAMES = [
  'SwiftFalcon',
  'CosmicOtter',
  'ElectricPanda',
  'QuietBreeze',
  'NeonVoyager',
  'SolarEcho',
  'BraveSparrow',
  'PixelTiger',
];

export function JoinRoomScreen({
  roomCode,
  roomName,
  expiresAt,
  memberCount,
  onJoin,
}: JoinRoomScreenProps) {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const randomizeName = () => {
    const random = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    setDisplayName(random);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = displayName.trim();
    if (!clean || clean.length < 2) {
      setError('Display name must be at least 2 characters');
      return;
    }
    if (clean.length > 32) {
      setError('Display name cannot exceed 32 characters');
      return;
    }
    onJoin(clean);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-8 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
            {roomName || `Room ${roomCode}`}
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            You&apos;ve been invited to join this temporary conversation.
          </p>

          {/* Room info card */}
          <div className="my-4 sm:my-5 p-3.5 sm:p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Room Code:</span>
              <span className="font-mono font-semibold text-[var(--text)]">{roomCode}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)] flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Active members:
              </span>
              <span className="font-semibold text-[var(--success)]">{memberCount} online</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Time remaining:
              </span>
              <span className="font-semibold text-[#7657E8]">
                {formatRemainingTime(expiresAt)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="joinName" className="text-sm font-semibold text-[var(--text)]">
                  Enter your display name
                </label>
                <button
                  type="button"
                  onClick={randomizeName}
                  className="inline-flex items-center gap-1 text-xs text-[#7657E8] hover:underline font-medium cursor-pointer"
                >
                  <Shuffle className="w-3 h-3" />
                  Randomize
                </button>
              </div>
              <Input
                id="joinName"
                type="text"
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (error) setError('');
                }}
                error={error}
                autoFocus
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                No passwords or accounts. You will be seen as this name.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full h-11 text-sm font-semibold">
              <LogIn className="w-4 h-4 mr-1.5" />
              Join Conversation
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
