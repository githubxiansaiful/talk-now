import { messageRepository } from './message.repository';
import { sendMessageSchema, Message } from '@talknow/shared';

export class MessageService {
  async sendMessage(data: {
    roomId: string;
    memberId: string;
    content: string;
  }): Promise<Message> {
    const validated = sendMessageSchema.parse({
      roomId: data.roomId,
      content: data.content,
    });

    return messageRepository.createMessage({
      roomId: validated.roomId,
      memberId: data.memberId,
      content: validated.content,
    });
  }

  async getRecentMessages(roomId: string, limit = 100): Promise<Message[]> {
    return messageRepository.getRecentMessages(roomId, limit);
  }

  async toggleReaction(data: {
    messageId: string;
    memberId: string;
    emoji: string;
  }) {
    if (!data.messageId || !data.memberId || !data.emoji) {
      throw new Error('Missing reaction data');
    }
    return messageRepository.toggleReaction(data.messageId, data.memberId, data.emoji);
  }
}

export const messageService = new MessageService();
