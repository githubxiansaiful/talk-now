import { AccessToken } from 'livekit-server-sdk';
import { ENV } from '../../config/env';
import { meetingRepository } from './meeting.repository';
import { roomRepository } from '../rooms/room.repository';
import { Meeting, MeetingParticipant, MeetingTokenResponse } from '@talknow/shared';

export class MeetingService {
  /**
   * Starts a meeting for a room
   */
  async startMeeting(
    roomCode: string,
    sessionToken: string
  ): Promise<{ meeting: Meeting; tokenData: MeetingTokenResponse }> {
    const room = await roomRepository.findByCode(roomCode);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.status !== 'ACTIVE') {
      throw new Error(`Cannot start meeting: room is ${room.status.toLowerCase()}`);
    }

    const member = await roomRepository.verifySession(room.id, sessionToken);
    if (!member) {
      throw new Error('Unauthorized: Invalid member session');
    }

    const meeting = await meetingRepository.startMeeting(room.id, member.id);
    const tokenData = await this.generateToken(meeting.id, member.id, member.displayName, true);

    return { meeting, tokenData };
  }

  /**
   * Gets active meeting for a room
   */
  async getActiveMeeting(roomCode: string): Promise<Meeting | null> {
    const room = await roomRepository.findByCode(roomCode);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.status !== 'ACTIVE') {
      return null;
    }

    return meetingRepository.getActiveMeeting(room.id);
  }

  /**
   * Joins an active meeting
   */
  async joinMeeting(
    roomCode: string,
    meetingId: string,
    sessionToken: string
  ): Promise<{ meeting: Meeting; tokenData: MeetingTokenResponse }> {
    const room = await roomRepository.findByCode(roomCode);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.status !== 'ACTIVE') {
      throw new Error('Cannot join meeting: room is no longer active');
    }

    const member = await roomRepository.verifySession(room.id, sessionToken);
    if (!member) {
      throw new Error('Unauthorized: Invalid member session');
    }

    const meetingRecord = await meetingRepository.getMeetingById(meetingId);
    if (!meetingRecord || meetingRecord.status !== 'ACTIVE') {
      throw new Error('Meeting not found or has already ended');
    }

    if (meetingRecord.roomId !== room.id) {
      throw new Error('Meeting does not belong to this room');
    }

    await meetingRepository.joinMeeting(meetingId, member.id);

    const isHost = meetingRecord.hostMemberId === member.id;
    const tokenData = await this.generateToken(meetingId, member.id, member.displayName, isHost);

    const updated = await meetingRepository.getActiveMeeting(room.id);
    if (!updated) {
      throw new Error('Failed to retrieve meeting state');
    }

    return { meeting: updated, tokenData };
  }

  /**
   * Leaves a meeting
   */
  async leaveMeeting(meetingId: string, sessionToken: string): Promise<void> {
    const meeting = await meetingRepository.getMeetingById(meetingId);
    if (!meeting) return;

    const member = await roomRepository.verifySession(meeting.roomId, sessionToken);
    if (!member) return;

    await meetingRepository.leaveMeeting(meetingId, member.id);
  }

  /**
   * Ends a meeting (host or room creator only)
   */
  async endMeeting(
    meetingId: string,
    sessionToken: string,
    creatorToken?: string
  ): Promise<Meeting> {
    const meeting = await meetingRepository.getMeetingById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const member = await roomRepository.verifySession(meeting.roomId, sessionToken);
    if (!member) {
      throw new Error('Unauthorized: Invalid member session');
    }

    const isMeetingHost = meeting.hostMemberId === member.id;
    const isRoomCreator = member.isCreator;

    if (!isMeetingHost && !isRoomCreator) {
      throw new Error('Unauthorized: Only the meeting host or room creator can end the meeting');
    }

    return meetingRepository.endMeeting(meetingId);
  }

  /**
   * Gets list of current participants in meeting
   */
  async getParticipants(meetingId: string): Promise<MeetingParticipant[]> {
    return meetingRepository.getActiveParticipants(meetingId);
  }

  /**
   * Generates LiveKit access token (with local fallback if credentials not configured)
   */
  async generateToken(
    meetingId: string,
    memberId: string,
    displayName: string,
    isHost: boolean
  ): Promise<MeetingTokenResponse> {
    const hasLiveKitConfig = Boolean(
      ENV.LIVEKIT_API_KEY && ENV.LIVEKIT_API_SECRET && ENV.LIVEKIT_URL
    );

    if (hasLiveKitConfig) {
      try {
        const at = new AccessToken(ENV.LIVEKIT_API_KEY, ENV.LIVEKIT_API_SECRET, {
          identity: memberId,
          name: displayName,
          ttl: '3h',
        });

        at.addGrant({
          roomJoin: true,
          room: meetingId,
          canPublish: true,
          canSubscribe: true,
          canPublishData: true,
        });

        const token = await at.toJwt();
        return {
          token,
          serverUrl: ENV.LIVEKIT_URL,
          meetingId,
          participantId: memberId,
          displayName,
          isHost,
        };
      } catch (err) {
        console.warn('[MeetingService] Failed to generate LiveKit JWT, falling back to local mode:', err);
      }
    }

    // Local / fallback token mode
    return {
      token: `talknow_local_token_${meetingId}_${memberId}`,
      serverUrl: 'local',
      meetingId,
      participantId: memberId,
      displayName,
      isHost,
    };
  }
}

export const meetingService = new MeetingService();
