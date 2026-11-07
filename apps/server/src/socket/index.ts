import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { SOCKET_EVENTS, Member, Meeting, MeetingParticipant } from '@talknow/shared';
import { ENV } from '../config/env';
import { roomRepository } from '../modules/rooms/room.repository';
import { messageService } from '../modules/messages/message.service';
import { meetingRepository } from '../modules/meetings/meeting.repository';
import { hashToken } from '../utils/room-code';
import { prisma } from '../lib/prisma';
import { checkSocketMessageRateLimit } from '../middleware/rate-limit';

interface SocketSession {
  roomId: string;
  roomCode: string;
  memberId: string;
  displayName: string;
  isCreator: boolean;
}

let ioInstance: SocketIOServer | null = null;

export function getSocketIO(): SocketIOServer | null {
  return ioInstance;
}

export function broadcastRoomClosed(roomCode: string): void {
  if (ioInstance) {
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.ROOM_CLOSED, { roomCode });
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.MEETING_ENDED, { roomCode });
  }
}

export function broadcastRoomExpired(roomCode: string): void {
  if (ioInstance) {
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.ROOM_EXPIRED, { roomCode });
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.MEETING_ENDED, { roomCode });
  }
}

export function broadcastRoomTimeExtended(roomCode: string, expiresAt: string): void {
  if (ioInstance) {
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.ROOM_TIME_EXTENDED, { roomCode, expiresAt });
  }
}

export function broadcastMeetingStarted(roomCode: string, meeting: Meeting): void {
  if (ioInstance) {
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.MEETING_STARTED, { roomCode, meeting });
  }
}

export function broadcastMeetingEnded(roomCode: string, meetingId: string): void {
  if (ioInstance) {
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.MEETING_ENDED, { roomCode, meetingId });
  }
}

export function broadcastMeetingParticipantJoined(
  roomCode: string,
  payload: { meetingId: string; participant: MeetingParticipant; participantCount: number }
): void {
  if (ioInstance) {
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.MEETING_PARTICIPANT_JOINED, payload);
  }
}

export function broadcastMeetingParticipantLeft(
  roomCode: string,
  payload: { meetingId: string; memberId: string }
): void {
  if (ioInstance) {
    ioInstance.to(roomCode).emit(SOCKET_EVENTS.MEETING_PARTICIPANT_LEFT, payload);
  }
}

