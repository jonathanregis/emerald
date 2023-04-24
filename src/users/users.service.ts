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
}
