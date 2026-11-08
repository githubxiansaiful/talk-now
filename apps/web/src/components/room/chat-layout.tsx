'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Member, Message, SOCKET_EVENTS } from '@talknow/shared';
import { ChatHeader } from './chat-header';
import { MemberList } from './member-list';
import { MessageList } from './message-list';
import { MessageComposer } from './message-composer';
import { TypingIndicator } from './typing-indicator';
import { RoomShareDialog } from './room-share-dialog';
import { RoomSettingsDialog } from './room-settings-dialog';
import { toast } from 'sonner';
import { X, WifiOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/use-socket';
import { apiClient } from '@/lib/api-client';
import { useMeeting } from '@/hooks/use-meeting';
import { MeetingBanner } from '@/components/meeting/meeting-banner';
import { MeetingPreJoin } from '@/components/meeting/meeting-pre-join';
import { MeetingView } from '@/components/meeting/meeting-view';

interface ChatLayoutProps {
  roomCode: string;
  roomName: string;
  currentUser: {
    id: string;
    displayName: string;
    isCreator: boolean;
  };
  sessionToken: string;
  creatorToken?: string;
  expiresAt: string;
  maxMembers?: number | null;
}

export function ChatLayout({
  roomCode,
  roomName,
  currentUser,
  sessionToken,
  creatorToken,
  expiresAt,
  maxMembers,
}: ChatLayoutProps) {
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  // Dialog & drawer states
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMembersOpen, setIsMobileMembersOpen] = useState(false);
  const [isLeaveAlertOpen, setIsLeaveAlertOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Room expiry state (synced with server)
  const [currentExpiresAt, setCurrentExpiresAt] = useState(expiresAt);
  const [prevExpiresAt, setPrevExpiresAt] = useState(expiresAt);

  if (expiresAt !== prevExpiresAt) {
    setPrevExpiresAt(expiresAt);
    setCurrentExpiresAt(expiresAt);
  }

  // Group Audio Meeting hook
  const {
    meeting: activeMeeting,
    participants: meetingParticipants,
    isPreJoinOpen,
    isInMeeting,
    isMinimized,
    setIsMinimized,
    isStarting: isStartingMeeting,
    isJoining: isJoiningMeeting,
    meetingDuration,
    permissionState: micPermissionState,
    isMuted,
    audioLevel,
    audioDevices,
    audioOutputDevices,
    selectedAudioInput,
    selectedAudioOutput,
    setSelectedAudioInput,
    setSelectedAudioOutput,
    openPreJoin,
    closePreJoin,
    startLocalAudioStream,
    toggleMute,
    startMeeting,
    joinMeeting,
    leaveMeeting,
    endMeeting,
  } = useMeeting({
    roomCode,
    sessionToken,
    creatorToken,
    currentUser,
    socket,
    isConnected,
  });

  // Extend room duration handler (Creator only)
  const handleExtendRoom = useCallback(
    async (minutes: number = 30) => {
      if (!currentUser.isCreator) return;
      try {
        const updated = await apiClient.extendRoom(roomCode, minutes, creatorToken);
        if (updated?.expiresAt) {
          setCurrentExpiresAt(updated.expiresAt);
          try {
            const stored = sessionStorage.getItem(`talknow_session_${roomCode}`);
            if (stored) {
              const parsed = JSON.parse(stored);
              parsed.expiresAt = updated.expiresAt;
              sessionStorage.setItem(`talknow_session_${roomCode}`, JSON.stringify(parsed));
            }
          } catch {}

          // Reset warning thresholds if extended past thresholds
          const remainingMs = new Date(updated.expiresAt).getTime() - Date.now();
          if (remainingMs > 15 * 60 * 1000) {
            hasWarned15mRef.current = false;
            hasWarned5mRef.current = false;
            toast.dismiss('warning-15m');
            toast.dismiss('warning-5m');
          } else if (remainingMs > 5 * 60 * 1000) {
            hasWarned5mRef.current = false;
            toast.dismiss('warning-5m');
          }

          toast.success('Room Extended!', {
            description: `Room duration was increased by ${minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`}.`,
            duration: 4000,
          });
        }
      } catch (err) {
        console.error('[Room] Failed to extend duration:', err);
        const msg = err instanceof Error ? err.message : 'Failed to extend room';
        toast.error('Extension Failed', { description: msg });
      }
    },
    [currentUser.isCreator, roomCode, creatorToken]
  );

  // Expiration handler
  const handleExpire = useCallback(() => {
    sessionStorage.removeItem(`talknow_session_${roomCode}`);
    router.push('/expired');
  }, [roomCode, router]);

  // 15-minute and 5-minute threshold warnings
  const hasWarned15mRef = useRef(false);
  const hasWarned5mRef = useRef(false);

  useEffect(() => {
    const checkExpiryWarnings = () => {
      const now = Date.now();
      const expiry = new Date(currentExpiresAt).getTime();
      const remainingMs = expiry - now;

      if (remainingMs <= 0) {
        handleExpire();
        return;
      }

      // 5-minute warning: remaining <= 5 minutes
      if (remainingMs <= 5 * 60 * 1000) {
        if (!hasWarned5mRef.current) {
          hasWarned5mRef.current = true;
          hasWarned15mRef.current = true;
          toast.dismiss('warning-15m');

          toast.error('Only 5 minutes left!', {
            id: 'warning-5m',
            description: currentUser.isCreator
              ? 'This room will expire in 5 minutes and delete all messages. Increase time to keep chatting.'
              : 'This room will expire in 5 minutes and delete all messages.',
            duration: 30000,
            action: currentUser.isCreator
              ? {
                  label: 'Extend +30m',
                  onClick: () => handleExtendRoom(30),
                }
              : undefined,
            cancel: currentUser.isCreator
              ? {
                  label: '+15m',
                  onClick: () => handleExtendRoom(15),
                }
              : undefined,
          });
        }
      }
      // 15-minute warning: remaining <= 15 minutes and > 5 minutes
      else if (remainingMs <= 15 * 60 * 1000) {
        if (!hasWarned15mRef.current) {
          hasWarned15mRef.current = true;

          toast.warning('15 minutes left', {
            id: 'warning-15m',
            description: currentUser.isCreator
              ? 'This room will expire soon. You can increase the time to keep chatting.'
              : 'This room will expire soon.',
            duration: 20000,
            action: currentUser.isCreator
              ? {
                  label: 'Extend +30m',
                  onClick: () => handleExtendRoom(30),
                }
              : undefined,
            cancel: currentUser.isCreator
              ? {
                  label: '+15m',
                  onClick: () => handleExtendRoom(15),
                }
              : undefined,
          });
        }
      }
    };

    checkExpiryWarnings();
    const interval = setInterval(checkExpiryWarnings, 3000);
    return () => clearInterval(interval);
  }, [currentExpiresAt, handleExtendRoom, handleExpire, currentUser.isCreator]);

  // Close dialogs/drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLeaveAlertOpen) setIsLeaveAlertOpen(false);
        else if (isMobileMembersOpen) setIsMobileMembersOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLeaveAlertOpen, isMobileMembersOpen]);

  // Real-time state
  const [members, setMembers] = useState<Member[]>([
    {
      id: currentUser.id,
      roomId: roomCode,
      displayName: currentUser.displayName,
      joinedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      isCreator: currentUser.isCreator,
      isOnline: true,
    },
  ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [rejectionNotice, setRejectionNotice] = useState<string | null>(null);

  // Audio references for send and receive tunes
  const sendAudioRef = useRef<HTMLAudioElement | null>(null);
  const receivedAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    sendAudioRef.current = new Audio('/send_message.mp3');
    receivedAudioRef.current = new Audio('/received_message.mp3');

    sendAudioRef.current.load();
    receivedAudioRef.current.load();
  }, []);

  const playSendSound = () => {
    try {
      if (sendAudioRef.current) {
        sendAudioRef.current.currentTime = 0;
        sendAudioRef.current.play().catch(() => {});
      }
    } catch {
      // Ignore audio error
    }
  };

  const playReceivedSound = () => {
    try {
      if (receivedAudioRef.current) {
        receivedAudioRef.current.currentTime = 0;
        receivedAudioRef.current.play().catch(() => {});
      }
    } catch {
      // Ignore audio error
    }
  };

  // Wire up socket events
  useEffect(() => {
    if (!socket) return;

    // Room joined acknowledgment with initial server state
    const handleRoomJoined = (data: {
      room: { id: string; code: string; name: string };
      member: Member;
      messages: Message[];
      members: Member[];
    }) => {
      if (data.members && data.members.length > 0) {
        setMembers(data.members);
      }
      if (data.messages) {
        setMessages(data.messages);
      }
    };

    // Incoming real-time message
    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      // Play received message tune if from other members
      if (msg.memberId !== currentUser.id) {
        playReceivedSound();
        if (isInMeeting && !isMinimized) {
          setUnreadChatCount((count) => count + 1);
        }
      }
    };

    // Another member joined
    const handleMemberJoined = (data: { member: Member }) => {
      setMembers((prev) => {
        const exists = prev.some((m) => m.id === data.member.id);
        if (exists) {
          return prev.map((m) => (m.id === data.member.id ? { ...m, isOnline: true } : m));
        }
        return [...prev, data.member];
      });
    };

    // Presence update
    const handlePresenceUpdate = (data: { memberId: string; isOnline: boolean }) => {
      setMembers((prev) =>
        prev.map((m) => (m.id === data.memberId ? { ...m, isOnline: data.isOnline } : m))
      );
    };

    // Member left
    const handleMemberLeft = (data: { memberId: string }) => {
      setMembers((prev) =>
        prev.map((m) => (m.id === data.memberId ? { ...m, isOnline: false } : m))
      );
    };

    // Typing updates
    const handleTypingUpdate = (data: {
      memberId: string;
      displayName?: string;
      isTyping: boolean;
    }) => {
      if (data.memberId === currentUser.id) return;
      const member = members.find((m) => m.id === data.memberId);
      const name = data.displayName || member?.displayName || 'Someone';

      setTypingUsers((prev) => {
        if (data.isTyping) {
          return prev.includes(name) ? prev : [...prev, name];
        } else {
          return prev.filter((n) => n !== name && n !== data.displayName);
        }
      });
    };

    // Room expired or closed by creator
    const handleRoomExpired = () => {
      sessionStorage.removeItem(`talknow_session_${roomCode}`);
      router.push('/expired');
    };

    // Room time extended
    const handleRoomTimeExtended = (data: { roomCode: string; expiresAt: string }) => {
      setCurrentExpiresAt(data.expiresAt);

      try {
        const stored = sessionStorage.getItem(`talknow_session_${roomCode}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.expiresAt = data.expiresAt;
          sessionStorage.setItem(`talknow_session_${roomCode}`, JSON.stringify(parsed));
        }
      } catch {}

      const remainingMs = new Date(data.expiresAt).getTime() - Date.now();
      if (remainingMs > 15 * 60 * 1000) {
        hasWarned15mRef.current = false;
        hasWarned5mRef.current = false;
        toast.dismiss('warning-15m');
        toast.dismiss('warning-5m');
      } else if (remainingMs > 5 * 60 * 1000) {
        hasWarned5mRef.current = false;
        toast.dismiss('warning-5m');
      }

      if (!currentUser.isCreator) {
        toast.info('Room Extended', {
          description: 'The room creator extended the conversation time.',
          duration: 4000,
        });
      }
    };

    // Message rejected (e.g. rate limit)
    const handleMessageRejected = (data: { error: string }) => {
      setRejectionNotice(data.error);
      toast.error('Message rejected', {
        description: data.error,
        duration: 4000,
      });
      setTimeout(() => setRejectionNotice(null), 4000);
    };

    // Message reaction updated in real-time
    const handleReactionUpdate = (data: {
      messageId: string;
      reactions: Message['reactions'];
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    };

    socket.on(SOCKET_EVENTS.ROOM_JOINED, handleRoomJoined);
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_REJECTED, handleMessageRejected);
    socket.on(SOCKET_EVENTS.MESSAGE_REACTION_UPDATE, handleReactionUpdate);
    socket.on(SOCKET_EVENTS.ROOM_MEMBER_JOINED, handleMemberJoined);
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
    socket.on(SOCKET_EVENTS.ROOM_MEMBER_LEFT, handleMemberLeft);
    socket.on(SOCKET_EVENTS.TYPING_UPDATE, handleTypingUpdate);
    socket.on(SOCKET_EVENTS.ROOM_EXPIRED, handleRoomExpired);
    socket.on(SOCKET_EVENTS.ROOM_CLOSED, handleRoomExpired);
    socket.on(SOCKET_EVENTS.ROOM_TIME_EXTENDED, handleRoomTimeExtended);

    const emitJoin = () => {
      socket.emit(SOCKET_EVENTS.ROOM_JOIN, {
        roomCode,
        sessionToken,
      });
    };

    if (socket.connected) {
      emitJoin();
    }
    socket.on('connect', emitJoin);

    return () => {
      socket.off('connect', emitJoin);
      socket.off(SOCKET_EVENTS.ROOM_JOINED, handleRoomJoined);
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_REJECTED, handleMessageRejected);
      socket.off(SOCKET_EVENTS.MESSAGE_REACTION_UPDATE, handleReactionUpdate);
      socket.off(SOCKET_EVENTS.ROOM_MEMBER_JOINED, handleMemberJoined);
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
      socket.off(SOCKET_EVENTS.ROOM_MEMBER_LEFT, handleMemberLeft);
      socket.off(SOCKET_EVENTS.TYPING_UPDATE, handleTypingUpdate);
      socket.off(SOCKET_EVENTS.ROOM_EXPIRED, handleRoomExpired);
      socket.off(SOCKET_EVENTS.ROOM_CLOSED, handleRoomExpired);
      socket.off(SOCKET_EVENTS.ROOM_TIME_EXTENDED, handleRoomTimeExtended);
    };
  }, [socket, roomCode, sessionToken, currentUser.id, currentUser.isCreator, router, isInMeeting, isMinimized, members]);

  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (!socket || !content.trim()) return;

    playSendSound();

    socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
      roomCode,
      content: content.trim(),
      sessionToken,
    });

    socket.emit(SOCKET_EVENTS.TYPING_STOP, { roomCode });
  };

  // Handle message reaction
  const handleReact = (messageId: string, emoji: string) => {
    if (!socket || !isConnected) return;
    socket.emit(SOCKET_EVENTS.MESSAGE_REACT, {
      roomCode,
      messageId,
      emoji,
    });
  };

  // Typing triggers
  const handleTypingStart = () => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.TYPING_START, {
      roomCode,
      memberId: currentUser.id,
      displayName: currentUser.displayName,
    });
  };

  const handleTypingStop = () => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.TYPING_STOP, {
      roomCode,
      memberId: currentUser.id,
      displayName: currentUser.displayName,
    });
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit(SOCKET_EVENTS.ROOM_LEAVE, { roomCode });
    }
    sessionStorage.removeItem(`talknow_session_${roomCode}`);
    router.push('/');
  };

  const handleCloseRoom = async () => {
    try {
      if (creatorToken) {
        await apiClient.closeRoom(roomCode, creatorToken);
      }
    } catch {
      // Ignore
    }
    sessionStorage.removeItem(`talknow_session_${roomCode}`);
    router.push('/expired');
  };

  // If in meeting and NOT minimized, render full meeting view
  if (isInMeeting && activeMeeting && !isMinimized) {
    return (
      <MeetingView
        meeting={activeMeeting}
        participants={meetingParticipants}
        roomName={roomName}
        roomCode={roomCode}
        currentUser={currentUser}
        duration={meetingDuration}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        audioLevel={audioLevel}
        audioDevices={audioDevices}
        audioOutputDevices={audioOutputDevices}
        selectedAudioInput={selectedAudioInput}
        selectedAudioOutput={selectedAudioOutput}
        onSelectAudioInput={setSelectedAudioInput}
        onSelectAudioOutput={setSelectedAudioOutput}
        onLeaveMeeting={leaveMeeting}
        onEndMeeting={endMeeting}
        onMinimize={() => setIsMinimized(true)}
        unreadChatCount={unreadChatCount}
        onClearUnreadChat={() => setUnreadChatCount(0)}
        chatDrawerNode={
          <div className="flex-1 flex flex-col min-h-0 bg-[var(--surface)]">
            <div className="flex-1 overflow-y-auto">
              <MessageList
                messages={messages}
                currentMemberId={currentUser.id}
                members={members}
                onReact={handleReact}
                onOpenInvite={() => setIsShareOpen(true)}
              />
            </div>
            <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
              <MessageComposer
                onSendMessage={handleSendMessage}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
                disabled={!isConnected}
              />
            </div>
          </div>
        }
      />
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col w-full h-[100dvh] overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <ChatHeader
        roomName={roomName}
        roomCode={roomCode}
        expiresAt={currentExpiresAt}
        memberCount={members.filter((m) => m.isOnline).length}
        isCreator={currentUser.isCreator}
        activeMeeting={activeMeeting}
        isInMeeting={isInMeeting}
        onOpenMeeting={openPreJoin}
        onMaximizeMeeting={() => setIsMinimized(false)}
        typingUsers={typingUsers}
        onOpenInvite={() => setIsShareOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMembers={() => setIsMobileMembersOpen(true)}
        onBackClick={() => setIsLeaveAlertOpen(true)}
        onExpire={handleExpire}
      />

      {/* Active Meeting Banner: Shows either Join Call banner or Minimized In-Call bar */}
      {activeMeeting && (
        <MeetingBanner
          meeting={activeMeeting}
          isConnectedInCall={isInMeeting}
          isMuted={isMuted}
          duration={meetingDuration}
          onJoinClick={openPreJoin}
          onExpandCall={() => setIsMinimized(false)}
          onToggleMute={toggleMute}
          onLeaveCall={leaveMeeting}
        />
      )}

      {/* Reconnecting banner if socket disconnects */}
      {!isConnected && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-1.5 text-xs flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Reconnecting to chat server...</span>
        </div>
      )}

      {/* Main body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar: Members List */}
        <aside className="hidden lg:flex w-64 border-r border-[var(--border)] bg-[var(--surface)] flex-col shrink-0">
          <MemberList
            members={members}
            currentMemberId={currentUser.id}
            maxMembers={maxMembers}
            meetingParticipants={meetingParticipants}
            onOpenInvite={() => setIsShareOpen(true)}
          />
        </aside>

        {/* Mobile slide-out members drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden flex transition-all duration-300 ${
            isMobileMembersOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
          }`}
        >
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
              isMobileMembersOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMembersOpen(false)}
          />

          <div
            className={`relative ml-auto w-72 max-w-[80vw] h-full bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-in-out ${
              isMobileMembersOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                Participants
              </span>
              <button
                onClick={() => setIsMobileMembersOpen(false)}
                className="p-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] cursor-pointer"
                aria-label="Close member drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <MemberList
                members={members}
                currentMemberId={currentUser.id}
                maxMembers={maxMembers}
                meetingParticipants={meetingParticipants}
                onOpenInvite={() => {
                  setIsMobileMembersOpen(false);
                  setIsShareOpen(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Conversation Column */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--background)] relative">
          <div
            className="absolute inset-0 pointer-events-none bg-repeat transition-all duration-200"
            style={{
              backgroundImage: 'var(--chat-bg)',
              backgroundSize: '412px',
            }}
          />

          {/* Message List */}
          <MessageList
            messages={messages}
            currentMemberId={currentUser.id}
            members={members}
            onReact={handleReact}
            onOpenInvite={() => setIsShareOpen(true)}
            onOpenMeeting={openPreJoin}
          />

          {/* Rate limit / rejection banner */}
          {rejectionNotice && (
            <div className="mx-4 mb-2 p-2.5 rounded-xl bg-[var(--danger-light)] border border-[#DC4C4C]/20 text-[#DC4C4C] text-xs font-medium text-center animate-in fade-in duration-150">
              {rejectionNotice}
            </div>
          )}

          {/* Typing indicator */}
          <TypingIndicator typingUsers={typingUsers} />

          {/* Message Composer */}
          <MessageComposer
            onSendMessage={handleSendMessage}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            disabled={!isConnected}
          />
        </main>
      </div>

      {/* Share Dialog */}
      <RoomShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        roomCode={roomCode}
      />

      {/* Settings Dialog */}
      <RoomSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isCreator={currentUser.isCreator}
        expiresAt={currentExpiresAt}
        onLeaveRoom={handleLeaveRoom}
        onCloseRoom={handleCloseRoom}
        onExtendRoom={currentUser.isCreator ? handleExtendRoom : undefined}
      />

      {/* Leave Room Confirmation Alert Dialog */}
      {isLeaveAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-1.5">Leave Conversation?</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Are you sure you want to leave this room? You can only rejoin if the room is still active and you have the invite link.
            </p>
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setIsLeaveAlertOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 text-xs font-semibold"
                onClick={() => {
                  setIsLeaveAlertOpen(false);
                  handleLeaveRoom();
                }}
              >
                Yes, Leave
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Pre-Join Screen Modal */}
      <MeetingPreJoin
        isOpen={isPreJoinOpen}
        onClose={closePreJoin}
        meeting={activeMeeting}
        roomName={roomName}
        roomCode={roomCode}
        displayName={currentUser.displayName}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        audioLevel={audioLevel}
        permissionState={micPermissionState}
        audioDevices={audioDevices}
        audioOutputDevices={audioOutputDevices}
        selectedAudioInput={selectedAudioInput}
        selectedAudioOutput={selectedAudioOutput}
        onSelectAudioInput={setSelectedAudioInput}
        onSelectAudioOutput={setSelectedAudioOutput}
        onRetryPermission={() => startLocalAudioStream(selectedAudioInput)}
        onStartMeeting={startMeeting}
        onJoinMeeting={joinMeeting}
        isStarting={isStartingMeeting}
        isJoining={isJoiningMeeting}
      />
    </div>
  );
}
