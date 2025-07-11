import prisma from '../lib/prisma';
import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import { Request, Response, NextFunction } from 'express';

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  try {
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
    const { userId } = payload;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
}

export default authenticate;
