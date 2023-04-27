import { Column, Default, HasMany, Model, Table } from 'sequelize-typescript';
import { Item } from './item.model';
import { User } from 'src/users/users.model';

@Table
export class Shipment extends Model<Shipment> {
  @Column
  container: string;

  @Column
  seal: string;

  @Column
  containerType: string;

  @Column
  departureCity: string;

  @Column
  departureCountry: string;

  @Column
  departureDate: Date;

  @Column
  arrivalCity: string;

  @Column
  arrivalCountry: string;

  @Column
  arrivalDate: Date;

  @Default(0)
  @Column
  status: number;

  @HasMany(() => Item)
  items: Item[];
}
