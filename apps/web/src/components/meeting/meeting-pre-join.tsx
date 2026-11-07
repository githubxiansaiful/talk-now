'use client';

import { useState } from 'react';
import { X, Mic, MicOff, Settings2, Users, AlertCircle, RefreshCw, Volume2 } from 'lucide-react';
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

  if (!isOpen) return null;

  const isExistingMeeting = Boolean(meeting && meeting.status === 'ACTIVE');
  const count = meeting?.participantCount || 0;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-[#7657E8] uppercase tracking-wider bg-[#7657E8]/10 px-2.5 py-1 rounded-full border border-[#7657E8]/20">
            {isExistingMeeting ? 'Join Meeting' : 'Start Audio Meeting'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] mt-2">
            {roomName || `Room ${roomCode}`}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#7657E8]" />
            {isExistingMeeting
              ? `${count} participant${count === 1 ? '' : 's'} in call`
              : 'No one is in the meeting yet'}
          </p>
        </div>

        {/* Avatar & Mic Visualizer Card */}
        <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-6">
          {/* Dynamic Audio Visualizer Waves */}
          {!isMuted && audioLevel > 5 && (
            <>
              <div
                className="absolute inset-0 rounded-full bg-[#7657E8]/20 transition-all duration-75"
                style={{
                  transform: `scale(${1 + (audioLevel / 100) * 0.4})`,
                  opacity: Math.min(0.8, audioLevel / 60),
                }}
              />
              <div
                className="absolute inset-0 rounded-full bg-[#7657E8]/10 transition-all duration-75"
                style={{
                  transform: `scale(${1 + (audioLevel / 100) * 0.7})`,
                  opacity: Math.min(0.5, audioLevel / 80),
                }}
              />
            </>
          )}

          {/* Central Avatar */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#7657E8] to-[#9175F3] text-white flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-xl border-4 border-[var(--surface)]">
            {initial}
            {isMuted && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md border-2 border-[var(--surface)]">
                <MicOff className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Mic Level Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1.5 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Mic className="w-3.5 h-3.5 text-[#7657E8]" />
              Microphone Preview
            </span>
            <span className="text-[11px] font-mono">
              {isMuted ? 'Muted' : audioLevel > 10 ? 'Speaking...' : 'Ready'}
            </span>
          </div>

          <div className="h-2 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className={`h-full transition-all duration-75 rounded-full ${
                isMuted
                  ? 'bg-rose-500/50 w-0'
                  : audioLevel > 70
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-[#7657E8] to-[#20C283]'
              }`}
              style={{ width: isMuted ? '0%' : `${Math.min(100, audioLevel)}%` }}
            />
          </div>
        </div>

        {/* Permission Denied Alert */}
        {permissionState === 'denied' && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-0.5">Microphone access is blocked</p>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2">
                Click the lock icon in your browser address bar to allow microphone permissions for TalkNow, then click retry.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={onRetryPermission}
                className="text-xs h-7 gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 border-none cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Retry Access
              </Button>
            </div>
          </div>
        )}

        {/* Audio Device Settings Accordion */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowDeviceSettings(!showDeviceSettings)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors p-2 rounded-xl hover:bg-[var(--surface-secondary)] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#7657E8]" />
              Audio Devices & Settings
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {showDeviceSettings ? 'Hide' : 'Configure'}
            </span>
          </button>

          {showDeviceSettings && (
            <div className="mt-3 p-3.5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] space-y-3 animate-in fade-in duration-150">
              {/* Mic Input Select */}
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                  Microphone Input
                </label>
                <select
                  value={selectedAudioInput}
                  onChange={(e) => onSelectAudioInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[#7657E8]"
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

              {/* Speaker Output Select (if available) */}
              {audioOutputDevices.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Speaker Output
                  </label>
                  <select
                    value={selectedAudioOutput}
                    onChange={(e) => onSelectAudioOutput(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[#7657E8]"
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
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onToggleMute}
            className={`h-11 px-4 rounded-xl text-xs font-semibold gap-2 border transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20'
                : 'bg-[var(--surface-secondary)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-secondary)]/80'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#7657E8]" />}
            <span>{isMuted ? 'Muted' : 'Unmuted'}</span>
          </Button>

          <Button
            type="button"
            onClick={isExistingMeeting ? onJoinMeeting : onStartMeeting}
            disabled={isStarting || isJoining || permissionState === 'denied'}
            className="flex-1 h-11 bg-[#7657E8] hover:bg-[#6545db] text-white font-semibold text-xs rounded-xl shadow-lg shadow-[#7657E8]/20 cursor-pointer transition-all hover:scale-102 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isStarting || isJoining
              ? 'Connecting...'
              : isExistingMeeting
              ? 'Join Meeting'
              : 'Start Meeting'}
          </Button>
        </div>
      </div>
    </div>
  );
}
