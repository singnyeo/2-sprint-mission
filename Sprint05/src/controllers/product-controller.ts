import { Request, Response } from 'express';
import { ProductService } from '../service/product-service';

const productService = new ProductService();

export async function createProduct(req: Request, res: Response) {
  const userId = req.user.id;
  const { name, description, price, tags } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: '상품명, 설명, 가격은 필수입니다.' });
  }

  try {
    const product = await productService.createProduct(userId, {
      name,
      description,
      price: parseFloat(price),
      tags,
    });
    res.status(201).json({ message: '상품 등록 완료', product });
  } catch (error: any) {
    console.error('상품 등록 실패:', error);
    res.status(500).json({ message: error.message || '상품 등록 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const userId = req.user.id;
  const productId = parseInt(req.params.id);
  const { name, description, price, tags } = req.body;

  try {
    const updatedProduct = await productService.updateProduct(userId, productId, {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      tags,
    });
    res.status(200).json({ message: '상품 수정 완료', product: updatedProduct });
  } catch (error: any) {
    console.error('상품 수정 실패:', error);
    res.status(400).json({ message: error.message || '상품 수정 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const userId = req.user.id;
  const productId = parseInt(req.params.id);

  try {
    await productService.deleteProduct(userId, productId);
    res.status(200).json({ message: '상품 삭제 완료' });
  } catch (error: any) {
    console.error('상품 삭제 실패:', error);
    res.status(400).json({ message: error.message || '상품 삭제 실패. 서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function getProductById(req: Request, res: Response) {
  const productId = parseInt(req.params.id);
  const userId = req.user?.id;

  try {
    const product = await productService.getProductById(productId, userId);
    res.status(200).json(product);
  } catch (error: any) {
    console.error('상품 조회 실패:', error);
    res.status(404).json({ message: error.message || '상품을 찾을 수 없습니다.' });
  }
}