import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Admin } from 'src/common/decorators/Admin';
import { Response, Request } from 'express';
import { CreateMessageDto } from './dto/CreateMessageDto';

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
}
