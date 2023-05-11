import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { usersProviders } from 'src/users/users';

@Module({
  providers: [NotificationService, UsersService, ...usersProviders],
  controllers: [NotificationController],
})
export class NotificationModule {}
