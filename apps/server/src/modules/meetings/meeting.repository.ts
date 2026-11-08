import { prisma } from '@talknow/database';
import { Meeting, MeetingParticipant } from '@talknow/shared';

export class MeetingRepository {
  /**
   * Starts a new meeting or returns existing active meeting for room
   */
  async startMeeting(roomId: string, hostMemberId: string): Promise<Meeting> {
    const existing = await prisma.meeting.findFirst({
      where: {
        roomId,
        status: 'ACTIVE',
      },
      include: {
        hostMember: { select: { displayName: true } },
        _count: {
          select: {
            participants: { where: { leftAt: null } },
          },
        },
      },
    });

    if (existing) {
      return {
        id: existing.id,
        roomId: existing.roomId,
        status: existing.status as 'ACTIVE' | 'ENDED',
        hostMemberId: existing.hostMemberId,
        hostDisplayName: existing.hostMember?.displayName,
        startedAt: existing.startedAt.toISOString(),
        endedAt: existing.endedAt ? existing.endedAt.toISOString() : null,
        participantCount: existing._count.participants,
      };
    }

    const meeting = await prisma.meeting.create({
      data: {
        roomId,
        hostMemberId,
        status: 'ACTIVE',
        participants: {
          create: {
            memberId: hostMemberId,
          },
        },
      },
      include: {
        hostMember: { select: { displayName: true } },
      },
    });

    return {
      id: meeting.id,
      roomId: meeting.roomId,
      status: meeting.status as 'ACTIVE' | 'ENDED',
      hostMemberId: meeting.hostMemberId,
      hostDisplayName: meeting.hostMember?.displayName,
      startedAt: meeting.startedAt.toISOString(),
      endedAt: null,
      participantCount: 1,
    };
  }

  /**
   * Gets the active meeting for a room
   */
  async getActiveMeeting(roomId: string): Promise<Meeting | null> {
    const meeting = await prisma.meeting.findFirst({
      where: {
        roomId,
        status: 'ACTIVE',
      },
      include: {
        hostMember: { select: { displayName: true } },
        _count: {
          select: {
            participants: { where: { leftAt: null } },
          },
        },
      },
    });

    if (!meeting) return null;

    return {
      id: meeting.id,
      roomId: meeting.roomId,
      status: meeting.status as 'ACTIVE' | 'ENDED',
      hostMemberId: meeting.hostMemberId,
      hostDisplayName: meeting.hostMember?.displayName,
      startedAt: meeting.startedAt.toISOString(),
      endedAt: null,
      participantCount: meeting._count.participants,
    };
  }

  /**
   * Gets meeting by id
   */
  async getMeetingById(meetingId: string) {
    return prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        room: true,
        hostMember: true,
      },
    });
  }

  /**
   * Adds or activates participant in a meeting
   */
  async joinMeeting(meetingId: string, memberId: string): Promise<void> {
    const existing = await prisma.meetingParticipant.findFirst({
      where: {
        meetingId,
        memberId,
        leftAt: null,
      },
    });

    if (!existing) {
      await prisma.meetingParticipant.create({
        data: {
          meetingId,
          memberId,
        },
      });
    }
  }

  /**
   * Marks participant as left (returns true if participant was active and now marked left)
   */
  async leaveMeeting(meetingId: string, memberId: string): Promise<boolean> {
    const result = await prisma.meetingParticipant.updateMany({
      where: {
        meetingId,
        memberId,
        leftAt: null,
      },
      data: {
        leftAt: new Date(),
      },
    });
    return result.count > 0;
  }

  /**
   * Ends a meeting and marks all participants as left
   */
  async endMeeting(meetingId: string): Promise<Meeting> {
    const now = new Date();
    const meeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: 'ENDED',
        endedAt: now,
      },
      include: {
        hostMember: { select: { displayName: true } },
      },
    });

    await prisma.meetingParticipant.updateMany({
      where: {
        meetingId,
        leftAt: null,
      },
      data: {
        leftAt: now,
      },
    });

    return {
      id: meeting.id,
      roomId: meeting.roomId,
      status: 'ENDED',
      hostMemberId: meeting.hostMemberId,
      hostDisplayName: meeting.hostMember?.displayName,
      startedAt: meeting.startedAt.toISOString(),
      endedAt: now.toISOString(),
      participantCount: 0,
    };
  }

  /**
   * Ends all active meetings for a room (e.g. on room close or expire)
   */
  async endActiveMeetingsForRoom(roomId: string): Promise<string[]> {
    const active = await prisma.meeting.findMany({
      where: {
        roomId,
        status: 'ACTIVE',
      },
      select: { id: true },
    });

    const now = new Date();
    for (const m of active) {
      await prisma.meeting.update({
        where: { id: m.id },
        data: {
          status: 'ENDED',
          endedAt: now,
        },
      });

      await prisma.meetingParticipant.updateMany({
        where: {
          meetingId: m.id,
          leftAt: null,
        },
        data: {
          leftAt: now,
        },
      });
    }

    return active.map((m) => m.id);
  }

  /**
   * Gets list of current active participants in a meeting
   */
  async getActiveParticipants(meetingId: string): Promise<MeetingParticipant[]> {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      select: { hostMemberId: true },
    });

    const participants = await prisma.meetingParticipant.findMany({
      where: {
        meetingId,
        leftAt: null,
      },
      include: {
        member: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return participants.map((p) => ({
      id: p.id,
      meetingId: p.meetingId,
      memberId: p.memberId,
      displayName: p.member.displayName,
      isHost: meeting?.hostMemberId === p.memberId,
      isMuted: false,
      isSpeaking: false,
      joinedAt: p.joinedAt.toISOString(),
    }));
  }
}

export const meetingRepository = new MeetingRepository();
