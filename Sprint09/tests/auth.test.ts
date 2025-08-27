import request from 'supertest';
import app from '../src/app';
import { setupTestDB, teardownTestDB, testUser, plainPassword } from './setup';

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe('인증 API', () => {
  it('회원가입', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: `new${Date.now()}@test.com`,
        password: '1234',
        nickname: 'newtester',
        image: 'default.png',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('로그인', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: plainPassword,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('잘못된 로그인 시도', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
  });
});
