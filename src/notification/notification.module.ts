import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { usersProviders } from 'src/users/users';
import { TransactionService } from 'src/transaction/transaction.service';
import { OneSignalModule, OneSignalService } from 'onesignal-api-client-nest';
import { TransactionModule } from 'src/transaction/transaction.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [
    UsersModule,
    TransactionModule,
    ConversationModule,
    OneSignalModule.forRoot({
      appId:
        process.env.ONESIGNAL_APP_ID || 'f9fd4c4a-0394-4e70-aefb-af586421ebf0',
      restApiKey:
        process.env.ONESIGNAL_API_KEY ||
        'MDdjOTE1MjUtMDFhYy00MTVkLWI5ZTMtZGQ3N2YwMWVlY2U1',
    }),
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
