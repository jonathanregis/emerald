import {
  Table,
  Column,
  Model,
  Unique,
  BeforeUpsert,
  BeforeCreate,
  Default,
  DefaultScope,
  Scopes,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { hash } from 'bcrypt';
import { Item } from 'src/shipment/item.model';
import { Invoice } from 'src/invoice/entities/invoice.model';
import { Shipment } from 'src/shipment/shipment.model';
import { Op } from 'sequelize';

@Scopes({
  withPass: {
    attributes: {
      include: ['password'],
    },
  },
  admin: {
    attributes: {
      exclude: ['password'],
    },
    where: {
      role: 'admin',
    },
  },
  allRoles: {
    where: {
      role: { [Op.or]: ['customer', 'admin'] },
    },
  },
})
@DefaultScope({
  attributes: { exclude: ['password'] },
  where: { active: true, role: 'customer' },
})
@Table
export class User extends Model<User> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  phoneNumber: string;

  @Column({ unique: 'email' })
  email: string;

  @Column
  password: string;

  @Default('customer')
  @Column
  role: 'customer' | 'admin';

  @Default(true)
  @Column
  active: boolean;

  @HasMany(() => Item)
  items: Item[];

  @HasMany(() => Invoice)
  invoices: Invoice[];

  @BeforeCreate
  static async hashPassword(user: User) {
    user.password = await hash(user.password, 10);
    return user;
  }
}
