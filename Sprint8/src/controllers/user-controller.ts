import { Request, Response } from 'express';
import { UserService } from '../service/user-service';

const userService = new UserService();

export async function getUserProfile(req: Request, res: Response) {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error('유저 정보 조회 실패:', error);
    res.status(500).json({ message: error.message || '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  const { nickname, image, currentPassword, newPassword } = req.body;

  try {
    const updated = await userService.updateUserProfile(req.user.id, {
      nickname,
      image,
      currentPassword,
      newPassword,
    });

    res.status(200).json({ message: '유저 정보가 성공적으로 수정되었습니다.', user: updated });
  } catch (error: any) {
    console.error('유저 정보 수정 실패:', error);
    res.status(400).json({ message: error.message || '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function getMyProducts(req: Request, res: Response) {
  try {
    const products = await userService.getMyProducts(req.user.id);
    res.status(200).json(products);
  } catch (error: any) {
    console.error('내 상품 목록 조회 실패:', error);
    res.status(500).json({ message: error.message || '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}
