import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Events } from './events';
import { ConversationService } from 'src/conversation/conversation.service';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';
import { NotificationModule } from 'src/notification/notification.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  providers: [EventsGateway, Events],
  imports: [NotificationModule, ConversationModule],
})
export class EventsModule {}
