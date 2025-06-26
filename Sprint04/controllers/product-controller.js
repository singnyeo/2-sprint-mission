import prisma from '../lib/prisma.js';

export async function createProduct(req, res) {
  const { name, description, price, tags } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: '상품명, 설명, 가격은 필수입니다.' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        tags,
        userId: req.user.id,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('상품 등록 실패:', error);
    res.status(500).json({ message: '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}