import { ArticleRepository } from '../repository/article-repository';

export class ArticleService {
  constructor(private articleRepo = new ArticleRepository()) {}

  async createArticle(userId: number, data: { title: string; content: string; productId?: number }) {
    return this.articleRepo.create({
    title: data.title,
    content: data.content,
    user: { connect: { id: userId } },
    ...(data.productId && {
      product: { connect: { id: data.productId } },
    }),
  });
  }

  async getArticleById(articleId: number, userId?: number) {
    const article = await this.articleRepo.findById(articleId);
    if (!article) throw new Error('게시글을 찾을 수 없습니다.');

    const isLiked = userId ? article.likes.some(like => like.userId === userId) : false;
    const { likes, ...articleWithoutLikes } = article;
    return { ...articleWithoutLikes, isLiked };
  }

  async getArticles() {
    return this.articleRepo.findAll();
  }

  async updateArticle(userId: number, articleId: number, data: { title: string; content: string }) {
    const article = await this.articleRepo.findById(articleId);
    if (!article) throw new Error('게시글을 찾을 수 없습니다.');
    if (article.userId !== userId) throw new Error('게시글 수정 권한이 없습니다.');

    return this.articleRepo.update(articleId, data);
  }

  async deleteArticle(userId: number, articleId: number) {
    const article = await this.articleRepo.findById(articleId);
    if (!article) throw new Error('게시글을 찾을 수 없습니다.');
    if (article.userId !== userId) throw new Error('게시글 삭제 권한이 없습니다.');

    return this.articleRepo.delete(articleId);
  }
}