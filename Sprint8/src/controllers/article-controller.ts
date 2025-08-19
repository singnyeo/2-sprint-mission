import { Request, Response } from 'express';
import { ArticleService } from '../service/article-service';

const articleService = new ArticleService();

export async function createArticle(req: Request, res: Response) {
  const userId = req.user.id;
  const { title, content, productId } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
  }

  try {
    const article = await articleService.createArticle(userId, {
      title,
      content,
      productId: productId ? parseInt(productId) : undefined,
    });
    res.status(201).json({ message: '게시글 등록 완료', article });
  } catch (error: any) {
    console.error('게시글 등록 실패:', error);
    res.status(500).json({ message: error.message || '게시글 등록 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function getArticles(req: Request, res: Response) {
  try {
    const articles = await articleService.getArticles();
    res.status(200).json(articles);
  } catch (error: any) {
    console.error('게시글 목록 조회 실패:', error);
    res.status(500).json({ message: error.message || '게시글 목록 조회 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function getArticleById(req: Request, res: Response) {
  const articleId = parseInt(req.params.id);
  const userId = req.user?.id;

  try {
    const article = await articleService.getArticleById(articleId, userId);
    res.status(200).json(article);
  } catch (error: any) {
    console.error('게시글 조회 실패:', error);
    res.status(404).json({ message: error.message || '게시글을 찾을 수 없습니다.' });
  }
}

export async function updateArticle(req: Request, res: Response) {
  const userId = req.user.id;
  const articleId = parseInt(req.params.id);
  const { title, content } = req.body;

  try {
    const updatedArticle = await articleService.updateArticle(userId, articleId, { title, content });
    res.status(200).json({ message: '게시글 수정 완료', article: updatedArticle });
  } catch (error: any) {
    console.error('게시글 수정 실패:', error);
    res.status(400).json({ message: error.message || '게시글 수정 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function deleteArticle(req: Request, res: Response) {
  const userId = req.user.id;
  const articleId = parseInt(req.params.id);

  try {
    await articleService.deleteArticle(userId, articleId);
    res.status(200).json({ message: '게시글 삭제 완료' });
  } catch (error: any) {
    console.error('게시글 삭제 실패:', error);
    res.status(400).json({ message: error.message || '게시글 삭제 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}