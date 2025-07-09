import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

export async function getUserProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    res.status(200).json(user);
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    res.status(500).json({ message: '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function updateUserProfile(req, res) {
  const { nickname, image, currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: '비밀번호 변경 시 현재 비밀번호를 입력해주세요.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
      }
    }

    const dataToUpdate = { nickname, image };
    if (newPassword) {
      dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ message: '유저 정보가 성공적으로 수정되었습니다.', user: updatedUser });
  } catch (error) {
    console.error('유저 정보 수정 실패:', error);
    res.status(500).json({ message: '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function getMyProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('내 상품 목록 조회 실패:', error);
    res.status(500).json({ message: '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}