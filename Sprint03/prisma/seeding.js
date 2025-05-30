const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.file.deleteMany();

  const product1 = await prisma.product.create({
    data: {
      name: "노트북",
      description: "삼성 노트북",
      price: 1500,
      tags: "전자기기,컴퓨터",
      article: {
        create: [
          {
            title: "삼성 노트북",
            content: "좋아요",
          },
          {
            title: "노트북 사용 팁",
            content: "효율적인 사용법 공유합니다.",
          },
        ],
      },
    },
  });

  await prisma.comment.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      productId: product1.id,
      content: `노트북 댓글 ${i + 1}`,
    })),
  });

  const product2 = await prisma.product.create({
    data: {
      name: "스마트폰",
      description: "최신형 스마트폰",
      price: 1000,
      tags: "전자기기,모바일",
      article: {
        create: [
          {
            title: "스마트폰 카메라 리뷰",
            content: "사진 품질이 아주 뛰어납니다.",
          },
        ],
      },
    },
  });

  await prisma.comment.createMany({
    data: Array.from({ length: 20 }, (_, i) => ({
      productId: product2.id,
      content: `스마트폰 댓글 ${i + 1}`,
    })),
  });

  console.log("시딩 완료!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
