import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users';
import { DatabaseModule } from 'src/database/database.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
