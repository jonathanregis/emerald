import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Shipment } from './shipment.model';
import { User } from 'src/users/users.model';

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

  @BelongsTo(() => Shipment)
  shipment: Shipment;

  @BelongsTo(() => User)
  user: User;
}
