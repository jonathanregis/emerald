import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.model';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { Message } from './entities/message.model';
import { Op } from 'sequelize';

@Injectable()
export class ConversationService {
  async createConversation(userId: number) {
    return await Conversation.create({
      userId,
    });
  }

  async getConversation(userId) {
    const conversation = await Conversation.findOrCreate({
      where: { userId },
      include: ['messages'],
    });
    return conversation[0];
  }

  async getAllConversations() {
    const conversations = await Conversation.findAll({
      include: ['messages', 'user'],
    });
    const json = conversations.map((c) => {
      const n = c.toJSON();
      delete n.messages;
      return n;
    });
    return json;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    return await Message.create({
      sender: createMessageDto.sender,
      content: createMessageDto.content,
      conversationId: createMessageDto.conversationId,
    });
  }

  async readConversation(id: number, userId: number) {
    const messagesChanged = await Message.update(
      { read: 1 },
      { where: { conversationId: id, read: 0, sender: { [Op.not]: userId } } },
    );
    return messagesChanged[0];
  }
}