export function initializeSocketServer(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [ENV.WEB_ORIGIN, 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  ioInstance = io;

  // Map socket ID to session data
  const socketSessions = new Map<string, SocketSession>();

  // Track online status per member ID
  const memberSockets = new Map<string, Set<string>>();

  io.on('connection', (socket: Socket) => {
    /**
     * Join Room Event
     */
    socket.on(
      SOCKET_EVENTS.ROOM_JOIN,
      async (data: { roomCode: string; sessionToken: string; displayName?: string }) => {
        try {
          const { roomCode, sessionToken } = data || {};
          if (!roomCode || !sessionToken) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Missing room code or session token' });
            return;
          }

          const room = await roomRepository.findByCode(roomCode);
          if (!room) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Room not found' });
            return;
          }

          if (room.status !== 'ACTIVE') {
            socket.emit(SOCKET_EVENTS.ROOM_EXPIRED, { message: `Room is ${room.status.toLowerCase()}` });
            return;
          }

          // Verify session token
          const tokenHash = hashToken(sessionToken);
          const memberRecord = await prisma.member.findFirst({
            where: {
              roomId: room.id,
              sessionTokenHash: tokenHash,
              leftAt: null,
            },
          });

          if (!memberRecord) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Invalid or expired member session' });
            return;
          }

          // Update member lastSeenAt
          await prisma.member.update({
            where: { id: memberRecord.id },
            data: { lastSeenAt: new Date() },
          });

          // Join Socket.IO room channel
          socket.join(roomCode);

          // Save socket session
          const session: SocketSession = {
            roomId: room.id,
            roomCode,
            memberId: memberRecord.id,
            displayName: memberRecord.displayName,
            isCreator: memberRecord.isCreator,
          };
          socketSessions.set(socket.id, session);

          // Register socket to member
          let socketsForMember = memberSockets.get(memberRecord.id);
          if (!socketsForMember) {
            socketsForMember = new Set();
            memberSockets.set(memberRecord.id, socketsForMember);
          }
          socketsForMember.add(socket.id);

          // Fetch active members and recent messages
          const allMembers = await prisma.member.findMany({
            where: { roomId: room.id, leftAt: null },
            orderBy: { joinedAt: 'asc' },
          });

          const formattedMembers: Member[] = allMembers.map((m) => {
            const activeSockets = memberSockets.get(m.id);
            return {
              id: m.id,
              roomId: m.roomId,
              displayName: m.displayName,
              joinedAt: m.joinedAt.toISOString(),
              lastSeenAt: m.lastSeenAt.toISOString(),
              leftAt: null,
              isCreator: m.isCreator,
              isOnline: Boolean(activeSockets && activeSockets.size > 0),
            };
          });

          const recentMessages = await messageService.getRecentMessages(room.id, 100);

          // Acknowledge join to connecting socket
          socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
            room,
            member: {
              id: memberRecord.id,
              roomId: room.id,
              displayName: memberRecord.displayName,
              joinedAt: memberRecord.joinedAt.toISOString(),
              lastSeenAt: memberRecord.lastSeenAt.toISOString(),
              isCreator: memberRecord.isCreator,
              isOnline: true,
            },
            messages: recentMessages,
            members: formattedMembers,
          });

          // Broadcast to other room members
          socket.to(roomCode).emit(SOCKET_EVENTS.ROOM_MEMBER_JOINED, {
            member: {
              id: memberRecord.id,
              roomId: room.id,
              displayName: memberRecord.displayName,
              joinedAt: memberRecord.joinedAt.toISOString(),
              lastSeenAt: memberRecord.lastSeenAt.toISOString(),
              isCreator: memberRecord.isCreator,
              isOnline: true,
            },
          });

          socket.to(roomCode).emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
            memberId: memberRecord.id,
            isOnline: true,
          });
        } catch (error) {
          console.error('[Socket] Error on room:join:', error);
          socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Failed to join room' });
        }
      }
    );

    /**
     * Send Message Event (with rate limit & abuse protection)
     */
    socket.on(
      SOCKET_EVENTS.MESSAGE_SEND,
      async (data: { roomCode: string; content: string; sessionToken: string }) => {
        try {
          const { roomCode, content } = data || {};
          const session = socketSessions.get(socket.id);

          if (!session || session.roomCode !== roomCode) {
            socket.emit(SOCKET_EVENTS.MESSAGE_REJECTED, { error: 'Unauthorized socket session' });
            return;
          }

          if (!content || !content.trim()) return;

          // Rate limit: max 5 messages per 3s
          const rateCheck = checkSocketMessageRateLimit(session.memberId);
          if (!rateCheck.allowed) {
            socket.emit(SOCKET_EVENTS.MESSAGE_REJECTED, {
              error: `Slow down! Please wait ${Math.ceil(rateCheck.retryAfterMs / 1000)}s before sending another message.`,
            });
            return;
          }

          // Check if room is still active
          const room = await roomRepository.findByCode(roomCode);
          if (!room || room.status !== 'ACTIVE') {
            socket.emit(SOCKET_EVENTS.ROOM_EXPIRED, { message: 'Room has expired or closed' });
            return;
          }

          // Persist message in PostgreSQL
          const message = await messageService.sendMessage({
            roomId: session.roomId,
            memberId: session.memberId,
            content: content.trim(),
          });

          // Broadcast saved message to all sockets in the room
          io.to(roomCode).emit(SOCKET_EVENTS.MESSAGE_NEW, message);
        } catch (error) {
          console.error('[Socket] Error sending message:', error);
          socket.emit(SOCKET_EVENTS.MESSAGE_REJECTED, {
            error: error instanceof Error ? error.message : 'Failed to deliver message',
          });
        }
      }
    );

    /**
     * Typing Indicators
     */
    socket.on(
      SOCKET_EVENTS.TYPING_START,
      (data: { roomCode: string; memberId?: string; displayName?: string }) => {
        const session = socketSessions.get(socket.id);
        const displayName = data?.displayName || session?.displayName || 'Someone';
        const memberId = data?.memberId || session?.memberId || socket.id;

        socket.to(data.roomCode).emit(SOCKET_EVENTS.TYPING_UPDATE, {
          roomCode: data.roomCode,
          memberId,
          displayName,
          isTyping: true,
        });
      }
    );

    socket.on(
      SOCKET_EVENTS.TYPING_STOP,
      (data: { roomCode: string; memberId?: string; displayName?: string }) => {
        const session = socketSessions.get(socket.id);
        const displayName = data?.displayName || session?.displayName || 'Someone';
        const memberId = data?.memberId || session?.memberId || socket.id;

        socket.to(data.roomCode).emit(SOCKET_EVENTS.TYPING_UPDATE, {
          roomCode: data.roomCode,
          memberId,
          displayName,
          isTyping: false,
        });
      }
    );

    /**
     * Leave Room Event
     */
    socket.on(SOCKET_EVENTS.ROOM_LEAVE, async (data: { roomCode: string }) => {
      const session = socketSessions.get(socket.id);
      if (session) {
        socket.leave(data.roomCode);
        socket.to(data.roomCode).emit(SOCKET_EVENTS.ROOM_MEMBER_LEFT, {
          memberId: session.memberId,
        });
      }
    });

    /**
     * Extend Room Time Event (creator only)
     */
    socket.on(
      SOCKET_EVENTS.ROOM_EXTEND,
      async (data: { roomCode: string; minutes?: number }) => {
        try {
          const { roomCode, minutes = 30 } = data || {};
          const session = socketSessions.get(socket.id);
          if (!session || session.roomCode !== roomCode) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Unauthorized session' });
            return;
          }

          if (!session.isCreator) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Only the room creator can extend the room duration' });
            return;
          }

          const updated = await roomRepository.extendRoom(roomCode, minutes);
          io.to(roomCode).emit(SOCKET_EVENTS.ROOM_TIME_EXTENDED, {
            roomCode,
            expiresAt: updated.expiresAt,
          });
        } catch (error) {
          console.error('[Socket] Error extending room:', error);
          socket.emit(SOCKET_EVENTS.ROOM_ERROR, {
            message: error instanceof Error ? error.message : 'Failed to extend room',
          });
        }
      }
    );

    /**
     * Message Reaction Event
     */
    socket.on(
      SOCKET_EVENTS.MESSAGE_REACT,
      async (data: { roomCode: string; messageId: string; emoji: string }) => {
        try {
          const { roomCode, messageId, emoji } = data || {};
          const session = socketSessions.get(socket.id);
          if (!session || session.roomCode !== roomCode) {
            socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Unauthorized session' });
            return;
          }

          if (!messageId || !emoji) return;

          const updatedReactions = await messageService.toggleReaction({
            messageId,
            memberId: session.memberId,
            emoji,
          });

          io.to(roomCode).emit(SOCKET_EVENTS.MESSAGE_REACTION_UPDATE, {
            messageId,
            reactions: updatedReactions,
          });
        } catch (error) {
          console.error('[Socket] Error toggling reaction:', error);
        }
      }
    );

    /**
     * Meeting State Request Event
     */
    socket.on(
      SOCKET_EVENTS.MEETING_STATE_REQUEST,
      async (data: { roomCode: string }) => {
        try {
          const { roomCode } = data || {};
          const session = socketSessions.get(socket.id);
          if (!session || session.roomCode !== roomCode) return;

          const activeMeeting = await meetingRepository.getActiveMeeting(session.roomId);
          if (!activeMeeting) {
            socket.emit(SOCKET_EVENTS.MEETING_STATE, { meeting: null, participants: [] });
            return;
          }

          const participants = await meetingRepository.getActiveParticipants(activeMeeting.id);
          socket.emit(SOCKET_EVENTS.MEETING_STATE, {
            meeting: activeMeeting,
            participants,
          });
        } catch (error) {
          console.error('[Socket] Error fetching meeting state:', error);
        }
      }
    );

    /**
     * Meeting Audio State Event (mute, speaking)
     */
    socket.on(
      SOCKET_EVENTS.MEETING_AUDIO_STATE,
      (data: { roomCode: string; meetingId: string; isMuted: boolean; isSpeaking: boolean }) => {
        const { roomCode, meetingId, isMuted, isSpeaking } = data || {};
        const session = socketSessions.get(socket.id);
        if (!session || session.roomCode !== roomCode) return;

        io.to(roomCode).emit(SOCKET_EVENTS.MEETING_PARTICIPANT_UPDATED, {
          meetingId,
          memberId: session.memberId,
          displayName: session.displayName,
          isMuted: Boolean(isMuted),
          isSpeaking: Boolean(isSpeaking),
        });
      }
    );

    /**
     * Meeting Leave Event
     */
    socket.on(
      SOCKET_EVENTS.MEETING_LEAVE,
      async (data: { roomCode: string; meetingId: string }) => {
        try {
          const { roomCode, meetingId } = data || {};
          const session = socketSessions.get(socket.id);
          if (!session || session.roomCode !== roomCode) return;

          await meetingRepository.leaveMeeting(meetingId, session.memberId);
          io.to(roomCode).emit(SOCKET_EVENTS.MEETING_PARTICIPANT_LEFT, {
            meetingId,
            memberId: session.memberId,
          });
        } catch (error) {
          console.error('[Socket] Error leaving meeting:', error);
        }
      }
    );

    /**
     * Disconnect Event
     */
    socket.on('disconnect', () => {
      const session = socketSessions.get(socket.id);
      if (!session) return;

      const { memberId, roomCode } = session;
      socketSessions.delete(socket.id);

      const sockets = memberSockets.get(memberId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          memberSockets.delete(memberId);
          socket.to(roomCode).emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
            memberId,
            isOnline: false,
          });

          // Clean up active meeting participant
          meetingRepository
            .getActiveMeeting(session.roomId)
            .then((activeMeeting) => {
              if (activeMeeting) {
                meetingRepository.leaveMeeting(activeMeeting.id, memberId).catch(() => {});
                socket.to(roomCode).emit(SOCKET_EVENTS.MEETING_PARTICIPANT_LEFT, {
                  meetingId: activeMeeting.id,
                  memberId,
                });
              }
            })
            .catch(() => {});
        }
      }
    });
  });

  return io;
}
