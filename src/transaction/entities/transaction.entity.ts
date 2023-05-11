import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';

@Table
export class Transaction extends Model<Transaction> {
  @Column
  type: string;

  @Column
  amount: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @Column
  reference: string;

  @Column
  service: string;

  @Column
  invoiceId: number;
}
