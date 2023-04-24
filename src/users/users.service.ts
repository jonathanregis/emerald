import { Injectable, Inject } from '@nestjs/common';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPO')
    private usersRepo: typeof User,
  ) {}
  async findAll(): Promise<User[] | undefined> {
    return this.usersRepo.findAll<User>();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepo
      .scope('withPass')
      .findAll({ where: { email }, limit: 1 });
    if (user.length) {
      return user[0];
    } else {
      return null;
    }
  }
}
