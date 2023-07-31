import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users';
import { DatabaseModule } from 'src/database/database.module';
import { AuthService } from 'src/auth/auth.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, TransactionModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
