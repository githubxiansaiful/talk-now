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
import { X, WifiOff } from 'lucide-react';
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

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!isMobileMembersOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMembersOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMembersOpen]);

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
      displayName: string;
      isTyping: boolean;
    }) => {
      if (data.memberId === currentUser.id) return;
      setTypingUsers((prev) => {
        if (data.isTyping) {
          return prev.includes(data.displayName) ? prev : [...prev, data.displayName];
        } else {
          return prev.filter((name) => name !== data.displayName);
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

    socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
      roomCode,
      content: content.trim(),
      sessionToken,
    });

    // Notify stop typing
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { roomCode });
  };

  // Typing triggers
  const handleTypingStart = () => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.TYPING_START, { roomCode });
  };

  const handleTypingStop = () => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { roomCode });
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
        onOpenInvite={() => setIsShareOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMembers={() => setIsMobileMembersOpen(true)}
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

        {/* Mobile slide-out members drawer */}
        {isMobileMembersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMembersOpen(false)}
            />

            <div className="relative ml-auto w-72 max-w-[80vw] h-full bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
              <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                  Participants
                </span>
                <button
                  onClick={() => setIsMobileMembersOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
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
        )}

        {/* Main Conversation Column */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--background)]">
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
    </div>
  );
}
