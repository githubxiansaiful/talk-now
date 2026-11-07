import { prisma } from '../../lib/prisma';
import { generateRoomCode, generateSecureToken, hashToken } from '../../utils/room-code';
import { addMinutesToDate, isPastDate } from '../../utils/time';
import { Room, Member, RoomStatus } from '@talknow/shared';

export class RoomRepository {
  /**
   * Generates a unique room code that does not collide in DB
   */
  async generateUniqueRoomCode(): Promise<string> {
    let attempts = 0;
    while (attempts < 10) {
      const code = generateRoomCode();
      const existing = await prisma.room.findUnique({
        where: { code },
        select: { id: true },
      });
      if (!existing) return code;
      attempts++;
    }
    throw new Error('Failed to generate a unique room code');
  }

  /**
   * Creates a room and its creator member record in a single database transaction
   */
  async createRoomWithCreator(input: {
    displayName: string;
    roomName?: string;
    durationMinutes: number;
    maxMembers?: number;
  }): Promise<{
    room: Room;
    member: Member;
    creatorToken: string;
    sessionToken: string;
  }> {
    const code = await this.generateUniqueRoomCode();
    const creatorToken = generateSecureToken();
    const sessionToken = generateSecureToken();

    const creatorTokenHash = hashToken(creatorToken);
    const sessionTokenHash = hashToken(sessionToken);

    const now = new Date();
    const expiresAt = addMinutesToDate(now, input.durationMinutes);

    const result = await prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          code,
          name: input.roomName || null,
          creatorTokenHash,
          status: 'ACTIVE',
          maxMembers: input.maxMembers || null,
          createdAt: now,
          expiresAt,
        },
      });

      const member = await tx.member.create({
        data: {
          roomId: room.id,
          displayName: input.displayName,
          sessionTokenHash,
          isCreator: true,
          joinedAt: now,
          lastSeenAt: now,
        },
      });

      return { room, member };
    });

    return {
      room: {
        id: result.room.id,
        code: result.room.code,
        name: result.room.name,
        status: result.room.status as RoomStatus,
        maxMembers: result.room.maxMembers,
        createdAt: result.room.createdAt.toISOString(),
        expiresAt: result.room.expiresAt.toISOString(),
        closedAt: result.room.closedAt ? result.room.closedAt.toISOString() : null,
        memberCount: 1,
      },
      member: {
        id: result.member.id,
        roomId: result.member.roomId,
        displayName: result.member.displayName,
        joinedAt: result.member.joinedAt.toISOString(),
        lastSeenAt: result.member.lastSeenAt.toISOString(),
        leftAt: result.member.leftAt ? result.member.leftAt.toISOString() : null,
        isCreator: result.member.isCreator,
        isOnline: true,
      },
      creatorToken,
      sessionToken,
    };
  }

  /**
   * Finds room by public room code. Automatically transitions expired rooms to EXPIRED status.
   */
  async findByCode(code: string): Promise<(Room & { memberCount: number }) | null> {
    const room = await prisma.room.findUnique({
      where: { code },
      include: {
        _count: {
          select: { members: { where: { leftAt: null } } },
        },
      },
    });

    if (!room) return null;

    // Check if room has expired
    let currentStatus = room.status;
    if (room.status === 'ACTIVE' && isPastDate(room.expiresAt)) {
      currentStatus = 'EXPIRED';
      await prisma.room.update({
        where: { id: room.id },
        data: { status: 'EXPIRED' },
      });
    }

    return {
      id: room.id,
      code: room.code,
      name: room.name,
      status: currentStatus as RoomStatus,
      maxMembers: room.maxMembers,
      createdAt: room.createdAt.toISOString(),
      expiresAt: room.expiresAt.toISOString(),
      closedAt: room.closedAt ? room.closedAt.toISOString() : null,
      memberCount: room._count.members,
    };
  }

  /**
   * Adds a new member to an active room
   */
  async joinRoom(
    code: string,
    displayName: string
  ): Promise<{ room: Room; member: Member; sessionToken: string }> {
    const room = await this.findByCode(code);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.status !== 'ACTIVE') {
      throw new Error(`Cannot join room: room is ${room.status.toLowerCase()}`);
    }

    if (room.maxMembers && room.memberCount >= room.maxMembers) {
      throw new Error('Room has reached its maximum member limit');
    }

    const sessionToken = generateSecureToken();
    const sessionTokenHash = hashToken(sessionToken);
    const now = new Date();

    const member = await prisma.member.create({
      data: {
        roomId: room.id,
        displayName,
        sessionTokenHash,
        isCreator: false,
        joinedAt: now,
        lastSeenAt: now,
      },
    });

    return {
      room,
      member: {
        id: member.id,
        roomId: member.roomId,
        displayName: member.displayName,
        joinedAt: member.joinedAt.toISOString(),
        lastSeenAt: member.lastSeenAt.toISOString(),
        leftAt: null,
        isCreator: member.isCreator,
        isOnline: true,
      },
      sessionToken,
    };
  }

  /**
   * Closes a room. Only permitted if creatorToken is valid.
   */
  async closeRoom(code: string, creatorToken: string): Promise<Room> {
    const room = await prisma.room.findUnique({
      where: { code },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    const creatorTokenHash = hashToken(creatorToken);
    if (room.creatorTokenHash !== creatorTokenHash) {
      throw new Error('Unauthorized: Invalid creator token');
    }

    const now = new Date();
    const updated = await prisma.room.update({
      where: { id: room.id },
      data: {
        status: 'CLOSED',
        closedAt: now,
      },
    });

    return {
      id: updated.id,
      code: updated.code,
      name: updated.name,
      status: updated.status as RoomStatus,
      maxMembers: updated.maxMembers,
      createdAt: updated.createdAt.toISOString(),
      expiresAt: updated.expiresAt.toISOString(),
      closedAt: updated.closedAt ? updated.closedAt.toISOString() : null,
    };
  }

  /**
   * Verifies member session token
   */
  async verifySession(roomId: string, sessionToken: string): Promise<Member | null> {
    const sessionTokenHash = hashToken(sessionToken);
    const member = await prisma.member.findFirst({
      where: {
        roomId,
        sessionTokenHash,
        leftAt: null,
      },
    });

    if (!member) return null;

    return {
      id: member.id,
      roomId: member.roomId,
      displayName: member.displayName,
      joinedAt: member.joinedAt.toISOString(),
      lastSeenAt: member.lastSeenAt.toISOString(),
      leftAt: member.leftAt ? member.leftAt.toISOString() : null,
      isCreator: member.isCreator,
      isOnline: true,
    };
  }
}

export const roomRepository = new RoomRepository();
