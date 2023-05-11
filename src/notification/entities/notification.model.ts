import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Notification extends Model<Notification> {
  @Column
  message: string;

  @Column
  title: string;

  @Column({
    type: DataType.STRING,
    get(): number[] {
      return this.getDataValue('to').split(',');
    },
    set(val: number[]) {
      this.setDataValue('to', val.join(','));
    },
  })
  to: number[];

  @Column({
    type: DataType.STRING,
    get(): number[] {
      return (
        this.getDataValue('readBy')
          ?.split(',')
          ?.map((s) => parseInt(s)) || []
      );
    },
    set(val: number[]) {
      this.setDataValue('readBy', val.join(','));
    },
  })
  readBy: number[];

  @Column(DataType.VIRTUAL)
  status: number;
}

export type NotificationType = {
  message: string;
  title: string;
  to: number[];
  readBy?: number[];
};
