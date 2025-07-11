import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constants';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

interface JwtPayload {
  id: number;
}

export function generateTokens(userId: number): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    return { userId: decoded.id };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
    return { userId: decoded.id };
  } catch {
    return null;
  }
}