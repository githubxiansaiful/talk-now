import { roomRepository } from './room.repository';
import {
  createRoomSchema,
  joinRoomSchema,
  CreateRoomSchemaType,
  JoinRoomSchemaType,
  Room,
  Member,
} from '@talknow/shared';

export class RoomService {
  async createRoom(input: unknown): Promise<{
    room: Room;
    member: Member;
    creatorToken: string;
    sessionToken: string;
  }> {
    const validated: CreateRoomSchemaType = createRoomSchema.parse(input);

    return roomRepository.createRoomWithCreator({
      displayName: validated.displayName,
      roomName: validated.roomName,
      durationMinutes: validated.durationMinutes,
      maxMembers: validated.maxMembers,
    });
  }

  async getRoomPreview(code: string): Promise<Room & { memberCount: number }> {
    const room = await roomRepository.findByCode(code);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  async joinRoom(
    code: string,
    input: unknown
  ): Promise<{ room: Room; member: Member; sessionToken: string }> {
    const validated: JoinRoomSchemaType = joinRoomSchema.parse({
      roomCode: code,
      ...((input as object) || {}),
    });

    return roomRepository.joinRoom(code, validated.displayName);
  }

  async closeRoom(code: string, creatorToken: string): Promise<Room> {
    if (!creatorToken) {
      throw new Error('Missing creator token');
    }
    return roomRepository.closeRoom(code, creatorToken);
  }

  async verifyMemberSession(roomId: string, sessionToken: string): Promise<Member | null> {
    if (!sessionToken) return null;
    return roomRepository.verifySession(roomId, sessionToken);
  }
}

export const roomService = new RoomService();
