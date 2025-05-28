var express = require("express");
const { assert } = require("superstruct");
const { db } = require("../utils/db");
const { CreateDto } = require("../dtos/article.dto");

var router = express.Router();

// 게시글 등록
router.post("/create", async (req, res) => {
  try {
    assert(req.body, CreateDto);
    const { title, content } = req.body;

    const article = await db.article.create({
      data: { title, content },
    });

    res.status(201).json({ id: article.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 게시글 상세 조회
router.get("/article", async (req, res) => {
  try {
    const article = await db.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: "서버 에러 발생" });
  }
});

// 게시글 수정
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const article = await db.article.update({
      where: { id },
      data: { title, content },
    });

    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: "수정 실패" });
  }
});

// 게시글 삭제
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.article.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "삭제 실패" });
  }
});

// 게시글 목록 조회
router.get("/list", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";
    const sort = req.query.sort || "recent";

    const article = await db.article.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: "서버 에러 발생" });
  }
});

module.exports = router;
