import prisma from '../lib/prisma';
import { Prisma, Article } from '@prisma/client';

export class ArticleRepository {
  async create(data: Prisma.ArticleCreateInput): Promise<Article> {
    return prisma.article.create({ data });
  }

  async findById(id: number) {
    return prisma.article.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        likes: true,
        comment: true,
        product: { select: { id: true, name: true } },
      },
    });
  }

  async findAll() {
    return prisma.article.findMany({
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, data: Prisma.ArticleUpdateInput) {
    return prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.article.delete({
      where: { id },
    });
  }
}