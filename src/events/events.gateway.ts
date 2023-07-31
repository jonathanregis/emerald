import { Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from 'src/conversation/conversation.service';
import { CreateMessageDto } from 'src/conversation/dto/CreateMessageDto';
import { Message } from 'src/conversation/entities/message.model';
import { NotificationService } from 'src/notification/notification.service';

@WebSocketGateway()
@Injectable()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private conversationService: ConversationService,
    private notificationService: NotificationService,
  ) {
    this.rooms = [];
  }
  @WebSocketServer()
  server: Server;

  private rooms: Room[];

  handleConnection(client: Socket, ...args: any[]): any {
    console.log('Connection detected');
  }

  handleDisconnect(client: any): any {
    console.log('Disconnection detected');
    this.rooms.forEach((room) => {
      room.leave(client);
    });
  }

  afterInit(server: any): any {
    console.log('Gateway successfully initiated');
  }

  createOrGetRoom(name: string) {
    const roomIndex = this.rooms.findIndex((x) => x.name === name);
    let room = this.rooms[roomIndex];
    if (!room) {
      const newRoom = new Room(name);
      const newIndex = this.rooms.push(newRoom) - 1;
      room = this.rooms[newIndex];
    }
    return room;
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.createOrGetRoom(data).join(client);
  }

  @SubscribeMessage('new_message')
  async handleEvent(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<Message> {
    const message = await this.conversationService.createMessage(data);
    const convo = await this.conversationService.getConversation(
      data.conversationId,
    );
    if (message) {
      const room = this.createOrGetRoom(data.conversationId.toString());
      if (
        room.clients.size <= 0 ||
        (room.hasClient(client) && room.clients.size === 1)
      ) {
        this.notificationService.notify({
          title: 'Support team',
          message: message.content,
          to: [convo?.userId],
        });
      }
      room.join(client).emit({
        eventData: message,
        type: 'new_message',
      });
    }
    return null;
  }

  @SubscribeMessage('read_conversation')
  async handleRead(
    @MessageBody() data: { userId: number; conversationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const count = await this.conversationService.readConversation(
      data.conversationId,
      data.userId,
    );
    if (count > 0) {
      this.createOrGetRoom(data.conversationId.toString())
        .join(client)
        .emit({
          type: 'read_conversation',
          eventData: { by: data.userId, count },
        });
    }
  }
}

class Room {
  constructor(public name: string) {
    this.clients = new Set<Socket>([]);
  }
  public clients: Set<Socket>;

  emit(data: any) {
    this.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
    return this;
  }

  join(client: Socket) {
    this.clients.add(client);
    return this;
  }

  hasClient(client: Socket) {
    return this.clients.has(client);
  }

  leave(client: Socket) {
    this.clients.delete(client);
  }
}
