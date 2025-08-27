import prisma from '../lib/prisma';

export class AuthRepository {
  async findUserByEmailOrNickname(email: string, nickname: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });
  }

  async createUser(data: { email: string; nickname: string; password: string; image: string }) {
    return prisma.user.create({ data });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserById(userId: number) {
    return prisma.user.findUnique({ where: { id: userId } });
  }
}