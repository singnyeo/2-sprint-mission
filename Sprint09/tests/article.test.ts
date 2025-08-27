import request from 'supertest';
import app from '../src/app';
import { setupTestDB, teardownTestDB, authToken } from './setup';

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe('Article API - 인증 불필요', () => {
  it('특정 게시글 조회', async () => {
    const res = await request(app).get('/articles/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title');
  });
});

describe('Article API - 인증 필요', () => {
  it('게시글 등록', async () => {
    const res = await request(app)
      .post('/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: '새 게시글', content: '내용 테스트' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('게시글 수정', async () => {
    const res = await request(app)
      .patch('/articles/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: '수정 내용' });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe('수정 내용');
  });

  it('게시글 삭제', async () => {
    const res = await request(app)
      .delete('/articles/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});
