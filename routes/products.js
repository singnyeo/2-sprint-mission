var express = require("express");
const { assert } = require("superstruct");
const { db } = require("../utils/db");
const { CreateDto } = require("../dtos/product.dto");

var router = express.Router();

// 상품 등록
router.post("/create", async (req, res) => {
  try {
    assert(req.body, CreateDto);
    const { name, description, price, tags } = req.body;

    const product = await db.product.create({
      data: { name, description, price, tags },
    });

    res.status(201).json({ id: product.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 상세 조회
router.get("/product", async (req, res) => {
  try {
    const products = await db.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "서버 에러 발생" });
  }
});

// 상품 수정
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, tags } = req.body;

    const product = await db.product.update({
      where: { id },
      data: { name, description, price, tags },
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: "수정 실패" });
  }
});

// 상품 삭제
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "삭제 실패" });
  }
});

// 상품 목록 조회
router.get("/list", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";
    const sort = req.query.sort || "recent";

    const products = await db.product.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      },
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "서버 에러 발생" });
  }
});

module.exports = router;
