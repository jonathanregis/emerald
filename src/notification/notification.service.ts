import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Notification, NotificationType } from './entities/notification.model';

@Injectable()
export class NotificationService {
  constructor(private userService: UsersService) {}

  private async create(notification: NotificationType) {
    return Notification.create(notification);
  }

  async notifyAdmin({ message, title }): Promise<Notification> {
    try {
      const users = await this.userService.getAdmins();
      const ids = users.map((user) => user.id);
      return this.create({
        to: ids,
        title,
        message,
      });
    } catch (e) {
      throw e;
    }
  }

  async notify({ message, title, to }): Promise<Notification> {
    try {
      return this.create({
        to: [to],
        title,
        message,
      });
    } catch (e) {
      throw e;
    }
  }

  async getForUser(id: number): Promise<Notification[]> {
    try {
      return Notification.findAll({
        where: { to: [id] },
        attributes: {
          exclude: ['to'],
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
