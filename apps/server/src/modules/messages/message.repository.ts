import { prisma } from '../../lib/prisma';
import { Message, MessageReactionSummary } from '@talknow/shared';

function formatReactions(reactions: Array<{ emoji: string; memberId: string }>): MessageReactionSummary[] {
  // Enforce that each member only has at most one reaction per message
  const seenMembers = new Set<string>();
  const sanitized: Array<{ emoji: string; memberId: string }> = [];

  for (let i = reactions.length - 1; i >= 0; i--) {
    const r = reactions[i];
    if (!seenMembers.has(r.memberId)) {
      seenMembers.add(r.memberId);
      sanitized.unshift(r);
    }
  }

  const map = new Map<string, string[]>();
  for (const r of sanitized) {
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
    await prisma.$transaction(async (tx) => {
      const existing = await tx.reaction.findMany({
        where: {
          messageId,
          memberId,
        },
      });

      const hasSameEmoji = existing.some((r) => r.emoji === emoji);

      // Always remove any existing reaction(s) for this member on this message
      // so a user can only ever have at most one reaction per message
      await tx.reaction.deleteMany({
        where: {
          messageId,
          memberId,
        },
      });

      // If user did not already react with this exact emoji, add the new reaction
      // (If they did, deleting toggles it off completely)
      if (!hasSameEmoji) {
        await tx.reaction.create({
          data: {
            messageId,
            memberId,
            emoji,
          },
        });
      }
    });

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
