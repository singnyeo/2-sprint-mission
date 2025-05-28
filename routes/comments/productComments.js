const express = require("express");
const { db } = require("../../utils/db");

var router = express.Router({ mergeParams: true });

// 댓글 등록
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;
    const productId = parseInt(req.params.productId);

    const comment = await db.comment.create({
      data: { content, productId },
    });

    res.status(201).json({ id: comment.id });
  } catch (error) {
    res.status(400).json({ error: "댓글 등록 실패" });
  }
});

// 댓글 수정
router.patch("/:commentId", async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "수정 할 댓글이 존재하지 않음" });
    }

    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ error: "댓글 수정 실패" });
  }
});

// 댓글 삭제
router.delete("/:commentId", async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);

    await db.comment.delete({
      where: { id: commentId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "댓글 삭제 실패" });
  }
});

// 댓글 목록 조회
router.get("/list", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const cursorId = req.query.cursor ? parseInt(req.query.cursor) : undefined;
    const take = parseInt(req.query.take) || 10;

    const comments = await db.comment.findMany({
      where: { productId },
      take: take + 1,
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
      orderBy: { id: "asc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    let nextCursor = null;
    if (comments.length > take) {
      const nextItem = comments.pop();
      nextCursor = nextItem.id;
    }

    res.status(200).json({ comments, nextCursor });
  } catch (error) {
    res.status(500).json({ error: "댓글 목록 조회 실패" });
  }
});

module.exports = router;
