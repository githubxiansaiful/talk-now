import { Room, Member } from '@talknow/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export interface CreateRoomInput {
  displayName: string;
  roomName?: string;
  durationMinutes: number;
  maxMembers?: number;
}

export interface CreateRoomResponse {
  room: Room;
  member: Member;
  creatorToken: string;
  sessionToken: string;
}

export interface JoinRoomResponse {
  room: Room;
  member: Member;
  sessionToken: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = {
  /**
   * Creates a new ephemeral room with the creator member
   */
  async createRoom(data: CreateRoomInput): Promise<CreateRoomResponse> {
    const res = await fetch(`${API_BASE_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Failed to create room', res.status);
    }
    return json.data;
  },

  /**
   * Fetches room public metadata and validates active status
   */
  async getRoomPreview(code: string): Promise<Room & { memberCount: number }> {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Room not found', res.status);
    }
    return json.data;
  },

  /**
   * Joins an existing active room
   */
  async joinRoom(code: string, displayName: string): Promise<JoinRoomResponse> {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayName }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Failed to join room', res.status);
    }
    return json.data;
  },

  /**
   * Closes a room (creator only)
   */
  async closeRoom(code: string, creatorToken: string): Promise<Room> {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-creator-token': creatorToken,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Failed to close room', res.status);
    }
    return json.data;
  },
};
