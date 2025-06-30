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
    res.status(201).json({ message: '상품 등록 완료', product });
  } catch (error) {
    console.error('상품 등록 실패:', error);
    res.status(500).json({ message: '상품 등록 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function updateProduct(req, res) {
  const productId = parseInt(req.params.id);
  const { name, description, price, tags } = req.body;

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    if (product.userId !== req.user.id) {
      return res.status(403).json({ message: '상품 수정 권한이 없습니다.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        tags,
      },
    });
    res.status(200).json({ message: '상품 수정 완료', product: updatedProduct });
  } catch (error) {
    console.error('상품 수정 실패:', error);
    res.status(500).json({ message: '상품 수정 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function deleteProduct(req, res) {
  const productId = parseInt(req.params.id);

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    if (product.userId !== req.user.id) {
      return res.status(403).json({ message: '상품 삭제 권한이 없습니다.' });
    }

    await prisma.product.delete({ where: { id: productId } });
    res.status(200).json({ message: '상품 삭제 완료' });
  } catch (error) {
    console.error('상품 삭제 실패:', error);
    res.status(500).json({ message: '상품 삭제 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function getProductById(req, res) {
  const productId = parseInt(req.params.id);
  const userId = req.user?.id;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        likes: true,
      },
    });

    if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });

    const isLiked = userId ? product.likes.some((like) => like.userId === userId) : false;

    const response = {
      ...product,
      isLiked,
    };

    delete response.likes;

    res.status(200).json(response);
  } catch (error) {
    console.error('상품 조회 실패:', error);
    res.status(500).json({ message: '서버 에러' });
  }
}