import prisma from '../lib/prisma';

export class UserRepository {
  async findUserProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findUserById(userId: number) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  async updateUserProfile(userId: number, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findProductsByUserId(userId: number) {
    return prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}