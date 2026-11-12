export type RoomStatus = 'ACTIVE' | 'EXPIRED' | 'CLOSED';

export type MessageType = 'TEXT' | 'SYSTEM';

export interface Room {
  id: string;
  code: string;
  name: string | null;
  status: RoomStatus;
  maxMembers: number | null;
  createdAt: string;
  expiresAt: string;
  closedAt: string | null;
  memberCount?: number;
}

export interface Member {
  id: string;
  roomId: string;
  displayName: string;
  joinedAt: string;
  lastSeenAt: string;
  leftAt?: string | null;
  isCreator: boolean;
  isOnline: boolean;
}

export interface MessageReactionSummary {
  emoji: string;
  count: number;
  memberIds: string[];
}

export interface Message {
  id: string;
  roomId: string;
  memberId: string;
  senderName: string;
  senderIsCreator?: boolean;
  content: string;
  messageType: MessageType;
  createdAt: string;
  editedAt?: string | null;
  deletedAt?: string | null;
  isOwnMessage?: boolean;
  reactions?: MessageReactionSummary[];
}

export interface TypingIndicatorPayload {
  roomId: string;
  memberId: string;
  displayName: string;
}

export interface RoomJoinPayload {
  roomCode: string;
  displayName: string;
  sessionToken?: string;
}

export interface RoomCreateInput {
  displayName: string;
  roomName?: string;
  durationMinutes: number;
  maxMembers?: number;
}

export interface RoomCreateResponse {
  room: Room;
  member: Member;
  sessionToken: string;
  creatorToken: string;
}

export interface RoomJoinResponse {
  room: Room;
  member: Member;
  sessionToken: string;
  messages: Message[];
  members: Member[];
}
