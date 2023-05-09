import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Table,
  Model,
  HasMany,
} from 'sequelize-typescript';
import { Item } from 'src/shipment/item.model';
import { Shipment } from 'src/shipment/shipment.model';
import { User } from 'src/users/users.model';

@Table
export class Invoice extends Model<Invoice> {
  @Column
  amount: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Shipment)
  @Column
  shipmentId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Shipment, 'shipmentId')
  shipment: Shipment;

  @HasMany(() => Item, 'invoiceId')
  items: Item[];

  @Column
  dueDate: Date;

  @Default(0)
  @Column
  amountPaid: number;

  @Default(null)
  @Column
  paid: Date;

  @Default(0)
  @Column
  tax: number;

  @Column(DataType.VIRTUAL)
  get balance() {
    return this.total - this.amountPaid;
  }

  @Column(DataType.VIRTUAL)
  get total() {
    return this.amount + (this.tax / 100) * this.amount;
  }
}
