import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  Sse,
  UnauthorizedException,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Admin } from 'src/common/decorators/Admin';
import { Response, Request } from 'express';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { Observable, interval, map } from 'rxjs';
import internal from 'stream';
import { Public } from 'src/common/decorators/Public';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Admin()
  @Get('')
  async getAll(@Res() res: Response) {
    const conversations = await this.conversationService.getAllConversations();
    if (conversations) {
      res.status(200).json({
        conversations,
      });
    } else {
      res.status(200).json([]);
    }
  }

  @Get(':userId')
  async getSingle(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req['user'];
    if (user.role !== 'admin' && userId !== user.sub) {
      throw UnauthorizedException;
    }
    const conversation = await this.conversationService.getConversation(userId);
    conversation.messages =
      conversation.messages?.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ) || [];
    res.status(200).json(conversation);
  }

  @Post('')
  async sendMessage(
    @Body() messageDto: CreateMessageDto,
    @Res() res: Response,
  ) {
    try {
      const message = await this.conversationService.createMessage(messageDto);
      if (message) {
        res.status(200).json(message);
      } else {
        res.status(400).json({
          error: 'Creation failed',
          message: 'Failed to create message',
        });
      }
    } catch (e) {
      throw e;
    }
  }

  @Post('read')
  async markRead(
    @Body() data: { conversationId: number },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const modifiedCount = await this.conversationService.readConversation(
        data.conversationId,
        req['user'].sub,
      );
      res.status(200).json({ modifiedCount });
    } catch (e) {
      throw e;
    }
  }

  @Admin()
  @Delete(':conversationId')
  async deleteConversation(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      await this.conversationService.deleteConversation(conversationId);
      res.status(200).json({ message: 'conversation deleted' });
    } catch (e) {
      throw e;
    }
  }
}
