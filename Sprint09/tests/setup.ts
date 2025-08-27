import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export let testUser: any;
export let authToken: string;
export let plainPassword: string;

export async function setupTestDB() {
  // 기존 데이터 삭제
  await prisma.article.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // 유니크 이메일 생성
  const uniqueEmail = `test+${Date.now()}@test.com`;
  plainPassword = '1234';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 테스트 유저 생성
  testUser = await prisma.user.create({
    data: {
      email: uniqueEmail,
      password: hashedPassword,
      nickname: 'tester',
      image: 'default.png',
    },
  });

  // 테스트 상품 생성
  await prisma.product.create({
    data: {
      name: '테스트 상품',
      description: '테스트용 상품입니다',
      price: 1000,
      userId: testUser.id, // userId 필요 시
    },
  });

  // 테스트 게시글 생성
  await prisma.article.create({
    data: {
      title: '테스트 게시글',
      content: '테스트 내용입니다',
      userId: testUser.id,
    },
  });

  // JWT 토큰 생성
  authToken = jwt.sign(
    { userId: testUser.id },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '1h' }
  );

  return { testUser, authToken, prisma, plainPassword };
}

// 테스트 종료 후 정리
export async function teardownTestDB() {
  await prisma.article.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
}
