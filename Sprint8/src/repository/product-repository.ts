import prisma from '../lib/prisma';
import { Product, Prisma } from '@prisma/client';

export class ProductRepository {
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        likes: true,
      },
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }
}