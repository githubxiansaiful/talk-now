import { prisma } from '../../lib/prisma';
import { Message, MessageReactionSummary } from '@talknow/shared';

function formatReactions(reactions: Array<{ emoji: string; memberId: string }>): MessageReactionSummary[] {
  const map = new Map<string, string[]>();
  for (const r of reactions) {
    const list = map.get(r.emoji) || [];
    list.push(r.memberId);
    map.set(r.emoji, list);
  }
  return Array.from(map.entries()).map(([emoji, memberIds]) => ({
    emoji,
    count: memberIds.length,
    memberIds,
  }));
}

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
          select: { displayName: true, isCreator: true },
        },
        reactions: {
          select: { emoji: true, memberId: true },
        },
      },
    });

    return {
      id: message.id,
      roomId: message.roomId,
      memberId: message.memberId,
      senderName: message.member.displayName,
      senderIsCreator: message.member.isCreator,
      content: message.content,
      messageType: 'TEXT',
      createdAt: message.createdAt.toISOString(),
      editedAt: message.editedAt?.toISOString() || null,
      deletedAt: message.deletedAt?.toISOString() || null,
      reactions: formatReactions(message.reactions || []),
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
          select: { displayName: true, isCreator: true },
        },
        reactions: {
          select: { emoji: true, memberId: true },
        },
      },
    });

    return messages.map((m) => ({
      id: m.id,
      roomId: m.roomId,
      memberId: m.memberId,
      senderName: m.member.displayName,
      senderIsCreator: m.member.isCreator,
      content: m.content,
      messageType: m.messageType as 'TEXT' | 'SYSTEM',
      createdAt: m.createdAt.toISOString(),
      editedAt: m.editedAt?.toISOString() || null,
      deletedAt: m.deletedAt?.toISOString() || null,
      reactions: formatReactions(m.reactions || []),
    }));
  }

  async toggleReaction(
    messageId: string,
    memberId: string,
    emoji: string
  ): Promise<MessageReactionSummary[]> {
    const existing = await prisma.reaction.findUnique({
      where: {
        messageId_memberId_emoji: {
          messageId,
          memberId,
          emoji,
        },
      },
    });

    if (existing) {
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.reaction.create({
        data: {
          messageId,
          memberId,
          emoji,
        },
      });
    }

    return this.getMessageReactions(messageId);
  }

  async getMessageReactions(messageId: string): Promise<MessageReactionSummary[]> {
    const reactions = await prisma.reaction.findMany({
      where: { messageId },
      select: { emoji: true, memberId: true },
    });

    return formatReactions(reactions);
  }
}

export const messageRepository = new MessageRepository();
