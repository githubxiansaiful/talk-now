import { Room, Member, Meeting, MeetingParticipant, MeetingTokenResponse } from '@talknow/shared';

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

  /**
   * Extends room expiry duration (creator only)
   */
  async extendRoom(code: string, minutes: number = 30, creatorToken?: string): Promise<Room> {
    let token = creatorToken;
    if (!token && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(`talknow_session_${code}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          token = parsed?.creatorToken;
        }
      } catch {}
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['x-creator-token'] = token;
    }

    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}/extend`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ minutes, creatorToken: token }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Failed to extend room', res.status);
    }
    return json.data;
  },

  /**
   * Starts a meeting
   */
  async startMeeting(
    code: string,
    sessionToken: string
  ): Promise<{ meeting: Meeting; tokenData: MeetingTokenResponse }> {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': sessionToken,
      },
      body: JSON.stringify({ sessionToken }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Failed to start meeting', res.status);
    }
    return json.data;
  },

  /**
   * Gets active meeting for room
   */
  async getActiveMeeting(code: string): Promise<Meeting | null> {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}/meetings/active`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Failed to get active meeting', res.status);
    }
    return json.data;
  },

  /**
   * Joins an active meeting
   */
  async joinMeeting(
    code: string,
    meetingId: string,
    sessionToken: string
  ): Promise<{ meeting: Meeting; tokenData: MeetingTokenResponse }> {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}/meetings/${meetingId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': sessionToken,
      },
      body: JSON.stringify({ sessionToken }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Failed to join meeting', res.status);
    }
    return json.data;
  },

  /**
   * Leaves an active meeting
   */
  async leaveMeeting(
    code: string,
    meetingId: string,
    sessionToken: string,
    memberId?: string
  ): Promise<void> {
    await fetch(`${API_BASE_URL}/api/rooms/${code}/meetings/${meetingId}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': sessionToken,
      },
      body: JSON.stringify({ sessionToken, memberId }),
    }).catch(() => {});
  },

  /**
   * Ends an active meeting (host or room creator)
   */
  async endMeeting(
    code: string,
    meetingId: string,
    sessionToken: string,
    creatorToken?: string
  ): Promise<Meeting> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-session-token': sessionToken,
    };
    if (creatorToken) {
      headers['x-creator-token'] = creatorToken;
    }

    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}/meetings/${meetingId}/end`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ sessionToken, creatorToken }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error || 'Failed to end meeting', res.status);
    }
    return json.data;
  },

  /**
   * Gets participants of meeting
   */
  async getMeetingParticipants(code: string, meetingId: string): Promise<MeetingParticipant[]> {
    const res = await fetch(`${API_BASE_URL}/api/rooms/${code}/meetings/${meetingId}/participants`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      return [];
    }
    return json.data || [];
  },
};
