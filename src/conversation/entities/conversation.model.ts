import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { Message } from './message.model';

@Table
export class Conversation extends Model<Conversation> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @HasMany(() => Message)
  messages: Message[];

  @Column(DataType.VIRTUAL)
  get lastMessage() {
    const messages = this.getDataValue('messages') || [];
    return messages[messages.length - 1] || '';
  }
}
