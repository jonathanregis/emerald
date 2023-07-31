import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Notification, NotificationType } from './entities/notification.model';
import { OneSignalService } from 'onesignal-api-client-nest';

const templates = { newInvoice: '6adaa5dd-a999-490e-a6a6-0a82b7af9fdb' };

@Injectable()
export class NotificationService {
  constructor(
    private userService: UsersService,
    private readonly onesignalService: OneSignalService,
  ) {}
  private async create(
    notification: NotificationType & {
      messageFR?: string;
      titleFR?: string;
      template?: keyof typeof templates;
      templateData?: any;
    },
    push = true,
  ) {
    if (push) {
      this.onesignalService.createNotification({
        include_external_user_ids: notification.to?.map((id) => id?.toString()),
        template_id: templates[notification.template],
        contents: {
          en: notification.message,
          fr: notification.messageFR,
        },
        headings: {
          en: notification.title,
          fr: notification.titleFR,
        },
        data: notification.templateData,
      });
    }

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

  async notify({
    message,
    title,
    to,
  }: NotificationType & {
    messageFR?: string;
    titleFR?: string;
    template?: keyof typeof templates;
    templateData?: any;
  }): Promise<Notification> {
    try {
      return this.create({
        to: [to].flat(),
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
