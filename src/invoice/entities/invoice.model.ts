import { ApplicationConfig } from '@nestjs/core';
import { hashSync } from 'bcrypt';
import { VIRTUAL } from 'sequelize';
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
import { server } from 'src/main';
import { Item } from 'src/shipment/item.model';
import { Shipment } from 'src/shipment/shipment.model';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/users.model';

@Table({
  paranoid: true,
})
export class Invoice extends Model<Invoice> {
  @Column
  amount: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column(DataType.VIRTUAL)
  get downloadUrl() {
    const port = String(process.env.PORT || process.env.APP_PORT);
    const appUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://prod.eba-uuimfeiu.us-east-1.elasticbeanstalk.com'
        : 'http://localhost:' + port;
    const key = hashSync(this.number, 10);
    const url =
      appUrl + '/invoice/download/' + this.getDataValue('id') + '?key=' + key;
    return url;
  }

  @ForeignKey(() => Shipment)
  @Column
  shipmentId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Shipment, 'shipmentId')
  shipment: Shipment;

  @HasMany(() => Item, 'invoiceId')
  items: Item[];

  @HasMany(() => Transaction, 'invoiceId')
  transactions: Transaction[];

  @Column
  dueDate: Date;

  @Column(DataType.VIRTUAL)
  get amountPaid() {
    const amounts = this.getDataValue('transactions')?.map((t) => {
      return t.amount;
    });
    if (amounts) {
      return amounts.reduce((prev, curr) => prev + curr, 0);
    }
    return 0;
  }

  @Default(null)
  @Column
  paid: Date;

  @Default(0)
  @Column
  tax: number;

  @Column(DataType.VIRTUAL)
  get number() {
    const date = new Date(this.getDataValue('createdAt'));
    const part1 = date.getFullYear().toString().substr(2, 2);
    const part2 = (date.getMonth() + 1).toString().padStart(2, '0');
    return part1 + this.getDataValue('id').toString().padStart(2, '0') + part2;
  }

  @Column(DataType.VIRTUAL)
  get balance() {
    return this.total - this.amountPaid;
  }

  @Column(DataType.VIRTUAL)
  get total() {
    return this.amount + (this.tax / 100) * this.amount;
  }
}
