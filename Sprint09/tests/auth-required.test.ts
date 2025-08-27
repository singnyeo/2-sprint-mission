import request from 'supertest';
import app from '../src/app';
import { setupTestDB, teardownTestDB, authToken, testUser, plainPassword } from './setup';

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe('Article & Product API - 인증 필요', () => {
  let articleId: number;
  let productId: number;

  // 게시글 등록
  it('게시글 등록', async () => {
    const res = await request(app)
      .post('/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: '인증 테스트 게시글', content: '내용 테스트' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    articleId = res.body.id;
  });

  // 게시글 수정
  it('게시글 수정', async () => {
    const res = await request(app)
      .patch(`/articles/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: '수정 내용' });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe('수정 내용');
  });

  // 게시글 삭제
  it('게시글 삭제', async () => {
    const res = await request(app)
      .delete(`/articles/${articleId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });

  // 상품 등록
  it('상품 등록', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: '인증 테스트 상품', description: '테스트', price: 3000 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    productId = res.body.id;
  });

  // 상품 수정
  it('상품 수정', async () => {
    const res = await request(app)
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ price: 3500 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(3500);
  });

  // 상품 삭제
  it('상품 삭제', async () => {
    const res = await request(app)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});

describe('인증 실패 시', () => {
  it('JWT 없이 게시글 등록 시 401', async () => {
    const res = await request(app)
      .post('/articles')
      .send({ title: '실패 테스트', content: '내용' });

    expect(res.status).toBe(401);
  });

  it('JWT 없이 상품 등록 시 401', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: '실패 상품', description: '테스트', price: 1000 });

    expect(res.status).toBe(401);
  });
});
