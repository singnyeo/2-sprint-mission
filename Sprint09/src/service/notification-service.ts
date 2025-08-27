import { NotificationRepository } from "../repository/notification-repository";

export class NotificationService {
  private repo = new NotificationRepository();

  async sendNotification({
    type,
    message,
    senderId,
    receiverId,
  }: {
    type: string;
    message: string;
    senderId?: number;
    receiverId: number;
  }) {
    return this.repo.createNotification({ type, message, senderId, receiverId });
  }

  async getUserNotifications(userId: number) {
    return this.repo.getUserNotifications(userId);
  }

  async readNotification(notificationId: number) {
    return this.repo.markAsRead(notificationId);
  }
}
