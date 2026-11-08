'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  Settings2,
  X,
  Volume2,
  Mic,
  MessageSquare,
  Crown,
  Minimize2,
  Radio,
} from 'lucide-react';
import { AppLogo } from '@/components/common/app-logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { ParticipantTile } from './participant-tile';
import { MeetingControls } from './meeting-controls';
import { Meeting, MeetingParticipant } from '@talknow/shared';

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
  onMinimize?: () => void;
  unreadChatCount?: number;
  onClearUnreadChat?: () => void;
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
  onMinimize,
  unreadChatCount = 0,
  onClearUnreadChat,
  chatDrawerNode,
}: MeetingViewProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Keyboard shortcuts: 'M' to toggle mute (when not typing), 'Escape' to close drawers/modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      if (e.key === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        else if (isChatOpen) setIsChatOpen(false);
        else if (isParticipantsOpen) setIsParticipantsOpen(false);
        return;
      }

      if (!isInputFocused && (e.key === 'm' || e.key === 'M') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, isChatOpen, isParticipantsOpen, onToggleMute]);

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

  // Determine active speaker for top bar indicator
  const activeSpeaker = allParticipants.find((p) =>
    p.memberId === currentUser.id ? audioLevel > 15 && !isMuted : p.isSpeaking && !p.isMuted
  );

  // Responsive grid class based on participant count
  const getGridClasses = (count: number) => {
    if (count <= 1) return 'grid-cols-1 max-w-sm';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl';
    if (count <= 4) return 'grid-cols-2 max-w-3xl';
    if (count <= 6) return 'grid-cols-2 sm:grid-cols-3 max-w-4xl';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-5xl';
  };

  const handleToggleChat = () => {
    setIsChatOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsParticipantsOpen(false);
        onClearUnreadChat?.();
      }
      return next;
    });
  };

  const handleToggleParticipants = () => {
    setIsParticipantsOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsChatOpen(false);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col w-full h-[100dvh] overflow-hidden bg-[var(--background)]">
      {/* Meeting Top Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="hidden sm:block">
            <AppLogo size="sm" />
          </div>

          <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block" />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span className="hidden xs:inline">Live Audio</span>
                <span className="xs:hidden">Live</span>
              </span>
              <h1 className="text-xs sm:text-base font-bold text-[var(--text)] truncate">
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
                {allParticipants.length} <span className="hidden xs:inline">{allParticipants.length === 1 ? 'participant' : 'participants'}</span>
              </span>
              {activeSpeaker && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[180px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {activeSpeaker.memberId === currentUser.id ? 'You are speaking' : `${activeSpeaker.displayName} speaking`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onMinimize && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onMinimize}
              className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs font-semibold gap-1.5"
              title="Minimize voice call and view full room"
            >
              <Minimize2 className="w-3.5 h-3.5 text-[#7657E8]" />
              <span className="hidden sm:inline">Room View</span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Body with Participant Area and Optional Side Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Central Participant Tiles Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center relative">
          <div
            className={`grid gap-3.5 sm:gap-5 w-full justify-items-center transition-all duration-300 ${getGridClasses(
              allParticipants.length
            )}`}
          >
            {allParticipants.map((p) => {
              const isSelf = p.memberId === currentUser.id;
              const isCurrentSpeaking = isSelf ? audioLevel > 15 && !isMuted : p.isSpeaking;
              const isCurrentMuted = isSelf ? isMuted : p.isMuted;

              return (
                <div key={p.memberId} className="w-full aspect-4/3 sm:aspect-auto sm:h-54">
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
        <div
          className={`fixed sm:relative inset-y-0 right-0 z-40 sm:z-20 flex transition-all duration-300 ease-in-out ${
            isParticipantsOpen
              ? 'pointer-events-auto visible sm:w-80'
              : 'pointer-events-none invisible sm:w-0'
          }`}
        >
          {/* Mobile backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-2xs sm:hidden transition-opacity duration-300 ease-out ${
              isParticipantsOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsParticipantsOpen(false)}
          />

          <aside
            className={`relative ml-auto w-full sm:w-80 max-w-[100vw] h-full border-l border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 z-10 shadow-2xl sm:shadow-none transform transition-transform duration-300 ease-out ${
              isParticipantsOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-14 px-4 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-[var(--surface)]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7657E8]" />
                <h3 className="text-sm font-bold text-[var(--text)]">
                  In Call ({allParticipants.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsParticipantsOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] cursor-pointer transition-colors"
                aria-label="Close participants drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-[var(--surface)]">
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
                      <div className="w-8 h-8 rounded-full bg-[#7657E8]/12 text-[#7657E8] font-bold text-xs flex items-center justify-center shrink-0 border border-[#7657E8]/20">
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
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-semibold">
                          Muted
                        </span>
                      ) : isCurrentSpeaking ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/12 text-emerald-500 text-[10px] font-semibold animate-pulse">
                          Speaking
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[11px]">Listening</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Slide-out Text Chat Drawer during meeting */}
        <div
          className={`fixed sm:relative inset-y-0 right-0 z-40 sm:z-20 flex transition-all duration-300 ease-in-out ${
            isChatOpen
              ? 'pointer-events-auto visible sm:w-96'
              : 'pointer-events-none invisible sm:w-0'
          }`}
        >
          {/* Mobile backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-2xs sm:hidden transition-opacity duration-300 ease-out ${
              isChatOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsChatOpen(false)}
          />

          <aside
            className={`relative ml-auto w-full sm:w-96 max-w-[100vw] h-full border-l border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 z-10 shadow-2xl sm:shadow-none transform transition-transform duration-300 ease-out ${
              isChatOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-14 px-4 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-[var(--surface)]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#7657E8]" />
                <h3 className="text-sm font-bold text-[var(--text)]">Room Chat</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] cursor-pointer transition-colors"
                aria-label="Close room chat drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-[var(--surface)]">
              {chatDrawerNode || (
                <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-[var(--text-secondary)]">
                  Chat is active and synced with the main room.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Audio Device Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
              aria-label="Close audio settings"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#7657E8]/10 text-[#7657E8] flex items-center justify-center">
                <Settings2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text)] leading-tight">
                  Audio Settings
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Switch microphone or speaker live
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                  <Mic className="w-3.5 h-3.5 text-[#7657E8]" />
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
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#7657E8]" />
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
              className="w-full mt-6 h-10 rounded-xl bg-[#7657E8] hover:bg-[#6545db] text-white font-semibold text-xs"
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
        onToggleParticipants={handleToggleParticipants}
        onToggleChat={handleToggleChat}
        onMinimize={onMinimize}
        onLeaveMeeting={onLeaveMeeting}
        onEndMeeting={onEndMeeting}
        isHost={isLocalHost}
        isCreator={currentUser.isCreator}
        participantCount={allParticipants.length}
        unreadChatCount={unreadChatCount}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
      />
    </div>
  );
}
