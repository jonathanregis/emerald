import {
  Table,
  Column,
  Model,
  Unique,
  BeforeUpsert,
  BeforeCreate,
} from 'sequelize-typescript';
import { hash } from 'bcrypt';

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

  @BeforeCreate
  static async hashPassword(user: User) {
    user.password = await hash(user.password, 10);
    return user;
  }
}
