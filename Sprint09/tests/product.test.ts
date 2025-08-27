import request from 'supertest';
import app from '../src/app';
import { setupTestDB, teardownTestDB, authToken } from './setup';

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe('Product API - 인증 불필요', () => {
  it('상품 전체 조회', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('특정 상품 조회', async () => {
    const res = await request(app).get('/products/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
  });
});

describe('Product API - 인증 필요', () => {
  it('상품 등록', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: '새 상품', description: '테스트', price: 2000 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('상품 수정', async () => {
    const res = await request(app)
      .patch('/products/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ price: 1500 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(1500);
  });

  it('상품 삭제', async () => {
    const res = await request(app)
      .delete('/products/1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});
