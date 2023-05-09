import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  NotNull,
  Table,
} from 'sequelize-typescript';
import { Shipment } from './shipment.model';
import { User } from 'src/users/users.model';
import { Invoice } from 'src/invoice/entities/invoice.model';

@Table
export class Item extends Model<Item> {
  @Column
  description: string;

  @Column
  quantity: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Shipment)
  @Column
  shipmentId: number;

  @ForeignKey(() => Invoice)
  @AllowNull
  @Column
  invoiceId: number;

  @BelongsTo(() => Shipment, 'shipmentId')
  shipment: Shipment;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Invoice, 'invoiceId')
  invoice: Invoice;

  @AllowNull
  @Column
  bal: number;

  @AllowNull
  @Column
  cbm: number;

  @Default(270000)
  @Column
  unitPrice: number;
}
