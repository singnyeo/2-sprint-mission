import { Request, Response } from "express";
import { NotificationService } from "../service/notification-service";

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: Request, res: Response) {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);
    res.json(notifications);
  }

  async markAsRead(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await notificationService.readNotification(Number(id));
    res.json(updated);
  }
}
