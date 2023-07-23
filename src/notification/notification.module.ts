import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { usersProviders } from 'src/users/users';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  providers: [
    NotificationService,
    UsersService,
    ...usersProviders,
    TransactionService,
  ],
  controllers: [NotificationController],
  imports: [UsersModule],
})
export class NotificationModule {}
