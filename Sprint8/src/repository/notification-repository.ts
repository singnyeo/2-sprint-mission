import prisma from "../lib/prisma";

export class NotificationRepository {
  async createNotification(data: {
    type: string;
    message: string;
    senderId?: number;
    receiverId: number;
  }) {
    return prisma.notification.create({ data });
  }

  async getUserNotifications(userId: number) {
    return prisma.notification.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async markAsRead(notificationId: number) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}
