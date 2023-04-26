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
} from 'sequelize-typescript';
import { hash } from 'bcrypt';

@Scopes({
  withPass: {
    attributes: {
      include: ['password'],
    },
  },
})
@DefaultScope({
  attributes: { exclude: ['password'] },
  where: { active: true },
})
@Table
export class User extends Model<User> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  phoneNumber: string;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Default('customer')
  @Column
  role: 'customer' | 'admin';

  @Default(true)
  @Column
  active: boolean;

  @BeforeCreate
  static async hashPassword(user: User) {
    user.password = await hash(user.password, 10);
    return user;
  }
}
