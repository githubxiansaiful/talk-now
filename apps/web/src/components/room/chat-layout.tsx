'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Member, Message, SOCKET_EVENTS } from '@talknow/shared';
import { ChatHeader } from './chat-header';
import { MemberList } from './member-list';
import { MessageList } from './message-list';
import { MessageComposer } from './message-composer';
import { TypingIndicator } from './typing-indicator';
import { RoomShareDialog } from './room-share-dialog';
import { RoomSettingsDialog } from './room-settings-dialog';
import { X, WifiOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/use-socket';
import { apiClient } from '@/lib/api-client';

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

  // Typing timer reference
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Wire up socket events
  useEffect(() => {
    if (!socket) return;

    // Join room when socket connects or on mount
    socket.emit(SOCKET_EVENTS.ROOM_JOIN, {
      roomCode,
      sessionToken,
    });

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
        // Prevent duplicates
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      // Play received message tune if from other members
      if (msg.memberId !== currentUser.id) {
        playReceivedSound();
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

    // Message rejected (e.g. rate limit)
    const handleMessageRejected = (data: { error: string }) => {
      setRejectionNotice(data.error);
      setTimeout(() => setRejectionNotice(null), 4000);
    };

    socket.on(SOCKET_EVENTS.ROOM_JOINED, handleRoomJoined);
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_REJECTED, handleMessageRejected);
    socket.on(SOCKET_EVENTS.ROOM_MEMBER_JOINED, handleMemberJoined);
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
    socket.on(SOCKET_EVENTS.ROOM_MEMBER_LEFT, handleMemberLeft);
    socket.on(SOCKET_EVENTS.TYPING_UPDATE, handleTypingUpdate);
    socket.on(SOCKET_EVENTS.ROOM_EXPIRED, handleRoomExpired);
    socket.on(SOCKET_EVENTS.ROOM_CLOSED, handleRoomExpired);

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_JOINED, handleRoomJoined);
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_REJECTED, handleMessageRejected);
      socket.off(SOCKET_EVENTS.ROOM_MEMBER_JOINED, handleMemberJoined);
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
      socket.off(SOCKET_EVENTS.ROOM_MEMBER_LEFT, handleMemberLeft);
      socket.off(SOCKET_EVENTS.TYPING_UPDATE, handleTypingUpdate);
      socket.off(SOCKET_EVENTS.ROOM_EXPIRED, handleRoomExpired);
      socket.off(SOCKET_EVENTS.ROOM_CLOSED, handleRoomExpired);
    };
  }, [socket, roomCode, sessionToken, currentUser.id, router]);

  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (!socket || !content.trim()) return;

    // Play WhatsApp-style message send tune
    playSendSound();

    socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
      roomCode,
      content: content.trim(),
      sessionToken,
    });

    // Notify stop typing
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { roomCode });
  };

  // Typing triggers with user display name
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

  const handleExpire = () => {
    sessionStorage.removeItem(`talknow_session_${roomCode}`);
    router.push('/expired');
  };

  return (
    <div className="fixed inset-0 flex flex-col w-full h-[100dvh] overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <ChatHeader
        roomName={roomName}
        roomCode={roomCode}
        expiresAt={expiresAt}
        memberCount={members.filter((m) => m.isOnline).length}
        typingUsers={typingUsers}
        onOpenInvite={() => setIsShareOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMembers={() => setIsMobileMembersOpen(true)}
        onBackClick={() => setIsLeaveAlertOpen(true)}
        onExpire={handleExpire}
      />

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
          />
        </aside>

        {/* Mobile slide-out members drawer with smooth right-to-left enter & left-to-right exit transition */}
        <div
          className={`fixed inset-0 z-50 lg:hidden flex transition-all duration-300 ${
            isMobileMembersOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
          }`}
        >
          {/* Backdrop with fade in/out */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
              isMobileMembersOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMembersOpen(false)}
          />

          {/* Drawer panel with slide from right to left on enter, and slide back to right on exit */}
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
              />
            </div>
          </div>
        </div>

        {/* Main Conversation Column */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--background)] relative">
          {/* Chat background wallpaper (dynamically switches between light and dark themes) */}
          <div
            className="absolute inset-0 pointer-events-none bg-repeat transition-all duration-200"
            style={{
              backgroundImage: 'var(--chat-bg)',
              backgroundSize: '412px',
            }}
          />

          {/* Message List */}
          <MessageList messages={messages} currentMemberId={currentUser.id} />

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
        onLeaveRoom={handleLeaveRoom}
        onCloseRoom={handleCloseRoom}
      />

      {/* Leave Room Confirmation Alert Dialog (Mobile Top-Left Back Button) */}
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
    </div>
  );
}
