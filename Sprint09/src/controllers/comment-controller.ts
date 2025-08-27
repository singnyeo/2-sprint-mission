// src/controllers/comment-controller.ts
import { Request, Response } from "express";
import { CommentService } from "../service/comment-service";

const commentService = new CommentService();

export class CommentController {
  async createComment(req: Request, res: Response) {
    const userId = req.user.id;
    const { articleId, content } = req.body;
    const io = req.app.get("io"); // Express app에 Socket.IO 서버 저장 가정

    const comment = await commentService.createComment(userId, articleId, content, io);
    res.status(201).json(comment);
  }

  async getComments(req: Request, res: Response) {
    const articleId = parseInt(req.params.articleId);
    const comments = await commentService.getComments(articleId);
    res.json(comments);
  }

  async updateComment(req: Request, res: Response) {
    const userId = req.user.id;
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;

    const updated = await commentService.updateComment(userId, commentId, content);
    res.json(updated);
  }

  async deleteComment(req: Request, res: Response) {
    const userId = req.user.id;
    const commentId = parseInt(req.params.commentId);

    await commentService.deleteComment(userId, commentId);
    res.json({ message: "댓글 삭제 완료" });
  }
}
