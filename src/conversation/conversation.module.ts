import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { EventsModule } from 'src/events/events.module';
import { EventsGateway } from 'src/events/events.gateway';
import { Events } from 'src/events/events';

@Module({
  providers: [ConversationService],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}
