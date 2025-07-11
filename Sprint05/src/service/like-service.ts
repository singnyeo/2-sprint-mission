import { LikeRepository } from '../repository/like-repository';

export class LikeService {
  constructor(private likeRepo = new LikeRepository()) {}

  async toggleProductLike(userId: number, productId: number) {
    const existingLike = await this.likeRepo.findProductLike(userId, productId);
    if (existingLike) {
      await this.likeRepo.deleteLike(existingLike.id);
      return '상품 좋아요 취소';
    } else {
      await this.likeRepo.createProductLike(userId, productId);
      return '상품 좋아요';
    }
  }

  async toggleArticleLike(userId: number, articleId: number) {
    const existingLike = await this.likeRepo.findArticleLike(userId, articleId);
    if (existingLike) {
      await this.likeRepo.deleteLike(existingLike.id);
      return '게시글 좋아요 취소';
    } else {
      await this.likeRepo.createArticleLike(userId, articleId);
      return '게시글 좋아요';
    }
  }

  async getLikedProducts(userId: number) {
    const liked = await this.likeRepo.findLikedProducts(userId);
    return liked.map(like => like.product).filter(Boolean);
  }

  async getLikedArticles(userId: number) {
    const liked = await this.likeRepo.findLikedArticles(userId);
    return liked.map(like => like.article).filter(Boolean);
  }
}