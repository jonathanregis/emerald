import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Events } from './events';
import { ConversationService } from 'src/conversation/conversation.service';

@Module({
  providers: [EventsGateway, Events, ConversationService],
})
export class EventsModule {}
