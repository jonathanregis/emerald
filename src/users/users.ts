import { User } from './users.model';

export const usersProviders = [
  {
    provide: 'USER_REPO',
    useValue: User,
  },
];
