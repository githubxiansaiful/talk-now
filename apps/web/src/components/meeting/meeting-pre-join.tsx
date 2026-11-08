'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Settings2,
  Users,
  AlertCircle,
  RefreshCw,
  Volume2,
  PhoneCall,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Meeting } from '@talknow/shared';
import { MicPermissionState } from '@/hooks/use-meeting';

interface MeetingPreJoinProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  roomName: string;
  roomCode: string;
  displayName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  audioLevel: number; // 0 to 100
  permissionState: MicPermissionState;
  audioDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  selectedAudioInput: string;
  selectedAudioOutput: string;
  onSelectAudioInput: (deviceId: string) => void;
  onSelectAudioOutput: (deviceId: string) => void;
  onRetryPermission: () => void;
  onStartMeeting: () => void;
  onJoinMeeting: () => void;
  isStarting: boolean;
  isJoining: boolean;
}

export function MeetingPreJoin({
  isOpen,
  onClose,
  meeting,
  roomName,
  roomCode,
  displayName,
  isMuted,
  onToggleMute,
  audioLevel,
  permissionState,
  audioDevices,
  audioOutputDevices,
  selectedAudioInput,
  selectedAudioOutput,
  onSelectAudioInput,
  onSelectAudioOutput,
  onRetryPermission,
  onStartMeeting,
  onJoinMeeting,
  isStarting,
  isJoining,
}: MeetingPreJoinProps) {
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isExistingMeeting = Boolean(meeting && meeting.status === 'ACTIVE');
  const count = meeting?.participantCount || 0;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
          aria-label="Close pre-join dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7657E8] uppercase tracking-wider bg-[#7657E8]/10 px-3 py-1 rounded-full border border-[#7657E8]/20">
            <PhoneCall className="w-3 h-3" />
            <span>{isExistingMeeting ? 'Join Voice Call' : 'Start Voice Call'}</span>
          </span>
          <h2 className="text-xl font-bold text-[var(--text)] mt-2.5 truncate px-6">
            {roomName || `Room ${roomCode}`}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#7657E8]" />
            {isExistingMeeting
              ? `${count} participant${count === 1 ? '' : 's'} currently in call`
              : 'You will be the first participant in the call'}
          </p>
        </div>

        {/* Central Avatar & Audio Check Card */}
        <div className="p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] mb-5 flex flex-col items-center">
          <div className="relative w-24 h-24 flex items-center justify-center mb-3">
            {!isMuted && audioLevel > 5 && (
              <div
                className="absolute inset-0 rounded-full bg-[#7657E8]/20 transition-transform duration-75"
                style={{
                  transform: `scale(${1 + Math.min(0.35, (audioLevel / 100) * 0.4)})`,
                }}
              />
            )}

            <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-[#7657E8] to-[#9175F3] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-[var(--surface)]">
              {initial}
              <div
                className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-xs border-2 border-[var(--surface)] ${
                  isMuted ? 'bg-rose-500 text-white' : 'bg-[#16A36A] text-white'
                }`}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>

          <span className="text-sm font-bold text-[var(--text)]">{displayName}</span>

          {/* Microphone Input Level Meter */}
          <div className="w-full mt-4">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1.5">
              <span className="font-medium">Microphone Check</span>
              <span
                className={`font-semibold ${
                  isMuted
                    ? 'text-rose-500'
                    : audioLevel > 10
                    ? 'text-[#16A36A]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {isMuted ? 'Muted' : audioLevel > 10 ? 'Audio detected' : 'Ready'}
              </span>
            </div>

            <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
              <div
                className={`h-full transition-all duration-75 rounded-full ${
                  isMuted
                    ? 'w-0'
                    : audioLevel > 75
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-[#7657E8] to-[#16A36A]'
                }`}
                style={{ width: isMuted ? '0%' : `${Math.min(100, audioLevel)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Permission Denied Alert */}
        {permissionState === 'denied' && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-0.5">Microphone access is blocked</p>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2">
                Allow microphone access in your browser address bar, then click Retry.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={onRetryPermission}
                className="text-xs h-7 gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Retry Access
              </Button>
            </div>
          </div>
        )}

        {/* Audio Device Selector Toggle */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setShowDeviceSettings(!showDeviceSettings)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors px-3 py-2 rounded-xl bg-[var(--surface-secondary)]/60 hover:bg-[var(--surface-secondary)] border border-[var(--border)] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Settings2 className="w-3.5 h-3.5 text-[#7657E8]" />
              <span>Audio Input &amp; Output Devices</span>
            </span>
            <span className="text-[11px] text-[#7657E8] font-medium">
              {showDeviceSettings ? 'Hide' : 'Change'}
            </span>
          </button>

          {showDeviceSettings && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                  <Mic className="w-3 h-3 text-[#7657E8]" />
                  Microphone
                </label>
                <select
                  value={selectedAudioInput}
                  onChange={(e) => onSelectAudioInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[#7657E8]"
                >
                  {audioDevices.length > 0 ? (
                    audioDevices.map((d, i) => (
                      <option key={d.deviceId || i} value={d.deviceId}>
                        {d.label || `Microphone ${i + 1}`}
                      </option>
                    ))
                  ) : (
                    <option value="">Default Microphone</option>
                  )}
                </select>
              </div>

              {audioOutputDevices.length > 0 && (
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    <Volume2 className="w-3 h-3 text-[#7657E8]" />
                    Speaker Output
                  </label>
                  <select
                    value={selectedAudioOutput}
                    onChange={(e) => onSelectAudioOutput(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[#7657E8]"
                  >
                    {audioOutputDevices.map((d, i) => (
                      <option key={d.deviceId || i} value={d.deviceId}>
                        {d.label || `Speaker ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={onToggleMute}
            className={`h-11 px-4 rounded-xl text-xs font-semibold gap-2 border transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 hover:bg-rose-500/20'
                : 'bg-[var(--surface-secondary)] text-[var(--text)] border-[var(--border)]'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4 text-[#7657E8]" />
            )}
            <span>{isMuted ? 'Muted' : 'Mic On'}</span>
          </Button>

          <Button
            type="button"
            onClick={isExistingMeeting ? onJoinMeeting : onStartMeeting}
            disabled={isStarting || isJoining || permissionState === 'denied'}
            className="flex-1 h-11 bg-[#7657E8] hover:bg-[#6545D5] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-[#7657E8]/20 cursor-pointer"
          >
            {isStarting || isJoining
              ? 'Connecting Audio...'
              : isExistingMeeting
              ? 'Join Voice Call'
              : 'Start Voice Call'}
          </Button>
        </div>
      </div>
    </div>
  );
}
