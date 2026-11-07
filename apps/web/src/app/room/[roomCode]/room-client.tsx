'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Room } from '@talknow/shared';
import { ChatLayout } from '@/components/room/chat-layout';
import { JoinRoomScreen } from '@/components/room/join-room-screen';
import { apiClient, ApiError } from '@/lib/api-client';
import { ErrorState } from '@/components/common/error-state';
import { LoadingScreen } from '@/components/common/loading-screen';

interface RoomClientProps {
  roomCode: string;
}

interface StoredSession {
  displayName: string;
  roomName?: string;
  isCreator: boolean;
  expiresAt: string;
  maxMembers?: number | null;
  sessionToken: string;
  creatorToken?: string;
  memberId: string;
}

export function RoomClient({ roomCode }: RoomClientProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<(Room & { memberCount: number }) | null>(null);
  const [session, setSession] = useState<StoredSession | null>(null);

  // Fetch real room metadata from backend API
  const fetchRoomData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const roomData = await apiClient.getRoomPreview(roomCode);

      if (roomData.status === 'EXPIRED' || roomData.status === 'CLOSED') {
        router.push('/expired');
        return;
      }

      setRoom(roomData);

      // Check for existing session in sessionStorage
      try {
        const stored = sessionStorage.getItem(`talknow_session_${roomCode}`);
        if (stored) {
          const parsed: StoredSession = JSON.parse(stored);
          setSession(parsed);
        }
      } catch {
        // No valid local session
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('Room not found. This link may be incorrect or the room was already deleted.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to connect to room server.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [roomCode, router]);

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  // Handle joining as a new member
  const handleJoin = async (displayName: string) => {
    try {
      setIsLoading(true);
      const result = await apiClient.joinRoom(roomCode, displayName);

      const newSession: StoredSession = {
        displayName: result.member.displayName,
        roomName: result.room.name || `Room ${result.room.code}`,
        isCreator: false,
        expiresAt: result.room.expiresAt,
        maxMembers: result.room.maxMembers,
        sessionToken: result.sessionToken,
        memberId: result.member.id,
      };

      try {
        sessionStorage.setItem(`talknow_session_${roomCode}`, JSON.stringify(newSession));
      } catch {
        // Ignore
      }

      setSession(newSession);
      setRoom((prev) => (prev ? { ...prev, memberCount: prev.memberCount + 1 } : null));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not join room');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <LoadingScreen message="Connecting to room..." />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <ErrorState
          title="Room Unavailable"
          message={error || 'Unable to open this room.'}
          onRetry={fetchRoomData}
        />
      </div>
    );
  }

  // Pre-join screen if visitor does not have an active session yet
  if (!session?.sessionToken) {
    return (
      <JoinRoomScreen
        roomCode={room.code}
        roomName={room.name || `Room ${room.code}`}
        expiresAt={room.expiresAt}
        memberCount={room.memberCount || 1}
        onJoin={handleJoin}
      />
    );
  }

  // User is inside the active room
  return (
    <ChatLayout
      roomCode={room.code}
      roomName={room.name || `Room ${room.code}`}
      currentUser={{
        id: session.memberId,
        displayName: session.displayName,
        isCreator: Boolean(session.isCreator),
      }}
      sessionToken={session.sessionToken}
      creatorToken={session.creatorToken}
      expiresAt={room.expiresAt}
      maxMembers={room.maxMembers}
    />
  );
}
