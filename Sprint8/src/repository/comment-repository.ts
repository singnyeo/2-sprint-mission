import prisma from "../lib/prisma";

export class CommentRepository {
  async createComment(data: { userId: number; articleId: number; content: string }) {
    return prisma.comment.create({ data });
  }

  async getCommentsByArticle(articleId: number) {
    return prisma.comment.findMany({
      where: { articleId },
      include: { user: { select: { id: true, nickname: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateComment(commentId: number, content: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  async deleteComment(commentId: number) {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async findById(commentId: number) {
    return prisma.comment.findUnique({ where: { id: commentId } });
  }
}
