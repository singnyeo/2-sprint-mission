import prisma from '../lib/prisma.js';

export async function toggleProductLike(req, res) {
  const productId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        user_product_unique: { userId, productId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return res.status(200).json({ message: '상품 좋아요 취소' });
    } else {
      await prisma.like.create({
        data: { userId, productId },
      });
      return res.status(201).json({ message: '상품 좋아요' });
    }
  } catch (error) {
    console.error('상품 좋아요 토글 실패:', error);
    res.status(500).json({ message: '서버 에러' });
  }
}

export async function toggleArticleLike(req, res) {
  const articleId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        user_article_unique: { userId, articleId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return res.status(200).json({ message: '게시글 좋아요 취소' });
    } else {
      await prisma.like.create({
        data: { userId, articleId },
      });
      return res.status(201).json({ message: '게시글 좋아요' });
    }
  } catch (error) {
    console.error('게시글 좋아요 토글 실패:', error);
    res.status(500).json({ message: '서버 에러' });
  }
}

export async function getLikedProducts(req, res) {
  const userId = req.user.id;

  try {
    const likedProducts = await prisma.like.findMany({
      where: { userId, productId: { not: null } },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const products = likedProducts.map(like => like.product).filter(Boolean);
    res.status(200).json(products);
  } catch (error) {
    console.error('좋아요 누른 상품 목록 조회 실패:', error);
    res.status(500).json({ message: '서버 에러' });
  }
}

export async function getLikedArticles(req, res) {
  const userId = req.user.id;

  try {
    const likedArticles = await prisma.like.findMany({
      where: { userId, articleId: { not: null } },
      include: { article: true },
      orderBy: { createdAt: 'desc' },
    });

    const articles = likedArticles.map(like => like.article).filter(Boolean);
    res.status(200).json(articles);
  } catch (error) {
    console.error('좋아요 누른 게시글 목록 조회 실패:', error);
    res.status(500).json({ message: '서버 에러' });
  }
}