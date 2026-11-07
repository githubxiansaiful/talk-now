import { prisma } from '../../lib/prisma';
import { Message } from '@talknow/shared';

export class MessageRepository {
  async createMessage(data: {
    roomId: string;
    memberId: string;
    content: string;
  }): Promise<Message> {
    const message = await prisma.message.create({
      data: {
        roomId: data.roomId,
        memberId: data.memberId,
        content: data.content,
        messageType: 'TEXT',
      },
      include: {
        member: {
          select: { displayName: true },
        },
      },
    });

    return {
      id: message.id,
      roomId: message.roomId,
      memberId: message.memberId,
      senderName: message.member.displayName,
      content: message.content,
      messageType: 'TEXT',
      createdAt: message.createdAt.toISOString(),
      editedAt: message.editedAt?.toISOString() || null,
      deletedAt: message.deletedAt?.toISOString() || null,
    };
  }

  async getRecentMessages(roomId: string, limit = 100): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: {
        roomId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
      include: {
        member: {
          select: { displayName: true },
        },
      },
    });

    return messages.map((m) => ({
      id: m.id,
      roomId: m.roomId,
      memberId: m.memberId,
      senderName: m.member.displayName,
      content: m.content,
      messageType: m.messageType as 'TEXT' | 'SYSTEM',
      createdAt: m.createdAt.toISOString(),
      editedAt: m.editedAt?.toISOString() || null,
      deletedAt: m.deletedAt?.toISOString() || null,
    }));
  }
}

export const messageRepository = new MessageRepository();
