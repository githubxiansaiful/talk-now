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
  ): Promise<{ meeting: Meeting; tokenData: MeetingTokenResponse; participants: MeetingParticipant[] }> {
    const verified = await roomRepository.verifySessionAndRoom(roomCode, sessionToken);
    if (!verified) {
      throw new Error('Unauthorized or room is no longer active');
    }

    const meeting = await meetingRepository.startMeeting(verified.room.id, verified.member.id);
    const tokenData = await this.generateToken(meeting.id, verified.member.id, verified.member.displayName, true);
    const participants: MeetingParticipant[] = [
      {
        id: 'p-' + verified.member.id,
        meetingId: meeting.id,
        memberId: verified.member.id,
        displayName: verified.member.displayName,
        isHost: true,
        isMuted: false,
        isSpeaking: false,
        joinedAt: new Date().toISOString(),
      },
    ];

    return { meeting, tokenData, participants };
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
  ): Promise<{ meeting: Meeting; tokenData: MeetingTokenResponse; participants: MeetingParticipant[] }> {
    const verified = await roomRepository.verifySessionAndRoom(roomCode, sessionToken);
    if (!verified) {
      throw new Error('Unauthorized or room is no longer active');
    }

    const meetingRecord = await meetingRepository.getMeetingById(meetingId);
    if (!meetingRecord || meetingRecord.status !== 'ACTIVE') {
      throw new Error('Meeting not found or has already ended');
    }

    if (meetingRecord.roomId !== verified.room.id) {
      throw new Error('Meeting does not belong to this room');
    }

    await meetingRepository.joinMeeting(meetingId, verified.member.id);

    const isHost = meetingRecord.hostMemberId === verified.member.id;
    const tokenData = await this.generateToken(meetingId, verified.member.id, verified.member.displayName, isHost);

    const participants = await meetingRepository.getActiveParticipants(meetingId);

    const updatedMeeting: Meeting = {
      id: meetingRecord.id,
      roomId: meetingRecord.roomId,
      status: meetingRecord.status as 'ACTIVE' | 'ENDED',
      hostMemberId: meetingRecord.hostMemberId,
      hostDisplayName: meetingRecord.hostMember?.displayName,
      startedAt: meetingRecord.startedAt.toISOString(),
      endedAt: null,
      participantCount: participants.length,
    };

    return { meeting: updatedMeeting, tokenData, participants };
  }

  /**
   * Leaves a meeting
   */
  async leaveMeeting(meetingId: string, sessionToken: string): Promise<boolean> {
    const meeting = await meetingRepository.getMeetingById(meetingId);
    if (!meeting) return false;

    const member = await roomRepository.verifySession(meeting.roomId, sessionToken);
    if (!member) return false;

    return meetingRepository.leaveMeeting(meetingId, member.id);
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
