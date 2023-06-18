import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Conversation } from './conversation.model';

@Table
export class Message extends Model<Message> {
  @Column
  sender: number;

  @Column(DataType.TEXT)
  content: string;

  @ForeignKey(() => Conversation)
  @Column
  conversationId: number;

  @BelongsTo(() => Conversation, 'conversationId')
  conversation: Conversation;

  @Default(0)
  @Column
  read: 1 | 0;
}
