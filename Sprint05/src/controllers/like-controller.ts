import { Request, Response } from 'express';
import { LikeService } from '../service/like-service';

const likeService = new LikeService();

export async function toggleProductLike(req: Request, res: Response) {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.user.id;

    const message = await likeService.toggleProductLike(userId, productId);
    res.status(message.includes('취소') ? 200 : 201).json({ message });
  } catch (error: any) {
    console.error('상품 좋아요 토글 실패:', error);
    res.status(500).json({ message: error.message || '서버 에러' });
  }
}

export async function toggleArticleLike(req: Request, res: Response) {
  try {
    const articleId = parseInt(req.params.id);
    const userId = req.user.id;

    const message = await likeService.toggleArticleLike(userId, articleId);
    res.status(message.includes('취소') ? 200 : 201).json({ message });
  } catch (error: any) {
    console.error('게시글 좋아요 토글 실패:', error);
    res.status(500).json({ message: error.message || '서버 에러' });
  }
}

export async function getLikedProducts(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const products = await likeService.getLikedProducts(userId);
    res.status(200).json(products);
  } catch (error: any) {
    console.error('좋아요 누른 상품 목록 조회 실패:', error);
    res.status(500).json({ message: error.message || '서버 에러' });
  }
}

export async function getLikedArticles(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const articles = await likeService.getLikedArticles(userId);
    res.status(200).json(articles);
  } catch (error: any) {
    console.error('좋아요 누른 게시글 목록 조회 실패:', error);
    res.status(500).json({ message: error.message || '서버 에러' });
  }
}