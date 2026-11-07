'use client';

import { useState } from 'react';
import {
  Clock,
  Users,
  Settings2,
  X,
  Volume2,
  Mic,
  MessageSquare,
  Shield,
  Crown,
} from 'lucide-react';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { ParticipantTile } from './participant-tile';
import { MeetingControls } from './meeting-controls';
import { Meeting, MeetingParticipant, Member } from '@talknow/shared';

interface MeetingViewProps {
  meeting: Meeting;
  participants: MeetingParticipant[];
  roomName: string;
  roomCode: string;
  currentUser: {
    id: string;
    displayName: string;
    isCreator: boolean;
  };
  duration: number; // in seconds
  isMuted: boolean;
  onToggleMute: () => void;
  audioLevel: number;
  audioDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  selectedAudioInput: string;
  selectedAudioOutput: string;
  onSelectAudioInput: (deviceId: string) => void;
  onSelectAudioOutput: (deviceId: string) => void;
  onLeaveMeeting: () => void;
  onEndMeeting: () => void;
  // Side chat integration
  chatDrawerNode?: React.ReactNode;
}

export function MeetingView({
  meeting,
  participants,
  roomName,
  roomCode,
  currentUser,
  duration,
  isMuted,
  onToggleMute,
  audioLevel,
  audioDevices,
  audioOutputDevices,
  selectedAudioInput,
  selectedAudioOutput,
  onSelectAudioInput,
  onSelectAudioOutput,
  onLeaveMeeting,
  onEndMeeting,
  chatDrawerNode,
}: MeetingViewProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Format seconds to MM:SS or HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // Combine remote participants with local user if not already listed
  const allParticipants = [...participants];
  const hasSelf = allParticipants.some((p) => p.memberId === currentUser.id);
  if (!hasSelf) {
    allParticipants.unshift({
      id: currentUser.id,
      meetingId: meeting.id,
      memberId: currentUser.id,
      displayName: currentUser.displayName,
      isHost: meeting.hostMemberId === currentUser.id,
      isMuted,
      isSpeaking: audioLevel > 15 && !isMuted,
      joinedAt: new Date().toISOString(),
    });
  }

  const isLocalHost = meeting.hostMemberId === currentUser.id;

  // Responsive grid class based on participant count
  const getGridClasses = (count: number) => {
    if (count <= 1) return 'grid-cols-1 max-w-sm';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl';
    if (count <= 4) return 'grid-cols-2 max-w-3xl';
    if (count <= 6) return 'grid-cols-2 sm:grid-cols-3 max-w-4xl';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-5xl';
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col w-full h-[100dvh] overflow-hidden bg-[var(--background)]">
      {/* Meeting Top Bar */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:block">
            <AppLogo size="sm" />
          </div>

          <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[var(--text)] truncate">
                {roomName || `Room ${roomCode}`}
              </h1>
              <span className="hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
                {roomCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5">
              <span className="flex items-center gap-1 font-mono text-[#7657E8] font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(duration)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[var(--text-muted)]">
                <Users className="w-3.5 h-3.5" />
                {allParticipants.length} in call
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Body with Participant Area and Optional Chat Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Central Participant Tiles Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          <div
            className={`grid gap-3 sm:gap-4 w-full justify-items-center transition-all duration-300 ${getGridClasses(
              allParticipants.length
            )}`}
          >
            {allParticipants.map((p) => {
              const isSelf = p.memberId === currentUser.id;
              const isCurrentSpeaking = isSelf ? audioLevel > 15 && !isMuted : p.isSpeaking;
              const isCurrentMuted = isSelf ? isMuted : p.isMuted;

              return (
                <div key={p.memberId} className="w-full aspect-4/3 sm:aspect-auto sm:h-52">
                  <ParticipantTile
                    participant={p}
                    isSelf={isSelf}
                    isSpeaking={Boolean(isCurrentSpeaking)}
                    isMuted={Boolean(isCurrentMuted)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Slide-out Participants Drawer */}
        {isParticipantsOpen && (
          <aside className="w-80 border-l border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 z-30 animate-in slide-in-from-right duration-200">
            <div className="h-14 px-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7657E8]" />
                <h3 className="text-sm font-bold text-[var(--text)]">
                  Participants ({allParticipants.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsParticipantsOpen(false)}
                className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {allParticipants.map((p) => {
                const isSelf = p.memberId === currentUser.id;
                const isCurrentMuted = isSelf ? isMuted : p.isMuted;
                const isCurrentSpeaking = isSelf ? audioLevel > 15 && !isMuted : p.isSpeaking;

                return (
                  <div
                    key={p.memberId}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-secondary)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/60 text-[#7657E8] font-bold text-xs flex items-center justify-center shrink-0">
                        {p.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[var(--text)] truncate">
                            {p.displayName}
                          </span>
                          {isSelf && (
                            <span className="text-[10px] text-[#7657E8] font-medium">(You)</span>
                          )}
                        </div>
                        {p.isHost && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5 font-medium">
                            <Crown className="w-2.5 h-2.5" /> Host
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-xs">
                      {isCurrentMuted ? (
                        <span className="text-rose-500 text-[11px] font-medium">Muted</span>
                      ) : isCurrentSpeaking ? (
                        <span className="text-emerald-500 text-[11px] font-medium animate-pulse">
                          Speaking
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[11px]">Active</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Slide-out Text Chat Drawer during meeting */}
        {isChatOpen && (
          <aside className="w-full sm:w-96 border-l border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 z-30 animate-in slide-in-from-right duration-200">
            <div className="h-14 px-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#7657E8]" />
                <h3 className="text-sm font-bold text-[var(--text)]">In-Meeting Room Chat</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {chatDrawerNode || (
                <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-[var(--text-secondary)]">
                  Chat is active and synced with the main room.
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Audio Device Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-[#7657E8]" />
              <h3 className="text-base font-bold text-[var(--text)]">Audio Device Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                  Microphone Input
                </label>
                <select
                  value={selectedAudioInput}
                  onChange={(e) => onSelectAudioInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text)] outline-none focus:border-[#7657E8]"
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
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                    Speaker Output
                  </label>
                  <select
                    value={selectedAudioOutput}
                    onChange={(e) => onSelectAudioOutput(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text)] outline-none focus:border-[#7657E8]"
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

            <Button
              size="sm"
              className="w-full mt-6 h-10 rounded-xl bg-[#7657E8] text-white font-semibold text-xs"
              onClick={() => setIsSettingsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <MeetingControls
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onLeaveMeeting={onLeaveMeeting}
        onEndMeeting={onEndMeeting}
        isHost={isLocalHost}
        isCreator={currentUser.isCreator}
        participantCount={allParticipants.length}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
      />
    </div>
  );
}
