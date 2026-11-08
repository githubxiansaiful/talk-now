'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Users, Shuffle, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/common/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { ROOM_DURATIONS, type RoomDurationValue } from '@talknow/shared';

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

export default function CreateRoomPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<RoomDurationValue>(60);
  const [maxMembers, setMaxMembers] = useState<number>(50);
  const [enableLimit, setEnableLimit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const randomizeName = () => {
    const random = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    setDisplayName(random);
    setErrors((prev) => ({ ...prev, displayName: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!displayName.trim() || displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    } else if (displayName.trim().length > 32) {
      newErrors.displayName = 'Display name cannot exceed 32 characters';
    }

    if (roomName && roomName.length > 64) {
      newErrors.roomName = 'Room name cannot exceed 64 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.createRoom({
        displayName: displayName.trim(),
        roomName: roomName.trim() || undefined,
        durationMinutes,
        maxMembers: enableLimit ? maxMembers : undefined,
      });

      const { room, member, creatorToken, sessionToken } = response;

      // Store authenticated creator session
      const sessionData = {
        displayName: member.displayName,
        roomName: room.name || `Room ${room.code}`,
        isCreator: true,
        expiresAt: room.expiresAt,
        maxMembers: room.maxMembers,
        sessionToken,
        creatorToken,
        memberId: member.id,
      };
      sessionStorage.setItem(`talknow_session_${room.code}`, JSON.stringify(sessionData));

      // Navigate to the created room
      router.push(`/room/${room.code}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create room. Please try again.';
      setErrors({ form: msg });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Unified Site Header */}
      <SiteHeader />

      {/* Main content */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Create a new room
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Configure your room. You&apos;ll be directed inside with a shareable link.
            </p>
          </div>

          {errors.form && (
            <div className="mb-4 p-3.5 rounded-xl bg-[var(--danger-light)] text-[#DC4C4C] text-sm font-medium border border-[#DC4C4C]/20">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display name field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="displayName" className="text-sm font-semibold text-[var(--text)]">
                  Your display name <span className="text-[#DC4C4C]">*</span>
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
                id="displayName"
                type="text"
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: '' }));
                }}
                error={errors.displayName}
                autoFocus
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Other people in the room will see this name.
              </p>
            </div>

            {/* Room title / topic (optional) */}
            <div>
              <label htmlFor="roomName" className="block text-sm font-semibold text-[var(--text)] mb-1.5">
                Room topic or name <span className="text-xs font-normal text-[var(--text-muted)]">(optional)</span>
              </label>
              <Input
                id="roomName"
                type="text"
                placeholder="Enter a room name or topic"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  if (errors.roomName) setErrors((prev) => ({ ...prev, roomName: '' }));
                }}
                error={errors.roomName}
              />
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2">
                Room duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROOM_DURATIONS.map((dur) => {
                  const isSelected = durationMinutes === dur.value;
                  return (
                    <button
                      key={dur.value}
                      type="button"
                      onClick={() => setDurationMinutes(dur.value)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#7657E8] bg-[#7657E8]/5 ring-2 ring-[#7657E8]/20'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-secondary)]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isSelected ? 'text-[#7657E8]' : 'text-[var(--text)]'}`}>
                          {dur.label}
                        </span>
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-[#7657E8]' : 'text-[var(--text-muted)]'}`} />
                      </div>
                      <span className="block mt-1 text-[11px] text-[var(--text-secondary)]">
                        {dur.description}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
                All messages and temporary sessions are purged automatically when the timer expires.
              </p>
            </div>

            {/* Optional member limit */}
            <div className="pt-2 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-[var(--text)]">Capacity limit</span>
                  <p className="text-xs text-[var(--text-muted)]">Restrict maximum simultaneous participants</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableLimit(!enableLimit)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    enableLimit ? 'bg-[#7657E8]' : 'bg-[var(--border)]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      enableLimit ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {enableLimit && (
                <div className="mt-3 flex items-center gap-3">
                  <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    type="number"
                    min={2}
                    max={200}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(parseInt(e.target.value, 10) || 50)}
                    className="w-28 h-9 text-sm"
                  />
                  <span className="text-xs text-[var(--text-secondary)]">maximum members</span>
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Room in Database...' : 'Create Room & Start Talking'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
