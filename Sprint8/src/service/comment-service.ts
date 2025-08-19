// src/services/comment-service.ts
import prisma from "../lib/prisma";
import { CommentRepository } from "../repository/comment-repository";
import { NotificationService } from "./notification-service";
import { Server } from "socket.io";

const commentRepo = new CommentRepository();
const notificationService = new NotificationService();

export class CommentService {
  async createComment(
    userId: number,
    articleId: number,
    content: string,
    io?: Server
  ) {
    const comment = await commentRepo.createComment({ userId, articleId, content });

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (article.userId !== userId && io) {
      const notification = await notificationService.sendNotification({
        type: "NEW_COMMENT",
        message: "게시글에 새 댓글이 달렸습니다.",
        receiverId: article.userId,
        senderId: userId,
      });

      io.to(`user_${article.userId}`).emit("newNotification", notification);
    }

    return comment;
  }

  async getComments(articleId: number) {
    return commentRepo.getCommentsByArticle(articleId);
  }

  async updateComment(userId: number, commentId: number, content: string) {
    const comment = await commentRepo.findById(commentId);
    if (!comment) throw new Error("댓글을 찾을 수 없습니다.");
    if (comment.userId !== userId) throw new Error("댓글 수정 권한이 없습니다.");

    return commentRepo.updateComment(commentId, content);
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await commentRepo.findById(commentId);
    if (!comment) throw new Error("댓글을 찾을 수 없습니다.");
    if (comment.userId !== userId) throw new Error("댓글 삭제 권한이 없습니다.");

    return commentRepo.deleteComment(commentId);
  }
}
