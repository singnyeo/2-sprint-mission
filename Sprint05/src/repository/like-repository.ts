import prisma from '../lib/prisma';

export class LikeRepository {
  async findProductLike(userId: number, productId: number) {
    return prisma.like.findUnique({
      where: {
        user_product_unique: { userId, productId },
      },
    });
  }

  async findArticleLike(userId: number, articleId: number) {
    return prisma.like.findUnique({
      where: {
        user_article_unique: { userId, articleId },
      },
    });
  }

  async createProductLike(userId: number, productId: number) {
    return prisma.like.create({
      data: { userId, productId },
    });
  }

  async createArticleLike(userId: number, articleId: number) {
    return prisma.like.create({
      data: { userId, articleId },
    });
  }

  async deleteLike(id: number) {
    return prisma.like.delete({
      where: { id },
    });
  }

  async findLikedProducts(userId: number) {
    return prisma.like.findMany({
      where: { userId, productId: { not: null } },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findLikedArticles(userId: number) {
    return prisma.like.findMany({
      where: { userId, articleId: { not: null } },
      include: { article: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}