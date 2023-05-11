import { Controller, Get, Req, Res } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Request, Response } from 'express';
import { AuthUserType } from 'src/auth/auth.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('/')
  async getUserNotifications(@Req() req: Request, @Res() res: Response) {
    try {
      const user: AuthUserType = req['user'];
      const _notifications = await this.notificationService.getForUser(
        user.sub,
      );
      const notifications = _notifications.map((notification) => {
        if (notification.readBy.includes(user.sub)) {
          notification.setDataValue('status', 1);
        } else {
          notification.setDataValue('status', 0);
        }
        const json = notification.toJSON();
        delete json.readBy;
        return json;
      });
      res.status(200).json({
        notifications,
      });
    } catch (e) {
      throw e;
    }
  }
}
