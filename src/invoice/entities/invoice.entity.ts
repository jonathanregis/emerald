import { VIRTUAL } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';

@Table
export class Invoice {
  @Column
  amount: number;

  @ForeignKey(() => User)
  @Column
  clientId: string;

  @BelongsTo(() => User, 'id')
  client: User;

  @Column
  dueDate: Date;

  @Column
  amountPaid: number;

  @Column
  @Default(null)
  paid: Date;

  @Column
  @Default(0)
  tax: number;

  @Column(DataType.VIRTUAL)
  get balance() {
    return this.amount - this.amountPaid;
  }
}
