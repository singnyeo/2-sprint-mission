import prisma from "../lib/prisma";
import { Server } from "socket.io";
import { NotificationService } from "./notification-service";

interface ProductData {
  name: string;
  description: string;
  price: number;
  tags?: string[];
}

const notificationService = new NotificationService();

export class ProductService {
  async createProduct(userId: number, data: ProductData) {
    return prisma.product.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        likes: true,
      },
    });
  }
  async updateProduct(
    userId: number,
    productId: number,
    data: Partial<ProductData>,
    io?: Server
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { likes: true },
    });

    if (!product) throw new Error("상품을 찾을 수 없습니다.");
    if (product.userId !== userId) throw new Error("상품 수정 권한이 없습니다.");

    // 가격 변동 시 좋아요한 유저들에게 알림 전송
    if (data.price && data.price !== product.price && io) {
      for (const like of product.likes) {
        const notification = await notificationService.sendNotification({
          type: "PRICE_CHANGE",
          message: `${product.name} 가격이 변경되었습니다!`,
          receiverId: like.userId,
        });
        io.to(`user_${like.userId}`).emit("newNotification", notification);
      }
    }

    return prisma.product.update({ where: { id: productId }, data });
  }

  async deleteProduct(userId: number, productId: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) throw new Error("상품을 찾을 수 없습니다.");
    if (product.userId !== userId) throw new Error("상품 삭제 권한이 없습니다.");

    await prisma.product.delete({ where: { id: productId } });
  }

  async getProductById(productId: number, userId?: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        likes: true,
      },
    });

    if (!product) throw new Error("상품을 찾을 수 없습니다.");

    const isLiked = userId ? product.likes.some((like) => like.userId === userId) : false;
    const { likes, ...productWithoutLikes } = product;

    return { ...productWithoutLikes, isLiked };
  }
}
